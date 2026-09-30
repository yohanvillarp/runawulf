# Guía de Contribución a Runawulf

¡Gracias por tu interés en contribuir a **Runawulf**!  
Runawulf es un plano de control local, ligero y basado en eventos para la seguridad en Linux, telemetría y aislamiento automatizado de red.

> 🇬🇧 **English speaker?** Please refer to the canonical [Contributing Guide in English](./CONTRIBUTING.md).

---

## 1. Reglas Fundamentales y Estándares de Código

Antes de escribir código, por favor revisa nuestra arquitectura y restricciones:
1. **Los 10 Invariantes de Seguridad Inmutables:** Consulta [AGENTS.md](./AGENTS.md). Todo Pull Request debe respetar estrictamente los invariantes I1 al I10. Cualquier código que vulnere estos principios se considera un defecto crítico de seguridad.
2. **Convención de Idioma en el Código:** Todo el código fuente, nombres de variables, tipos en TypeScript, docstrings y mensajes de commit en Git deben redactarse obligatoriamente en **inglés**.
3. **Tipado Estricto:** Prohibido el uso de `any`. Toda entrada externa no confiable (paquetes de red, logs de Suricata, payloads HTTP) debe validarse con esquemas Zod.
4. **Límites de Longitud de Archivos y Modularidad:**
   * Componentes de interfaz React (`.tsx`): **Máximo 250 líneas**.
   * Módulos de lógica backend (`.ts`): **Máximo 350 líneas**.
   * Archivos que superen este umbral deben modularizarse en subcomponentes o servicios de responsabilidad única.
5. **Paridad Multiplataforma:** Los saltos de línea se normalizan automáticamente a `LF` mediante `.gitattributes` para trabajar de forma idéntica en Linux y Windows.

---

## 2. Flujo de Trabajo Git Empresarial (Enterprise GitFlow)

Seguimos un modelo estructurado de ramas:

```text
main (Producción / Versiones Estables con Tag SemVer)
  ▲
  │ (Pull Request de Release)
develop (Rama Troncal de Integración Activa)
  ▲
  ├────── feature/v2-foundation
  ├────── feature/ebpf-tracing
  └────── fix/quarantine-timeout
```

* **`main`:** Rama protegida de producción. Prohibido el push directo.
* **`develop`:** Rama de integración continua. Toda nueva característica o corrección se mergea aquí vía Pull Request.
* **Nomenclatura de Ramas:**
  * `feature/<alcance>-<descripcion>` (ej. `feature/sensor-ringbuf`)
  * `fix/<alcance>-<descripcion>` (ej. `fix/memory-leak-procfs`)
  * `sec/<invariante-o-id>` (ej. `sec/i2-execfile-guard`)

---

## 3. Convención de Mensajes de Commit (Conventional Commits)

Los commits deben ser **atómicos y modulares** (un solo cambio lógico por commit):

```text
<tipo>(<alcance>): <descripción corta en modo imperativo>

[cuerpo explicativo opcional]
```

### Tipos Permitidos:
* `feat`: Nueva característica o capacidad del sistema.
* `fix`: Corrección de un error.
* `sec`: Parche o endurecimiento de seguridad.
* `refactor`: Cambio de código que no altera el comportamiento externo.
* `docs`: Documentación o planes de arquitectura.
* `chore`: Tareas de build, dependencias o configuración.
* `test`: Adición o corrección de pruebas.
* `perf`: Mejora de rendimiento.

---

## 4. Configuración del Entorno Local

### Requisitos Previos
* Node.js $\ge$ 20.0.0
* npm $\ge$ 9.0.0
* Linux (recomendado Ubuntu 22.04 LTS) o Windows 11 con PowerShell 7+

### Pasos Iniciales
```bash
# Clonar el repositorio
git clone https://github.com/yohanvillarp/runawulf.git
cd runawulf

# Instalar dependencias e inicializar los hooks de Husky
npm install

# Verificar puertas de calidad y límites de líneas
npm run lint:lengths

# Comprobar tipos en todo el monorepo
npm run typecheck

# Ejecutar suite de pruebas
npm test
```

---

## 5. Envío de un Pull Request

1. Crea tu rama a partir de `develop`:
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/mi-nueva-capacidad
   ```
2. Realiza tus cambios en commits pequeños, limpios y modulares.
3. Asegura que `npm run lint:lengths` y `npm run typecheck` pasen sin errores.
4. Sube tu rama a tu fork o remoto y abre un Pull Request contra `develop`.
5. Completa la lista de verificación de nuestra [Plantilla de Pull Request](.github/pull_request_template.md).

¡Gracias por ayudar a proteger la infraestructura Linux con determinismo y alto rendimiento!
