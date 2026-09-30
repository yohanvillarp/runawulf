
---

## 🐺 La Senda Rúnica: El Camino Visual del Lobo

El verdadero poder de Runawulf no reside en lo oculto, sino en la capacidad de ver y entender el terreno. **La Senda Rúnica** es nuestra interfaz, la brújula que te guía a través de las capacidades de tus servidores. A través de este mapa visual, un lobo puede leer las huellas sin perderse en la penumbra del código.

### 📜 El Alfabeto Visual del Territorio (Estructura de Carpetas)

Nuestra Senda está organizada para reflejar el propósito de cada runa. En lugar de agrupar los archivos por su tipo, los hemos agrupado por su función. Cada módulo (o "runa") tiene su propio campamento, donde se encuentran todas las herramientas necesarias para la caza.

* **`modules/`**: El corazón del territorio. Aquí residen las carpetas de cada runa (módulo).
* **`shared/`**: El almacén común. Aquí guardamos las herramientas que se usan en más de una runa.
    * `components/`: Piezas de la interfaz que se usan en múltiples vistas, como un botón o una tarjeta de módulo. Son el **cuchillo y la cuerda del lobo**, herramientas básicas para la caza.
    * `hooks/`: Lógica reutilizable y abstracta. Es la **sabiduría colectiva de la manada**, atajos aprendidos que se aplican en diferentes situaciones.
* **`layouts/`**: Los mapas del viaje. Aquí se definen las plantillas visuales que enmarcan las diferentes vistas. Es **la ruta principal que unifica todos los senderos**.
* **`router/`**: La brújula interna. Define cómo navegas entre las diferentes runas de la Senda. Es la **guía que te lleva de un punto a otro en el territorio**.

Esta organización asegura que, a medida que el proyecto crezca y se agreguen más runas, el camino siga siendo claro y legible para toda la manada. Nos permite concentrarnos en una sola runa a la vez, garantizando que su desarrollo sea tan astuto como el de un lobo en su cacería.