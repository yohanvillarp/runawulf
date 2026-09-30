# Plan de Estructura y Andamiaje Arquitectónico — Runawulf

> **Documento de Especificación de Estructura de Directorios y Archivos**  
> **Patrón:** Monorepo Modular (npm workspaces) + Hexagonal / Clean Architecture (Backend) + Feature-Sliced Design (Frontend)  
> **Estado:** Listo para creación de esqueletos (sin lógica de negocio)

---

## 1. Visión General del Espacio de Trabajo (Monorepo)

Para cumplir con la estricta separación de privilegios, seguridad IPC y desacoplamiento de la interfaz gráfica, el repositorio se estructura como un **Monorepo gestionado por `npm workspaces`**:

```text
runawulf/
├── apps/                          # Aplicaciones ejecutables
│   ├── daemon/                    # [runawulfd] Daemon web sin privilegios (Fastify + EventBus)
│   ├── helper/                    # [runawulf-helper] Servicio IPC restringido (Root / Systemd)
│   ├── cli/                       # [runawulfctl] Herramienta CLI para terminal y rescate
│   └── web/                       # [Frontend] SPA React 19 estructurado bajo Feature-Sliced Design
│
├── packages/                      # Librerías y contratos compartidos
│   ├── contracts/                 # Esquemas Zod, Tipos TypeScript, Interfaces de Capacidades
│   └── tsconfig/                  # Configuraciones base de TypeScript
│
├── config/                        # Plantillas de configuración por defecto
├── systemd/                       # Definiciones de servicios y sockets para Linux
├── docs/                          # Documentación y especificaciones
└── package.json                   # Configuración raíz de npm workspaces
```

---

## 2. Desglose Detallado de Carpetas y Archivos

### A. Paquetes Compartidos (`packages/`)

#### 1. `packages/contracts/` *(El corazón de los contratos y tipos)*
Define el lenguaje común entre el daemon, el helper, la CLI y la web sin depender de implementaciones:
```text
packages/contracts/
├── package.json
├── tsconfig.json
└── src/
    ├── index.ts                   # Exportación de todos los contratos
    ├── capabilities/              # Interfaces del Core Engine
    │   ├── Readable.ts            # interface Readable<TState>
    │   ├── Observable.ts          # interface Observable<TTelemetry>
    │   ├── Actionable.ts          # interface Actionable<TAction, TResult>
    │   ├── Configurable.ts        # interface Configurable<TConfig>
    │   └── index.ts
    ├── ipc/                       # Protocolo de comunicación Daemon <-> Helper
    │   ├── IpcEnvelope.ts         # Tipado de paquete (version, requestId, deadline)
    │   ├── IpcOperations.ts       # Enum/Constantes de operaciones permitidas
    │   └── schemas.ts             # Esquemas Zod de payload para cada operación
    ├── events/                    # Eventos del sistema (Hechos inmutables)
    │   ├── SystemEvent.ts         # Estructura base de evento
    │   ├── SecurityEvents.ts      # SecurityThreatDetected, IpBlockedEvent
    │   └── TelemetryEvents.ts     # ResourceThresholdExceededEvent
    ├── commands/                  # Comandos del sistema (Intenciones autorizadas)
    │   ├── SystemCommand.ts       # Envoltorio de comando con actor y contexto
    │   ├── FirewallCommands.ts    # BlockIpCommand, ApplyRuleSetCommand
    │   └── ServiceCommands.ts     # RestartServiceCommand
    ├── audit/                     # Estructura del registro de auditoría
    │   └── AuditEntry.ts          # Esquema de fila para audit.db (con hashes y HMAC)
    ├── modules/                   # Especificación de módulos declarativos
    │   └── ManifestSchema.ts      # Esquema Zod de validación de .rwmod.yaml
    └── config/                    # Esquema de configuración de los archivos YAML
        ├── daemonConfigSchema.ts  # /etc/runawulf/config.yaml
        └── helperPolicySchema.ts  # /etc/runawulf/privileged-policy.yaml
```

---

### B. Aplicaciones Backend y de Sistema (`apps/`)

#### 2. `apps/helper/` *(El proceso privilegiado root-owned)*
Un ejecutable autónomo, con el mínimo estricto de dependencias (sin Fastify ni librerías web):
```text
apps/helper/
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                    # Punto de entrada del helper
    ├── ipc/                       # Servidor de Unix Domain Socket
    │   ├── SocketServer.ts        # Manejo de conexión y lifecycle del socket
    │   ├── PeerCredentials.ts     # Extracción y verificación de SO_PEERCRED (UID)
    │   └── Dispatcher.ts          # Enrutador estricto hacia los adaptadores
    ├── security/                  # Guardrails y verificación de políticas
    │   ├── PolicyLoader.ts        # Lector de /etc/runawulf/privileged-policy.yaml
    │   └── InvariantsValidator.ts # Verificación de allowlists y canales protegidos
    ├── adapters/                  # Adaptadores de plataforma
    │   ├── nftables/              # Manipulación de `table inet runawulf`
    │   │   ├── NftClient.ts       # Invocación estructurada de nft -j
    │   │   ├── DynamicSets.ts     # Manejo de sets con flags timeout (O(1))
    │   │   └── WatchdogRollback.ts# Máquina de estados PREPARE/APPLY/COMMIT/ROLLBACK
    │   └── systemd/               # Integración de servicios autorizados
    │       └── SystemdClient.ts   # Interacción con unidades permitidas
    └── audit/                     # Firma criptográfica
        └── HmacSigner.ts          # Generador de HMAC con /etc/runawulf/audit.key
```

#### 3. `apps/daemon/` *(El plano de control y servidor web sin privilegios)*
Corre con el usuario `runawulf` sin capabilities. Estructurado con Clean/Hexagonal Architecture:
```text
apps/daemon/
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                    # Punto de entrada y orquestador del ciclo de vida
    ├── core/                      # Dominio de aplicación
    │   ├── bus/                   # Enrutamiento interno
    │   │   ├── EventBus.ts        # Publicador/Suscriptor en memoria para eventos
    │   │   └── CommandBus.ts      # Pipeline unificado (Authorize -> Policy -> Helper)
    │   ├── policy/                # Motor de decisiones
    │   │   ├── PolicyEngine.ts    # Evaluador de reglas (Trigger -> Condition -> Action)
    │   │   ├── Guardrails.ts      # Límites de frecuencia, listas blancas e idempotencia
    │   │   └── RuleMatcher.ts     # Lógica de coincidencia de eventos
    │   └── modules/               # Registro y runtime de módulos
    │       ├── ModuleRegistry.ts  # Registro en memoria de módulos activos
    │       └── ManifestParser.ts  # Validador de manifiestos con mitigación anti-SSRF
    ├── infrastructure/            # Persistencia y adaptadores externos
    │   ├── storage/               # Bases de datos SQLite
    │   │   ├── StateDatabase.ts   # state.db (usuarios, sesiones, políticas)
    │   │   └── AuditDatabase.ts   # audit.db (append-only con HMAC y anclaje)
    │   ├── ipc/                   # Cliente del Unix Domain Socket
    │   │   └── HelperClient.ts    # Envío de IpcEnvelope hacia el helper
    │   ├── telemetry/             # Recolección sin subprocesos
    │   │   ├── ProcfsReader.ts    # Lectura de /proc (stat, meminfo, net/dev)
    │   │   └── SysfsReader.ts     # Lectura de /sys
    │   ├── intrusion/             # Ingestor de IDS
    │   │   └── SuricataFollower.ts# Seguimiento resiliente de eve.json (inodo + offset)
    │   └── config/                # Carga y recarga en caliente
    │       ├── ConfigLoader.ts    # Parser de /etc/runawulf/config.yaml
    │       └── SignalHandler.ts   # Captura de SIGHUP, SIGTERM, SIGINT
    └── transport/                 # Exposición externa
        ├── http/                  # Servidor Fastify
        │   ├── server.ts          # Configuración del servidor y middlewares
        │   ├── routes/            # Endpoints REST (/api/v2/auth, /api/v2/services, etc.)
        │   ├── middlewares/       # AuthGuard (Session Cookie), RateLimit, SecurityHeaders
        │   └── static.ts          # Servidor de archivos estáticos (/usr/share/runawulf/web)
        └── ws/                    # Gateway de tiempo real
            ├── WebSocketServer.ts # Manejo de conexiones y canalización de eventos
            └── OriginGuard.ts     # Validación estricta de Origin (anti-CSWSH)
```

#### 4. `apps/cli/` *(Herramienta administrativa `runawulfctl`)*
```text
apps/cli/
├── package.json
├── tsconfig.json
└── src/
    ├── main.ts                    # Punto de entrada de la CLI
    └── commands/                  # Subcomandos disponibles
        ├── bootstrap.ts           # Creación del primer usuario administrador
        ├── health.ts              # Comprobación de estado del daemon y helper
        ├── auditVerify.ts         # Verificación de integridad de la cadena HMAC
        └── resetPassword.ts       # Reseteo de credenciales de emergencia
```

---

### C. Aplicación Visual (`apps/web/` — Feature-Sliced Design)

La interfaz se estructura con la metodología **Feature-Sliced Design (FSD)**, garantizando un desacoplamiento estricto por capas de abstracción:

```text
apps/web/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── app/                       # [Capa 1: App] Inicialización global
    │   ├── App.tsx                # Componente raíz con enrutador
    │   ├── main.tsx               # Entry point de React 19
    │   ├── providers/             # AuthProvider, WebSocketProvider, ThemeProvider
    │   ├── router/                # Definición de rutas del cliente
    │   └── styles/                # Tailwind CSS y variables de diseño
    │
    ├── pages/                     # [Capa 2: Pages] Vistas completas enrutables
    │   ├── DashboardPage/         # Vista principal de resumen
    │   ├── FirewallPage/          # Vista del firewall Algiz (nftables)
    │   ├── IntrusionPage/         # Vista de detección de amenazas Eiwaz (Suricata)
    │   ├── MonitoringPage/        # Vista de telemetría del sistema Raido
    │   ├── AuditLedgerPage/       # Vista de registros forenses y verificación HMAC
    │   └── SettingsPage/          # Configuración y módulos del sistema
    │
    ├── widgets/                   # [Capa 3: Widgets] Bloques de UI compuestos
    │   ├── Navbar/                # Barra superior con estado de conexión y usuario
    │   ├── Sidebar/               # Navegación lateral entre secciones
    │   ├── TelemetryGrid/         # Cuadrícula en vivo de CPU, RAM, Red y Disco
    │   ├── ThreatFeed/            # Lista de eventos de seguridad en tiempo real
    │   ├── FirewallRulesTable/    # Tabla interactiva de reglas y sets de bloqueo
    │   └── AuditLogViewer/        # Visor cronológico con estado de integridad criptográfica
    │
    ├── features/                  # [Capa 4: Features] Interacciones de usuario y casos de uso
    │   ├── auth-by-session/       # Formulario de login, logout y expiración de sesión
    │   ├── block-ip/              # Modal y acción para bloquear una IP manualmente
    │   ├── unblock-ip/            # Acción para remover una IP del set de nftables
    │   ├── toggle-service/        # Botón para pausar/reiniciar un servicio permitido
    │   ├── filter-audit-logs/     # Filtros por actor, rango de fechas y estado
    │   └── toggle-automation/     # Activación/desactivación de reglas del Policy Engine
    │
    ├── entities/                  # [Capa 5: Entities] Conceptos del modelo de negocio
    │   ├── system-metric/         # Tipos y tarjetas visuales de CPU/RAM
    │   ├── security-threat/       # Modelado de evento IDS, severidad e insignia
    │   ├── firewall-set/          # Representación de IP bloqueada y tiempo restante
    │   ├── audit-entry/           # Fila de auditoría con badge de validez de HMAC
    │   └── system-unit/           # Tarjeta de estado de unidad systemd
    │
    └── shared/                    # [Capa 6: Shared] Reutilizables independientes de negocio
        ├── api/                   # Cliente HTTP (fetch relativo) y WebSocket client
        ├── ui/                    # Componentes base (Botón, Modal, Input, Badge, Card, Tabla)
        ├── lib/                   # Utilidades puras (formato de fechas, bytes, hashes)
        └── assets/                # Iconos, runas SVG y recursos gráficos
```

---

### D. Soporte del Sistema Operativo (`systemd/` y `config/`)

Archivos estáticos de configuración y units de systemd:
```text
runawulf/
├── config/
│   ├── runawulf.default.yaml      # Configuración de puerto, TLS, bind y logs
│   └── privileged-policy.default.yaml # Allowlist estricta de units y reglas para el helper
│
└── systemd/
    ├── runawulfd.service          # Servicio systemd para el daemon web (sin privilegios)
    ├── runawulf-helper.socket     # Socket unit (SocketUser=runawulf, SocketMode=0600)
    └── runawulf-helper.service    # Servicio activado por socket con sandboxing estricto
```

---

## 3. Plan de Creación de Archivos (Paso a Paso)

1. **Configuración Raíz:**
   * Crear `package.json` con `workspaces: ["packages/*", "apps/*"]` y `.gitignore`.
2. **Paquetes Compartidos (`packages/contracts/`):**
   * Crear `package.json`, `tsconfig.json` y la estructura de interfaces de capacidades y esquemas Zod (sin lógica, solo tipos).
3. **Esqueleto de Aplicaciones de Sistema (`apps/`):**
   * Crear las estructuras de carpetas y archivos `.ts` vacíos/exportando esqueletos para `daemon`, `helper` y `cli`.
4. **Esqueleto de la Interfaz Visual (`apps/web/`):**
   * Inicializar la estructura de carpetas de **Feature-Sliced Design (FSD)** con sus `index.ts` o componentes mínimos de declaración.
5. **Plantillas del Sistema (`config/` y `systemd/`):**
   * Escribir los archivos `.yaml` y `.service` / `.socket` de referencia.
