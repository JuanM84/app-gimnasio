# Trabajo Final: Sistema de Gestión de Rutinas de Gimnasio - BACKEND

## 1. Descripción del Proyecto

API RESTful desarrollada con FastAPI y SQLModel para gestionar rutinas de entrenamiento, incluyendo la creación, modificación y eliminación de rutinas y sus ejercicios asociados, con persistencia en PostgreSQL.

## 2. Requisitos Previos

* Python 3.10+
* PostgreSQL (Servidor en ejecución y base de datos 'gimnasio_db' creada).

## 3. Instalación

1.  **Clonar el repositorio y entrar al directorio `gimnasio_api`**
2.  **Crear y activar el entorno virtual:**
    ```bash
    python -m venv venv
    source venv/bin/activate 
    ```
3.  **Instalar dependencias:**
    ```bash
    pip install -r requirements.txt
    ```
    (Asegúrese de que el archivo `requirements.txt` incluye: `fastapi`, `uvicorn`, `sqlmodel`, `psycopg2-binary`, `python-dotenv`, `pydantic-settings`).

## 4. Configuración de la Base de Datos

El backend utiliza la librería `python-dotenv` para cargar la URL de conexión desde un archivo `.env`.

* **Creación de `.env`:** Crear un archivo llamado `.env` en la raíz del directorio `gimnasio_api`.
* **String de Conexión:** El formato debe ser el siguiente, reemplazando con tus credenciales:
    ```
    DATABASE_URL="postgresql://[USUARIO]:[PASSWORD]@[HOST]:[PUERTO]/gimnasio_db"
    # Ejemplo: DATABASE_URL="postgresql://postgres:mysecretpassword@localhost:5432/gimnasio_db"
    ```
* **Creación de Tablas:** Las tablas se crean automáticamente al iniciar la aplicación (función `create_db_and_tables` en el evento `startup`).

## 5. Ejecución

* **Comando para iniciar el servidor:**
    ```bash
    uvicorn app.main:app --reload
    ```
* **Puerto de la aplicación:** Por defecto, `http://127.0.0.1:8000`
* **Documentación de FastAPI (Swagger UI):** Acceder a `http://127.0.0.1:8000/docs` para ver y probar los endpoints.

## 6. Endpoints Disponibles

| Recurso | Método | URL | Descripción |
| :--- | :--- | :--- | :--- |
| Rutinas | `GET` | `/api/rutinas` | Listar todas las rutinas. |
| Rutinas | `GET` | `/api/rutinas/{id}` | Obtener detalle. |
| Rutinas | `GET` | `/api/rutinas/buscar?nombre={texto}` | Buscar por nombre (parcial, *case-insensitive*). |
| Rutinas | `POST` | `/api/rutinas` | Crear nueva rutina (puede incluir ejercicios). |
| Rutinas | `PUT` | `/api/rutinas/{id}` | Actualizar nombre y descripción. |
| Rutinas | `DELETE` | `/api/rutinas/{id}` | Eliminar rutina (los ejercicios se eliminan en **cascada**). |
| Ejercicios | `POST` | `/api/ejercicios/rutinas/{id}/ejercicios` | Agregar un ejercicio a una rutina existente. |
| Ejercicios | `PUT` | `/api/ejercicios/{id}` | Modificar un ejercicio por su ID. |
| Ejercicios | `DELETE` | `/api/ejercicios/{id}` | Eliminar un ejercicio por su ID. |

## 7. Estructura del Proyecto

El código está organizado bajo el directorio `app/` siguiendo un patrón modular:
* `core/`: Configuración de la DB y variables de entorno.
* `models/`: Definiciones de las tablas Rutina y Ejercicio (SQLModel).
* `routers/`: Lógica de negocio y definición de endpoints (FastAPI routers).
* `main.py`: Punto de entrada que inicializa FastAPI y configura CORS.