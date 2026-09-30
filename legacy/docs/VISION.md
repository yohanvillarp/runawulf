# Runawulf — Visión

## El Problema con la Administración de Servidores

Las herramientas de Linux son poderosas, pero su uso requiere conocimiento profundo de comandos, sintaxis y comportamiento del sistema. Cada vez que un desarrollador o estudiante quiere monitorear un servicio, configurar el firewall o detectar intrusos, tiene que recordar comandos, escribir scripts, configurar procesos y construir desde cero la lógica que conecta todo.

Eso funciona. Pero no escala, no se comparte y no se reutiliza.

---

## La Idea

Runawulf v1 demostró que es posible exponer servicios críticos de Linux —firewall, monitoreo, detección de intrusos— a través de una interfaz web en tiempo real. Cada módulo fue construido a mano, con su propia lógica de comunicación, su propia interfaz y sus propios comandos.

La v2 parte de una pregunta distinta: ¿qué tienen en común todos esos módulos?

La respuesta es siempre la misma. Cualquier servicio de Linux que quieras administrar necesita responder tres preguntas:

- Como se lee su estado
- Como se le da una instrucción
- Cada cuanto cambia

Si esas tres preguntas tienen respuesta, el servicio puede existir en Runawulf. El motor de la v2 se construye sobre esa observación.

---

## El Motor

El motor es una abstracción que unifica la forma en que Runawulf se comunica con cualquier servicio del sistema operativo. Cualquier módulo —oficial o creado por el usuario— implementa la misma interfaz base:

```ts
abstract class LinuxService<TState, TAction> {
  abstract read(): Promise<TState>
  abstract execute(action: TAction): Promise<void>
  abstract stream(interval: number): AsyncGenerator<TState>
}
```

Los módulos oficiales de Runawulf —Algiz, Raido, Eiwaz— serán implementaciones de ese motor. No hay dos sistemas separados. El mismo motor que construye los módulos oficiales es el que se le entrega al usuario para construir los suyos.

Si los módulos oficiales funcionan, es evidencia concreta de lo que el motor puede producir.

---

## El Constructor

El constructor es la interfaz que permite al usuario definir un nuevo módulo sin escribir código. Para crear un módulo, el usuario responde tres preguntas desde la interfaz:

- Cual es el comando para leer el estado del servicio
- Cual es el comando para ejecutar una acción
- Cada cuanto quiere que se actualice

Con esa información, el motor genera una implementación en tiempo de ejecución. El usuario no configura WebSockets, no estructura un backend, no construye una interfaz desde cero. Runawulf lo hace por él.

Lo que el constructor no elimina es el conocimiento del servicio — el usuario necesita saber qué comando usar. Pero eso es conocimiento de Linux, que es público, documentado y es exactamente lo que un estudiante o desarrollador ya consulta. La barrera pasa de ser un problema de código a ser un problema de documentación.

---

## Escribe una vez, ejecuta en cualquier servidor Ubuntu

Un módulo definido en el constructor funciona en cualquier servidor donde corra Runawulf. No requiere reconfiguracion, no requiere reescribir scripts, no requiere volver a construir la interfaz.

Eso hace que los módulos sean portables y compartibles. Si alguien construye un módulo para monitorear nginx, puede exportarlo. Otra persona lo importa en su instancia de Runawulf y funciona. La comunidad construye, la comunidad comparte.

Es el mismo principio que hizo famoso a Java con "write once, run anywhere", aplicado a la administración de servidores Linux.

---

## Integración entre Módulos

Un comando ejecutado en la terminal es aislado. En Runawulf, los módulos pueden observarse y reaccionar entre sí.

El caso más claro es la integración entre Eiwaz y Algiz: cuando el sistema de detección de intrusos identifica una IP con comportamiento malicioso, puede instruir al firewall para crear una regla de bloqueo temporal de forma automática. Sin intervención manual, sin recordar comandos, sin abrir la terminal.

Esa capacidad de integración es lo que distingue a Runawulf de un ejecutor de comandos con interfaz gráfica. Los módulos no son herramientas aisladas — son piezas de un sistema que colabora.

---

## Lo que no es Runawulf

Runawulf no es un reemplazo de la terminal. Un administrador de sistemas experimentado siempre tendrá más control y flexibilidad operando directamente sobre el sistema.

Runawulf es para quien quiere entender y controlar su servidor sin que la terminal sea el único punto de entrada. Para el estudiante que está aprendiendo qué hace iptables. Para el desarrollador que monta un VPS y quiere que esté seguro sin estudiar la sintaxis de Suricata. Para quien quiere construir su propia interfaz sobre un servicio de Linux sin escribir un backend desde cero.

---

## Estado Actual

La v1.0.0 contiene los módulos base construidos de forma manual, sin el motor unificado. Esa versión existe, funciona y está documentada.

La v2 comienza con el diseño del motor. Los módulos oficiales serán reconstruidos sobre él, y el constructor será la siguiente capa. No es empezar de cero — es construir con la experiencia de haber hecho la v1.

Este documento refleja la dirección del proyecto. No todo lo que describe existe todavía.