# Trabajo Final: Sistema de Gestión de Rutinas de Gimnasio - FRONTEND

## 1. Descripción del Proyecto

Interfaz de usuario desarrollada con React y Vite para interactuar con la API de gestión de rutinas, permitiendo operaciones CRUD completas y visualización organizada de los planes de entrenamiento.

## 2. Requisitos Previos

* Node.js (versión LTS recomendada)
* npm o yarn (npm es el utilizado en la documentación)

## 3. Instalación

1.  **Entrar al directorio `frontend`**
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

## 4. Configuración (URL del Backend)

El frontend requiere conocer la URL donde se ejecuta la API de FastAPI. Esta se configura mediante variables de entorno de Vite.

* **Crear archivo `.env.development`** en la raíz del directorio `frontend`.
* **Configuración de la URL de la API:**
    ```env
    VITE_API_BASE_URL=http://localhost:8000/api
    ```
    (Asegúrese de que esta URL coincida con el puerto donde corre el backend de FastAPI).

## 5. Ejecución

* **Comando para iniciar en modo desarrollo:**
    ```bash
    npm run dev
    ```
* **Puerto de la aplicación:** Por defecto, `http://localhost:5173`
* **Comando para compilar para producción:**
    ```bash
    npm run build
    ```

## 6. Tecnologías Utilizadas

* **React (con Vite):** Interfaz de usuario y *build tool*.
* **Axios:** Cliente HTTP para comunicación con el backend.
* **React Router DOM:** Manejo de la navegación y rutas en la SPA.
* **Material UI (MUI):** (Asumido) para componentes de diseño (o el conjunto que haya elegido).

## 7. Estructura del Proyecto

* `src/pages/`: Vistas principales (Listado, Detalle, Formulario).
* `src/components/`: Componentes reutilizables (Card, Formulario de Ejercicio, Barra de Búsqueda).
* `src/api/`: Módulo de comunicación centralizado (`api.js`) con las funciones de Axios.