# Informe de Desarrollo y Tutorial de Uso: Voidpet

## Introducción

Voidpet es una aplicación web interactiva inspirada en el concepto de Tamagotchi, donde el usuario puede cuidar de una mascota virtual. El diseño de la interfaz busca una estética retro-futurista, con reminiscencias de terminales de computadora clásicas, inspirada parcialmente por la serie "Severance". Este documento detalla el proceso de desarrollo de la aplicación y ofrece un breve tutorial sobre cómo interactuar con ella.

**Nota:** Esta versión del proyecto se entrega sin la integración del modelo 3D de la mascota y sin la completa adaptabilidad a dispositivos móviles, aspectos que se planean implementar para la demostración final en junio.

---

## 1. Proceso de Desarrollo

El desarrollo de Voidpet se llevó a cabo en varias fases, abarcando desde la conceptualización hasta el despliegue en la nube.

### 1.1. Conceptualización y Tecnologías

* **Idea Principal:** Crear una mascota virtual persistente con la que el usuario pueda interactuar para mantener sus estadísticas vitales.
* **Estética:** Interfaz de usuario que simula una pantalla de computadora antigua, con un diseño minimalista y funcional.
    * ![void-screen-desktop](https://github.com/user-attachments/assets/46188e6b-18bc-421f-ba47-bf12887f70eb)

* **Tecnologías Seleccionadas:**
    * **Frontend:** React con TypeScript, utilizando Vite como herramienta de compilación. Para el estilizado, se exploró inicialmente Tailwind CSS, pero se optó finalmente por CSS Modules personalizados para un mayor control sobre la estética deseada.
    * **Backend (API):** Azure Functions (Node.js con TypeScript) para gestionar la lógica de la mascota y la persistencia de datos.
    * **Almacenamiento de Datos:** Azure Blob Storage para guardar el estado de las mascotas en formato JSON.
    * **Despliegue:** Azure Static Web Apps para el frontend y un Azure Function App dedicado para el backend, con integración continua y despliegue continuo (CI/CD) mediante GitHub Actions.

### 1.2. Desarrollo del Backend (API en Azure Functions)

Se desarrolló una API RESTful para manejar las operaciones principales de la mascota:

* **Funciones Creadas:**
    * `CreatePet`: Permite crear una nueva mascota con un nombre proporcionado por el usuario. Genera un ID único y estadísticas iniciales.
    * `GetPet`: Recupera los datos de una mascota existente a partir de su ID.
    * `SavePet`: Guarda/actualiza el estado de una mascota (nombre, estadísticas, última interacción).
* **Lógica de Negocio:**
    * Se implementó un `StorageService` dentro del API para encapsular la lógica de interacción con Azure Blob Storage (guardar y recuperar archivos JSON que representan a las mascotas).
    * Las funciones manejan la validación de datos de entrada y la comunicación con el `StorageService`.
* **Persistencia:** Cada mascota se almacena como un blob JSON individual en un contenedor de Azure Blob Storage.

### 1.3. Desarrollo del Frontend (React)

El frontend se estructuró en componentes reutilizables para construir la interfaz de usuario:

* **Componentes Principales:**
    * `App.tsx`: Componente raíz que gestiona el estado global de la aplicación (mascota actual, estado de carga).
    * `ComputerShell.tsx`: Renderiza el marco visual de la "pantalla de computadora".
    * `LandingPage.tsx`: Vista inicial que contiene el formulario de creación de mascotas.
    * `PetNameForm.tsx`: Formulario para que el usuario ingrese el nombre de la mascota.
    * `PetView.tsx`: Vista principal que muestra la mascota, sus estadísticas y los controles una vez que la mascota existe.
    * `TopBar.tsx`: Barra superior de la pantalla con el nombre de la aplicación y la mascota.
    * `StatsDisplay.tsx`: Muestra las estadísticas vitales de la mascota (Hambre, Cansancio, Entretenimiento) con barras de progreso.
    * `Controls.tsx`: Panel con los botones de acción (Alimentar, Dormir, Jugar).
    * `PetDisplay.tsx`: Área designada para mostrar la mascota (actualmente un placeholder, futura integración de Three.js).
* **Servicios del Frontend:**
    * `api.service.ts`: Encargado de realizar las llamadas HTTP (fetch) al backend (Azure Functions).
    * `storage.service.ts`: Gestiona el almacenamiento del ID de la mascota actual en el `localStorage` del navegador para persistencia entre sesiones.
    * `pet.service.ts`: Orquesta la lógica del cliente, interactuando con los servicios de API y almacenamiento local. Incluye funciones como `getCurrentPet`, `createNewPet`, `updatePet`, y la lógica para actualizar estadísticas basada en el tiempo (`updateStatsBasedOnTime`).
* **Manejo de Estado:** Principalmente con `useState` y `useEffect` en los componentes funcionales de React.
* **Estilizado:** Se utilizaron CSS Modules para un estilizado encapsulado y específico por componente, permitiendo recrear la estética deseada con mayor precisión. Se definieron variables CSS globales para la paleta de colores y fuentes.

### 1.4. Integración y Pruebas Locales

* **API Local:** Las Azure Functions se probaron localmente usando `func start` y herramientas como VS Code REST Client.
* **Frontend Local:** La aplicación React se ejecutó con el servidor de desarrollo de Vite (`npm run dev`).
* **Almacenamiento Local:** Se utilizó Azurite (emulador de Azure Storage) para simular Azure Blob Storage durante el desarrollo local.
* **Pruebas End-to-End (Locales):** Se probó el flujo completo: creación de mascota, visualización, interacción (simulada inicialmente), recarga de la aplicación para verificar la persistencia del ID y la carga de la mascota existente, incluyendo la actualización de estadísticas por tiempo transcurrido.

### 1.5. Despliegue en Azure

* **Recursos Azure Creados:**
    * Azure Static Web App: Para alojar el frontend React.
    * Azure Function App: Un recurso dedicado para desplegar el backend API de Node.js/TypeScript.
    * Azure Storage Account: Para el almacenamiento de los datos de las mascotas (blobs JSON) y para el funcionamiento interno de Azure Functions.
* **Configuración:**
    * Se configuraron las variables de entorno (Application Settings) en el Azure Function App para las cadenas de conexión al Azure Storage (`STORAGE_CONNECTION_STRING`, `AzureWebJobsStorage`) y el nombre del contenedor (`STORAGE_CONTAINER_NAME`).
    * Se configuró CORS en el Azure Function App para permitir solicitudes desde el dominio de la Azure Static Web App.
    * El frontend (`api.service.ts`) se actualizó para apuntar a la URL del Azure Function App desplegado.
* **CI/CD con GitHub Actions:**
    * La Azure Static Web App se configuró para despliegue continuo desde un repositorio de GitHub. El flujo de trabajo de GitHub Actions compila el frontend y lo despliega.
    * El API del Azure Function App se desplegó manualmente desde VS Code utilizando la extensión de Azure Functions.

### 1.6. Desafíos y Soluciones

* **Configuración de Tailwind CSS:** Se encontraron dificultades iniciales con la configuración de Tailwind, lo que llevó a la decisión de usar CSS Modules para un control más directo y granular de los estilos.
* **Errores de CORS:** Se resolvieron configurando adecuadamente los orígenes permitidos en el recurso Azure Function App.
* **Despliegue de Azure Functions:** Inicialmente hubo problemas con la detección de las funciones por parte de Azure Static Web Apps (cuando se intentó usar la característica de API integrada) y luego con el despliegue al Function App separado. Estos se solucionaron ajustando la configuración del `package.json` del API (campo `main`), el archivo `.funcignore`, y asegurando que las variables de entorno en Azure fueran correctas, especialmente las cadenas de conexión al storage. La depuración se apoyó en la revisión de los logs de GitHub Actions y, cuando fue posible, en Application Insights.

---

## 2. Tutorial de Uso de Voidpet

Bienvenido a Voidpet. Aquí te explicamos cómo cuidar de tu nueva mascota virtual.

### 2.1. Creación de tu Mascota

1.  **Pantalla de Bienvenida:** Al abrir la aplicación por primera vez, verás una interfaz que simula una terminal de computadora. En el centro de la pantalla, se te pedirá que nombres a tu nueva mascota.
    * ![image](https://github.com/user-attachments/assets/d8bd9f36-0309-45ce-bc22-bf1c5937e9cb)

2.  **Ingresa un Nombre:** Escribe el nombre que desees para tu Voidpet en el campo de texto.
3.  **Crear Mascota:** Haz clic en el botón "Create Pet".

### 2.2. Conociendo a tu Voidpet

Una vez creada tu mascota, la pantalla cambiará para mostrar la vista principal.

* ![image](https://github.com/user-attachments/assets/ea4e58e2-046c-4923-b075-41643142201a)


**Elementos de la Interfaz:**

1.  **Barra Superior:** En la parte superior de la "pantalla", verás el título "Voidpet" seguido del nombre que le diste a tu mascota. También hay un pequeño indicador luminoso.
2.  **Área de la Mascota:** En el centro de la pantalla es donde aparecerá tu mascota. (Actualmente, se muestra un placeholder; en futuras versiones, aquí estará el modelo 3D).
3.  **Panel de Estadísticas (Inferior):** En la parte inferior, encontrarás tres indicadores principales para el bienestar de tu mascota:
    * **HUNGER (Hambre):** Indica cuán hambrienta está tu mascota. Un valor del 100% significa que está llena y satisfecha. Disminuye con el tiempo.
    * **TIREDNESS (Cansancio/Fatiga):** Indica cuán cansada está tu mascota. Un valor del 0% significa que está completamente descansada. Aumenta con la actividad (como jugar) y disminuye lentamente cuando está inactiva o al dormir.
    * **ENTERTAINMENT (Entretenimiento):** Indica cuán entretenida o feliz está tu mascota. Un valor del 100% es ideal. Disminuye con el tiempo si no interactúas con ella.
    * Debajo de cada etiqueta, verás el valor porcentual y una barra de progreso que representa visualmente el estado.

4.  **Panel de Controles (Lateral Derecho):** A la derecha de la pantalla, encontrarás tres botones para interactuar con tu mascota:
    * **Feed (Alimentar):** Dale de comer a tu Voidpet. Esto aumentará su estadística de Hambre (la hará menos hambrienta).
    * **Sleep (Dormir):** Pon a dormir a tu Voidpet. Esto reducirá significativamente su Cansancio.
    * **Play (Jugar):** Juega con tu Voidpet. Esto aumentará su Entretenimiento, pero también podría aumentar un poco su Cansancio y Hambre.

### 2.3. Cuidando de tu Mascota

* **Interacción:** Haz clic en los botones de acción para cuidar de tu mascota y mantener sus estadísticas en niveles saludables.
* **Paso del Tiempo:** Las estadísticas de tu mascota cambiarán con el tiempo, incluso si cierras la aplicación. Cuando vuelvas, sus necesidades se habrán actualizado según el tiempo transcurrido desde tu última interacción. ¡Asegúrate de visitarla regularmente!
* **Persistencia:** La aplicación recordará a tu mascota. Cuando vuelvas a abrir Voidpet en el mismo navegador, tu mascota existente se cargará automáticamente.

### 2.4. Objetivo

El objetivo es simple: ¡mantén a tu Voidpet feliz y saludable! Presta atención a sus estadísticas y utiliza las acciones para satisfacer sus necesidades.

---

Esperamos que este documento sea informativo. ¡Disfruta de tu Voidpet!
