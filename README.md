# Runawulf

Runawulf es una interfaz web para la administración y seguridad de servidores Ubuntu. Permite gestionar reglas de firewall, monitorear recursos del sistema y detectar intrusos en tiempo real, sin depender de la terminal.

La comunicación entre la interfaz y el servidor ocurre a través de WebSockets, lo que permite que los datos fluyan de forma continua y bidireccional sin necesidad de recargar la página.

> Este repositorio corresponde a la versión 1.0.0 del proyecto. La arquitectura y los módulos están funcionales. Consulta la rama `develop` para ver el trabajo en curso.

---

## Modulos disponibles

| Modulo | Runa | Estado |
| :--- | :--- | :--- |
| Monitor de Sistema | Raido | Disponible |
| Control de Firewall | Algiz | Disponible |
| Deteccion de Intrusos | Eiwaz | Disponible |
| Copias de Seguridad | Berkano | En desarrollo |

---

## Stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS
- Backend: Node.js, Express 5, TypeScript
- Comunicacion: WebSockets nativos (`ws`)
- Gestion de paquetes: pnpm
- Sistema: Ubuntu 20.04 LTS o superior
- Seguridad: Suricata IDS, iptables

---

## Prerequisitos

Este proyecto requiere acceso privilegiado al sistema para gestionar redes y servicios.

- Sistema operativo: Ubuntu 20.04 LTS o superior
- Node.js: v18.x o superior
- pnpm: v8.x o superior
- Dependencias del sistema: `suricata` e `iptables`

> Si no tienes Node.js instalado, descargalo desde su sitio oficial: https://nodejs.org/en/download
> No uses `sudo apt install npm` — los repositorios de Ubuntu instalan versiones obsoletas.

Para instalar pnpm una vez que tienes Node.js:

```bash
npm install -g pnpm
```

---

## Instalacion y Despliegue

### 1. Reconocimiento del entorno

Este repositorio es un monorepo que contiene el cliente y el servidor en carpetas separadas. Puedes clonar y ejecutar todo en la misma maquina, o acceder a la interfaz desde otro equipo en la misma red.

```
runawulf/
├── client/    — interfaz web (React)
└── server/    — backend (Node.js)
```

### 2. Clonar el repositorio

```bash
git clone git@github.com:yohanvillarp/runawulf.git
cd runawulf
```

### 3. Instalar dependencias

Desde la raiz del proyecto, pnpm instalara las dependencias del cliente y del servidor en un solo paso:

```bash
pnpm install
```

### 4. Ejecutar el cliente

```bash
cd client
pnpm dev
```

La interfaz deberia iniciar en `http://localhost:5173`:

![Inicio de Runawulf](./docs/images/interfaz_runawulf.png)

### 5. Configurar permisos del servidor

El servidor necesita permisos para ejecutar comandos del sistema. Desde la carpeta `server/`:

```bash
cd server
chmod +x setup.sh
./setup.sh
```

### 6. Ejecutar el servidor

```bash
pnpm dev
```

Deberias ver la confirmacion de ejecucion:

![Confirmacion del servidor](./docs/images/ejecucion_server_runawulf.png)

### 7. Conectar la interfaz al servidor

Para conectar el cliente con el servidor necesitas la direccion IP del servidor. Si estas en la misma maquina usa `127.0.0.1`. Si accedes desde otro equipo en la red, consulta tu IP con:

```bash
ip a
```

Ingresa esa IP en la pantalla de bienvenida:

![Conexion del servidor](./docs/images/primera_ejecucion.png)

### 8. Explorar los modulos

Una vez conectado, puedes acceder a los modulos disponibles desde el dashboard:

![Dashboard de Runawulf](./docs/images/Dashboard_runawulf.png)

> No todos los modulos estan terminados. Berkano (Copias de Seguridad) esta en desarrollo.

---

## Estructura del Proyecto

```
runawulf/
├── client/
│   └── src/
│       ├── app/          — providers y configuracion global
│       ├── pages/        — vistas enrutadas
│       ├── widgets/      — componentes de layout
│       ├── features/
│       │   ├── firewall/       — Algiz
│       │   ├── monitoring/     — Raido
│       │   └── intrusion/      — Eiwaz
│       └── shared/       — componentes, hooks y utilidades compartidas
├── server/
│   └── src/
│       ├── app.ts
│       ├── WebSocketServer.ts
│       └── WsMessageHandler.ts
└── docs/
    ├── OVERVIEW.md
    └── WORKFLOW.md
```

---

## Documentacion

- [Vision general del proyecto](./docs/OVERVIEW.md) — arquitectura, modulos y direccion del proyecto
- [Flujo de trabajo con Git](./docs/WORKFLOW.md) — convencion de ramas y commits

---

## Contribuir

Las contribuciones son bienvenidas. Si quieres reportar un error, proponer una mejora o trabajar en un modulo nuevo, abre un issue o un pull request desde la rama `develop`.

Antes de contribuir, revisa el [flujo de trabajo](./docs/WORKFLOW.md) del proyecto.

---

## Licencia

MIT — consulta el archivo [LICENSE](./LICENSE) para mas informacion.