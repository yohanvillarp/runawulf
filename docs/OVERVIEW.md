## 🐺 Runawulf: El Guardián Web para tu Servidor Ubuntu

Runawulf no es solo un conjunto de herramientas, es un **alfabeto rúnico en construcción** diseñado para la **gestión y seguridad de servidores Ubuntu** desde una interfaz web intuitiva.

Inspirado en el **lobo**, el viajero astuto que no reinventa el camino, sino que domina el terreno, este proyecto busca que **domines tus recursos**, aproveches su poder y protejas tu territorio digital, eliminando la dependencia de la línea de comandos.

---

### ¿Por Qué Runawulf?

Runawulf nació para **eliminar la complejidad** del software libre y de las potentes herramientas de servidor. Proporciona una **Interfaz de Usuario Gráfica (GUI)** amigable que adapta servicios críticos de Linux a un entorno **plug-and-play**, permitiendo que incluso usuarios no técnicos puedan gestionar sus servidores de manera estratégica.

---

### Arquitectura: Comunicación en Tiempo Real

Para lograr un **monitoreo en vivo** y una gestión instantánea, Runawulf utiliza un modelo de **conexión persistente y bidireccional** entre el cliente (el navegador) y el servidor.

| Componente | Función | Mecanismo |
| :--- | :--- | :--- |
| **Backend Core** | Inicia el servidor HTTP (Express) y habilita la comunicación en tiempo real. | `app.ts` |
| **Conexión** | Administra el canal persistente, acepta clientes y envía mensajes periódicos (ej. métricas del sistema). | **WebSocketServer.ts**  |
| **Procesamiento** | Interpreta los mensajes del cliente, identifica la acción (`type`) y delega la ejecución de comandos. | **WsMessageHandler.ts**  |

Este modelo WebSocket permite que el servidor envíe **actualizaciones automáticas de datos** (como métricas del sistema) sin que el cliente las solicite, asegurando una visión estratégica y en tiempo real.

---

### ᛋ Las Primeras Runas: Los Módulos Actuales

Cada módulo es una **runa**, un pilar fundamental en la estrategia de un verdadero lobo, listo para la caza.

#### **ᚱ Raido – Monitor de Sistema**

Raido es la **runa del viaje y el camino**, el rumbo que guía al caminante.
* **Función:** Proporciona la vigilancia continua del pulso interno del servidor.
* **Capacidades:** Visualización en tiempo real de **CPU, RAM, Disco** y **Tráfico de Red**. Muestra el estado del servidor (IP, Hostname, OS) y el historial de uso para anticipar desvíos.

#### **ᛉ Algiz – Control de Firewall**

Algiz es la **runa de la protección y la guardia**, la muralla defensiva de tu servidor.
* **Función:** Permite la gestión visual de las reglas de `iptables`.
* **Capacidades:** **Creación de reglas** guiada, definiendo acción (permitir/denegar), dirección (entrante/saliente) e interfaz para reducir errores. Ofrece una **consulta centralizada** de todas las reglas activas con filtros inteligentes.

#### **ᛇ Eiwaz – Detección de Intrusos**

Eiwaz es la **runa del arco de tejo**, un medio de protección.
* **Función:** Monitoreo activo de red, impulsado por **Suricata** (IDS/IPS de código abierto).
* **Capacidades:** Rastrea y **geolocaliza IPs de origen** de alertas, detecta amenazas por protocolo y puerto, y procesa *logs* en tiempo real para una respuesta inmediata.

#### **ᛒ Berkano – Copias de Seguridad (Próximamente)**

Berkano representa la **regeneración y el crecimiento**. Este módulo, aún en desarrollo, será el refugio al que siempre puedes volver para restaurar tus recursos.

---

### Integración y el Sentido de la Manada (Futuro)

El verdadero poder de Runawulf radica en la **colaboración entre runas**. Estamos trabajando para que estos módulos dejen de ser solo herramientas aisladas y comiencen a **aportar entre ellos**:

* **Algiz + Eiwaz:** Que el sistema de **Detección de Intrusos (Eiwaz)** pueda **alimentar automáticamente al Firewall (Algiz)**, creando reglas de bloqueo temporales contra IPs que muestren actividad maliciosa. El lobo guardián (Algiz) actuando por los ojos del rastreador (Eiwaz).

---

### ¡Únete a la Manada!

Runawulf no promete un destino final, sino un punto de partida para que domines el poder que has dejado pasar.

* **Repositorio del proyecto:** `https://github.com/yohanvillarp/runawulf`