# Runawulf — Visión General

## Qué es Runawulf

Runawulf es una plataforma web para la administración y seguridad de servidores Ubuntu. Su propósito es exponer servicios críticos del sistema operativo a través de interfaces visuales dinámicas, sin depender de la terminal.

El nombre combina dos ideas: las runas nórdicas, como símbolos de conocimiento y poder sobre el entorno, y el lobo, que no reinventa el camino sino que domina el terreno que ya existe. Runawulf no reemplaza las herramientas de Linux las hace accesibles.

---

## El Problema que Resuelve

Las herramientas de administración de servidores Linux son poderosas, pero su curva de aprendizaje es alta y su interfaz es exclusivamente la terminal. Esto crea una barrera real para estudiantes, desarrolladores y equipos que no tienen experiencia profunda en administración de sistemas pero que necesitan gestionar servidores de forma segura y estratégica.

Runawulf elimina esa barrera sin sacrificar el control. El usuario ve lo que hace el sistema, entiende qué comando se ejecuta y por qué, y puede actuar sin memorizar sintaxis.

---

## La Idea Central: Come tu Propio Alimento

El principio que guía la arquitectura de Runawulf es simple: los módulos oficiales del sistema están construidos con el mismo motor que se le entrega al usuario para construir los suyos.

No hay dos sistemas separados. Hay un motor que conecta interfaces visuales con servicios de Linux, y sobre ese motor se construyen tanto los módulos robustos y mantenidos del proyecto como los módulos personalizados que cada usuario puede diseñar.

Esto tiene una consecuencia directa: si el motor es capaz de producir Algiz, Raido y Eiwaz, el usuario tiene evidencia concreta de lo que puede construir con él.

La referencia más cercana es el editor de niveles de Geometry Dash: el creador usa el mismo constructor para diseñar los niveles oficiales que el que le entrega a la comunidad. Los niveles oficiales no son una promesa, son una demostración.

---

## Arquitectura

Runawulf es un monorepo compuesto por dos proyectos independientes que se comunican en tiempo real.

### Cliente

Interfaz web construida en React con TypeScript. Sigue la metodología Feature-Sliced Design (FSD), que organiza el código por dominio funcional en lugar de por tipo de archivo. Esto permite que cada módulo —firewall, monitoreo, detección de intrusos— sea autónomo y extensible sin afectar al resto.

```
client/src/
├── app/          — providers globales, configuración de la aplicación
├── pages/        — vistas enrutadas
├── widgets/      — composiciones de layout reutilizables
├── features/     — módulos funcionales (firewall, monitoring, intrusion)
├── shared/       — componentes, hooks, utilidades y tipos compartidos
└── assets/       — recursos estáticos
```

### Servidor

Backend en Node.js con Express y TypeScript. Gestiona dos canales de comunicación:

- HTTP/HTTPS para operaciones puntuales y configuración inicial.
- WebSockets nativos (`ws`) para el flujo bidireccional de datos en tiempo real.

El servidor actúa como intermediario entre la interfaz web y el sistema operativo. Recibe mensajes del cliente, identifica la acción solicitada y ejecuta los comandos o scripts correspondientes con los permisos necesarios.

### Comunicación

| Componente | Responsabilidad |
| :--- | :--- |
| `app.ts` | Inicializa Express y habilita el servidor WebSocket |
| `WebSocketServer.ts` | Gestiona conexiones, envía actualizaciones periódicas al cliente |
| `WsMessageHandler.ts` | Interpreta mensajes entrantes y delega la ejecución |

---

## Los Módulos Actuales

Cada módulo representa un dominio de administración del servidor. En la nomenclatura interna del proyecto, cada uno lleva el nombre de una runa nórdica que refleja su función.

### Raido — Monitor de Sistema

Raido es la runa del viaje y el movimiento. Este módulo proporciona visibilidad continua sobre el estado interno del servidor: uso de CPU, memoria RAM, disco y tráfico de red. Incluye historial de métricas para identificar tendencias y anticipar problemas antes de que ocurran.

### Algiz — Control de Firewall

Algiz es la runa de la protección. Este módulo expone la gestión de reglas `iptables` a través de una interfaz guiada. Permite crear reglas definiendo acción, dirección e interfaz, y consultar todas las reglas activas con filtros. El objetivo es reducir los errores de configuración que en un entorno de terminal son silenciosos y potencialmente críticos.

### Eiwaz — Detección de Intrusos

Eiwaz es la runa del arco de tejo, símbolo de defensa a distancia. Este módulo integra Suricata, el sistema de detección y prevención de intrusos de código abierto, y presenta sus alertas en tiempo real. Rastrea IPs de origen, clasifica amenazas por protocolo y puerto, y procesa los logs del IDS para una respuesta inmediata.

---

## Integración entre Módulos

El siguiente paso natural en la evolución de Runawulf es que los módulos dejen de operar de forma aislada y comiencen a colaborar.

El caso más claro es la integración entre Eiwaz y Algiz: cuando el sistema de detección de intrusos identifica una IP con comportamiento malicioso, debería poder instruir al firewall para crear una regla de bloqueo temporal de forma automática. El rastreador y el guardián actuando como una unidad.

Esta integración entre módulos es también la base del constructor: un sistema que permite definir qué servicio consume un módulo, qué datos expone y cómo reacciona ante eventos de otros módulos.

---

## Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript |
| Comunicación | WebSockets nativos (`ws`) |
| Gestión de paquetes | pnpm (workspaces) |
| Sistema | Ubuntu 20.04 LTS o superior |
| Seguridad | Suricata IDS, iptables |
| Scripts | Bash, utilidades del kernel de Linux |

---

## Estado del Proyecto

Runawulf está en refactorización activa. La base funcional existe: los módulos de monitoreo, firewall y detección de intrusos operan y se comunican con el servidor en tiempo real. El trabajo actual se enfoca en estabilizar la arquitectura del cliente bajo FSD, mejorar la gestión del ciclo de vida de las conexiones WebSocket para reducir el consumo de recursos, y sentar las bases del sistema de construcción de módulos personalizados.

Este documento refleja el estado en la rama `develop`. La rama `main` contiene la última versión estable publicada.

---

## Para Desarrolladores y Estudiantes

Runawulf está pensado para quienes quieren entender cómo funciona un servidor Linux sin que la terminal sea el único punto de entrada. Si estás aprendiendo administración de sistemas, cada módulo es una ventana a una herramienta real: no simula iptables, lo ejecuta. No simula Suricata, lo lee.

El código está estructurado para ser legible y extensible. Las contribuciones, preguntas y propuestas de nuevos módulos son bienvenidas.

Repositorio: `https://github.com/yohanvillarp/runawulf`