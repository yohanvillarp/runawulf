# Especificación de Arquitectura de Sistema — Runawulf

> **Documento de Diseño Técnico, Seguridad de Infraestructura y Fronteras de Privilegio**  
> **Estado:** Especificación de Arquitectura de Referencia (Congelada para Implementación)  
> **Ámbito:** Servidores Linux (Ubuntu 22.04 LTS+)

---

## 1. Declaración de Propósito e Identidad

Runawulf no busca ser un reemplazo de la terminal Linux ni una interfaz interactiva convencional como Cockpit o Webmin.

**Runawulf es un plano de control (*control plane*) local y ligero para Linux que unifica observabilidad, seguridad y operaciones del sistema mediante una arquitectura orientada a eventos, automatizaciones declarativas auditables y una estricta separación de privilegios.**

Su valor central reside en el bucle operativo coordinado:

```text
 ┌───────────┐      ┌─────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌─────────┐
 │  OBSERVE  ├─────►│  EVENT  ├─────►│  DECIDE  ├─────►│  ACTION  ├─────►│  VERIFY  ├─────►│  AUDIT  │
 └───────────┘      └─────────┘      └──────────┘      └──────────┘      └──────────┘      └─────────┘
  Telemetría         Normalización    Policy Engine     Command Bus        Prevención de    Registro HMAC
  /sys, /proc, IDS   de sucesos       (Reglas/Límites)  Helper Privilegiado Lockout (Watchdog) + Anchor Journal
```

---

## 2. Invariantes de Seguridad y Modelo de Amenazas

La arquitectura se fundamenta en diez invariantes inmutables que deben cumplirse en todo momento:

| # | Invariante Operativa | Garantía de Seguridad |
| :-: | :--- | :--- |
| **I1** | **El daemon web jamás ejecuta comandos privilegiados.** | `runawulfd` corre como usuario de sistema sin capabilities. Toda mutación sensible delega al helper vía IPC. |
| **I2** | **El helper jamás ejecuta comandos arbitrarios.** | No existe ninguna API `exec(command, args)` ni equivalente. El helper expone exclusivamente métodos de dominio cerrados y tipados. |
| **I3** | **El helper nunca confía en el daemon.** | El helper valida cada orden contra su propia política (`/etc/runawulf/privileged-policy.yaml`, propiedad de `root:root 0644`). Un compromiso de `runawulfd` no otorga root. |
| **I4** | **Runawulf solo modifica recursos de red propios.** | Opera estrictamente dentro del namespace `table inet runawulf`. Jamás altera ni destruye tablas creadas por Docker, UFW, Kubernetes o CrowdSec. |
| **I5** | **Los cambios de firewall poseen rollback autónomo.** | El temporizador de reversión (watchdog de 30s) reside en el helper root. Si el daemon o la red caen durante una prueba, el helper revierte a la regla anterior. |
| **I6** | **Toda mutación produce auditoría criptográfica.** | Incluidas las operaciones rechazadas por política. El registro se firma mediante HMAC con clave inaccesible para el daemon web. |
| **I7** | **Toda automatización es idempotente.** | Reprocesar una alerta o evento duplicado genera un `NOOP`, evitando saturación o desbordamiento de tablas. |
| **I8** | **Un módulo declarativo no puede ampliar privilegios por sí solo.** | Los módulos definen intenciones sobre recursos previamente autorizados por el administrador en la configuración de root. |
| **I9** | **Los eventos externos se consideran no confiables.** | Los logs de Suricata, métricas y peticiones web atraviesan validación de esquemas Zod y límites de tamaño antes de ser procesados. |
| **I10**| **El compromiso del frontend o del daemon no equivale a root.** | Es el objetivo central de la frontera de privilegios y el aislamiento por procesos del sistema. |

---

## 3. Topología de Procesos y Comunicación IPC

La arquitectura desacopla el servicio web del componente ejecutor de sistema operativo:

```text
       Cliente (Navegador Web / Red Local)
                       │
             HTTPS / WSS (Puerto 4000)
                       ▼
 ┌────────────────────────────────────────────────────────┐
 │   runawulfd (Daemon sin Privilegios)                   │
 │   Usuario de Sistema: `runawulf` (Sin Capabilities)    │
 │                                                        │
 │   ├── Fastify HTTP (REST + SPA estática en /usr/share) │
 │   ├── Gateway WebSocket (Validación estricta de Origin)│
 │   ├── Motor de Sesiones (Cookies HttpOnly, SameSite)   │
 │   ├── Event Bus Interno & Policy Engine                │
 │   ├── Base de Datos de Estado (`state.db`)             │
 │   └── Adaptadores de Telemetría (/proc, /sys en memoria│
 └─────────────────────────┬──────────────────────────────┘
                           │
             Unix Domain Socket Gestionado por Systemd
             (/run/runawulf/helper.sock - Permisos 0600)
                           │
 ┌─────────────────────────▼──────────────────────────────┐
 │   runawulf-helper (Proceso Restringido de Sistema)     │
 │   Socket Activation / Systemd Sandbox / Root Restringido│
 │                                                        │
 │   ├── Verificación de Kernel vía SO_PEERCRED (UID=runawulf)
 │   ├── Validación contra /etc/runawulf/privileged-policy.yaml
 │   ├── Protocolo IPC delimitado (Version, RequestId, Deadline)
 │   ├── Adaptador nftables (Exclusivo: table inet runawulf)
 │   ├── Adaptador systemd (D-Bus directo a unidades autorizadas)
 │   └── Auditor HMAC con anclaje a Journald              │
 └────────────────────────────────────────────────────────┘
```

### Protocolo y Aislamiento del Socket IPC
1. **Gestión por Systemd (`runawulf-helper.socket`):**
   * Configuración de socket unit: `SocketUser=runawulf`, `SocketGroup=runawulf`, `SocketMode=0600`.
   * Permite *Socket Activation*: el helper se activa bajo demanda al recibir tráfico en el socket.
2. **Autenticación en Espacio de Kernel:**
   * Al recibir una conexión, el helper invoca `getsockopt(..., SO_PEERCRED)` para obtener el `PID`, `UID` y `GID` del proceso cliente.
   * Si `UID !== runawulf`, la conexión se aborta inmediatamente antes de procesar bytes.
3. **Estructura del Mensaje IPC (Límite estricto `maxMessageBytes = 64KB`):**
   ```ts
   interface IpcRequestEnvelope {
     protocolVersion: '2.0';
     requestId: string;           // UUIDv4 para correlación y trazabilidad
     operation: string;           // ej. 'firewall.addBlock'
     payload: unknown;            // Validado con esquema Zod específico de la operación
     deadlineMs: number;          // Timeout máximo de procesamiento
   }
   ```
4. **Endurecimiento del Helper con Systemd:**
   * El servicio `runawulf-helper.service` incorpora:
     `NoNewPrivileges=yes`, `CapabilityBoundingSet=CAP_NET_ADMIN`, `ProtectSystem=strict`, `ProtectHome=yes`, `PrivateTmp=yes`, `RestrictAddressFamilies=AF_UNIX AF_NETLINK`.

---

## 4. Núcleo del Motor: Sistema Granular de Capacidades

Se descartan las clases abstractas rígidas. Los componentes del sistema implementan contratos de capacidades atómicas:

```ts
// 1. Capacidad de lectura puntual de estado
export interface Readable<TState> {
  getState(): Promise<TState>;
}

// 2. Capacidad de suscripción a eventos continuos o telemetría
export interface Observable<TTelemetry> {
  subscribe(): AsyncIterable<TTelemetry>;
}

// 3. Capacidad de ejecución de acciones sobre el sistema
export interface Actionable<TAction, TResult = ActionResult> {
  execute(action: TAction, ctx: ExecutionContext): Promise<TResult>;
}

// 4. Capacidad de modificación de configuraciones
export interface Configurable<TConfig> {
  getConfig(): Promise<TConfig>;
  applyConfig(config: TConfig, ctx: ExecutionContext): Promise<void>;
}
```

### Unificación de Mutaciones mediante Command Bus
Tanto las acciones directas (`Actionable`) como los cambios de configuración (`Configurable`) atraviesan obligatoriamente el mismo pipeline unificado:
```text
Actor (UI / Policy / API)
   │
   ▼
Command Envelope ──► Authorize (RBAC) ──► Policy Check ──► Command Handler ──► Helper IPC ──► Audit Log
```

---

## 5. Gestión de Red con `nftables` Transaccional

### A. Namespace Exclusivo de Runawulf
Runawulf opera únicamente sobre la tabla `table inet runawulf`. No sobrescribe ni interfiere con cadenas de Docker, UFW, Kubernetes o CrowdSec.

```nftables
table inet runawulf {
    # Sets dinámicos para bloqueos en O(1) con expiración en kernel
    set blocked_ipv4 {
        type ipv4_addr
        flags timeout
    }

    set blocked_ipv6 {
        type ipv6_addr
        flags timeout
    }

    chain input {
        type filter hook input priority -5; policy accept;
        
        # Conexiones establecidas y loopback siempre aceptadas
        iif "lo" accept
        ct state established,related accept

        # Bloqueo automático referenciando los sets
        ip saddr @blocked_ipv4 drop
        ip6 saddr @blocked_ipv6 drop
    }
}
```

### B. Bloqueos Temporales sin Regeneración de Ruleset
Para aplicar una orden como `blockAddress(ip: '1.2.3.4', duration: '30m')`, el helper no regenera el firewall completo. Ejecuta una mutación atómica sobre el set en memoria del kernel:
```bash
nft add element inet runawulf blocked_ipv4 { 1.2.3.4 timeout 30m }
```
El kernel de Linux administra la expiración de forma nativa en $O(1)$.

### C. Algoritmo de Rollback y Prevención de Lockout
Para cambios estructurales en las reglas del firewall, el helper implementa una máquina de estados transaccional con temporizador de seguridad autónomo:

```text
PREPARE (Validación de sintaxis con nft --check)
   │
   ▼
APPLY (Aplica canditato y arranca Watchdog de 30s en el Helper)
   │
   ├──────────────────────────────┬──────────────────────────────┐
   ▼                              ▼                              ▼
Daemon verifica conectividad    Fallo de red o Daemon crash    Timeout de 30s expirado
y envía: COMMIT(txId)           (Sin recepción de COMMIT)      sin confirmación
   │                              │                              │
   ▼                              ▼                              ▼
Helper cancela Watchdog        Helper ejecuta ROLLBACK        Helper ejecuta ROLLBACK
y consolida regla en disco     a snapshot previo              a snapshot previo
```

### D. Protección de Canales de Administración
Antes de aplicar un ruleset, el helper valida que se mantenga el acceso administrativo: interfaz de gestión, CIDR administrativo autorizado, puertos de gestión (SSH `:22`, Runawulf `:4000`), loopback e invariante de conexiones establecidas (`ct state established,related accept`).

---

## 6. Pipeline de Automatización: Eventos vs. Comandos

Se establece una estricta distinción semántica:
* **Event:** Hecho que **ya ocurrió** de forma inmutable (`SecurityThreatDetected`).
* **Command:** **Intención u orden** que debe ser evaluada y autorizada (`BlockIpCommand`).

```text
  [ Suricata EVE ] ──► Eiwaz ──► Emite: SecurityThreatDetected (Event)
                                            │
                                            ▼
                                     ┌─────────────┐
                                     │  Event Bus  │
                                     └──────┬──────┘
                                            │
                                            ▼
                                  ┌───────────────────┐
                                  │   Policy Engine   │
                                  │ (Reglas de Decisión)
                                  └─────────┬─────────┘
                                            │ Evalúa:
                                            │ - ¿IP en trusted_networks?
                                            │ - ¿Límite de bloqueos/min superado?
                                            │ - ¿Cooldown activo?
                                            ▼
                                Genera: BlockIpCommand (Command)
                                            │
                                            ▼
                                  ┌───────────────────┐
                                  │  Command Handler  │
                                  └─────────┬─────────┘
                                            │ Envía vía IPC (SO_PEERCRED)
                                            ▼
                                  ┌───────────────────┐
                                  │  runawulf-helper  │ ──► nftables (Set timeout)
                                  └─────────┬─────────┘
                                            │
                                            ▼
                                     Registra Auditoría
                                ┌───────────┴───────────┐
                                ▼                       ▼
                           WebSocket             audit.db (HMAC)
                        (Notificación)          + Anchor a Journald
```

### Ingesta Resiliente de Suricata (Eiwaz)
* Eiwaz consume `eve.json` rastreando la tupla de persistencia: `{ device, inode, offset, lastEventTimestamp }`.
* Resiste rotación de logs (`logrotate`), truncamiento de archivos y caídas del daemon.
* Semántica de entrega: **At-least-once + Idempotencia**. Si un evento se reprocesa, la acción sobre el set resulta en un `NOOP`.

---

## 7. Extensibilidad Segura y Mitigación de SSRF

Los módulos no pueden ejecutar código ejecutable arbitrario. Se definen mediante **Manifiestos Declarativos** basados en intenciones:

```yaml
apiVersion: runawulf.io/v1alpha1
kind: DeclarativeModule
metadata:
  id: nginx-monitor
  name: "Nginx Monitor & Operations"
  version: 1.0.0

resources:
  systemdUnits:
    - name: nginx.service
      permittedActions: [status, reload, restart]

  healthChecks:
    - type: http
      endpoint: "http://127.0.0.1:8080/stub_status"
      interval: 10s
      expectedStatus: 200
      metricExtraction:
        activeConnections:
          jsonPath: "$.active"

# Declaración de permisos que deben coincidir con la configuración de root
requiredPermissions:
  - "service:nginx.service:restart"
  - "service:nginx.service:read"
```

### Protecciones contra SSRF en Health Checks:
1. **Restricción de Esquemas:** Solo `http` y `https` (se bloquean `file://`, `gopher://`, `unix://`).
2. **Lista Negra de Destinos:** Bloqueo terminante de direcciones de metadatos cloud (`169.254.169.254`), interfaces de broadcast y rangos de loopback fuera de los puertos explícitamente autorizados.
3. **Comportamiento HTTP Seguro:** Redirecciones deshabilitadas (`redirects: false`), timeout estricto de 3 segundos y límite máximo de respuesta de 16 KB.
4. **Cero Scripting Embebido:** La extracción de métricas se restringe a selectores JSONPath o código de estado HTTP; prohíbe evaluar código JS/Lua en runtime.

---

## 8. Persistencia y Auditoría Criptográfica (Tamper-Evidence)

Para garantizar integridad y evitar conflictos de ciclo de vida, se separan físicamente las bases de datos SQLite en modo WAL:

```
/var/lib/runawulf/
├── state.db                     # Usuarios, sesiones, políticas, módulos (mutable)
└── audit.db                     # Registro cronológico de auditoría (solo inserción)
```

### Estructura del Registro de Auditoría con HMAC:
```sql
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    actor_type TEXT NOT NULL,         -- 'USER_SESSION' | 'POLICY_AUTOMATION' | 'SYSTEM'
    actor_id TEXT NOT NULL,           -- Username o Policy ID
    action_type TEXT NOT NULL,        -- 'FIREWALL_BLOCK' | 'SERVICE_RESTART'
    target_resource TEXT NOT NULL,    -- 'table:inet:runawulf' | 'nginx.service'
    payload_json TEXT NOT NULL,       -- Datos canónicos de la orden
    status TEXT NOT NULL,             -- 'SUCCESS' | 'REJECTED' | 'ERROR'
    execution_duration_ms INTEGER,
    client_ip TEXT,
    prev_entry_hmac TEXT NOT NULL,    -- HMAC del registro anterior
    entry_hmac TEXT NOT NULL          -- HMAC-SHA256(secretKey, prev_entry_hmac + canonicalPayload)
);
```

### Garantías contra Manipulación:
* **Clave Secreta en Root:** La clave criptográfica para generar `entry_hmac` reside en `/etc/runawulf/audit.key` (propiedad `root:root 0400`). El daemon `runawulfd` no puede leerla; los HMAC son generados exclusivamente por el helper.
* **Anclaje Periódico (External Anchor):** Cada 100 eventos (o cada hora), el helper emite el hash del último evento hacia **systemd journald** (`/dev/log`). Si un atacante trunca la base de datos `audit.db`, la discrepancia con el journal del sistema operativo expone la manipulación.

---

## 9. Jerarquía FHS y Transporte

### Distribución en el Sistema de Archivos:
* `/etc/runawulf/config.yaml`: Configuración estática de red, TLS y puertos (editable por sysadmin).
* `/etc/runawulf/privileged-policy.yaml`: Allowlist root-owned de unidades y reglas que el helper permite.
* `/etc/runawulf/audit.key`: Clave secreta HMAC (solo lectura para root).
* `/usr/local/bin/runawulfd`: Binario del daemon web y motor reactivo.
* `/usr/local/bin/runawulf-helper`: Binario del helper restringido de privilegios.
* `/usr/share/runawulf/web/`: Archivos compilados estáticos del frontend React.
* `/var/lib/runawulf/`: Almacenamiento persistente (`state.db`, `audit.db`).
* `/run/runawulf/`: Sockets en memoria volátil (`helper.sock`).

### Gateway Web y Autenticación:
* **Puerto Único (4000):** Sirve `/api/v2/*`, `/ws` y la interfaz web React sin solicitar dirección IP al usuario.
* **Sesiones Seguras:** Cookies con atributos `HttpOnly`, `SameSite=Strict`, `Secure`. Throttling de intentos de login y hash de contraseñas con Argon2id.
* **Protección WebSocket:** Validación obligatoria de cabecera `Origin` en el handshake HTTP antes de admitir la conexión WS (anti-CSWSH).
* **Recarga en Caliente (SIGHUP):** Lectura, parseo y validación atómica de `config.yaml`. Si el YAML contiene errores sintácticos, se descarta y se mantiene la configuración activa en memoria sin interrumpir el servicio.

---

## 10. Hoja de Ruta de Implementación (Roadmap Técnico)

```
FASE 0: Threat Model, Invariantes y Contratos de Dominio
├── Threat Model formal (límites de confianza y superficies de ataque)
├── Esquemas Zod (Events, Commands, IpcEnvelope, PolicyManifest)
└── Interfaces del sistema de capacidades (Readable, Actionable, Observable, Configurable)

FASE 1: Núcleo sin Privilegios (Daemon Base)
├── Servidor Fastify (HTTP, WebSocket, Cookies HttpOnly de sesión)
├── Bases de datos SQLite duales (state.db mutable + audit.db append-only)
└── EventBus en memoria y pipeline de Commands desacoplado

FASE 2: Frontera Privilegiada IPC y nftables Sandbox
├── Systemd socket activation (runawulf-helper.socket con permisos 0600)
├── Verificación de kernel vía SO_PEERCRED en el helper
├── Implementación de table inet runawulf y sets dinámicos con timeout
└── Máquina de estados Watchdog/Rollback (PREPARE, APPLY, COMMIT, ROLLBACK) en el helper

FASE 3: Adaptadores de Plataforma y Módulos Oficiales
├── Raido: Ingesta de telemetría leyendo /proc y /sys en memoria
├── Algiz: Control declarativo de nftables sobre el namespace propio
└── Eiwaz: Ingesta resiliente de Suricata EVE con seguimiento de inodo y offset

FASE 4: Policy Engine, Automatización y Guardrails
├── Evaluador de políticas (Trigger -> Conditions -> Actions)
├── Guardrails: Protección de canal administrativo, límites de frecuencia e idempotencia
└── Integración reactiva: Eiwaz -> Policy Engine -> Bloqueo automático en Algiz

FASE 5: Módulos Declarativos e Interfaz de Usuario
├── Validador de manifiestos declarativos y mitigación SSRF en health checks
├── Frontend React embebido acoplado a la API v2
└── runawulfctl (CLI para bootstrap de administrador inicial y comprobaciones)

FASE 6: Hardening, Inyección de Fallos y Empaquetado
├── Pruebas de inyección de fallos (crash del daemon durante rollback, rotación de logs, JSON corrupto)
├── Endurecimiento de systemd units (NoNewPrivileges, ProtectSystem, PrivateTmp)
└── Empaquetado .deb e instalador para Ubuntu 22.04+
```

---

## 11. Conclusión y Compromiso de Seguridad

Esta especificación convierte a Runawulf en un **control plane de grado de producción**. **Elimina la ejecución arbitraria de comandos en el diseño y minimiza drásticamente la superficie de ataque para RCE** mediante:
1. Una frontera de privilegios estricta que no confía en el daemon.
2. Contención total de red en el namespace `table inet runawulf` con expiración en kernel.
3. Un mecanismo autónomo de rollback ante fallos de conectividad.
4. Trazabilidad con HMAC y anclaje al journal del sistema operativo.
