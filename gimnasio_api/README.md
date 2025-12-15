# ⚙️ Trabajo Práctico: Backend API - Rutinas de Gimnasio

## FastAPI + SQLModel + PostgreSQL

**Asignatura:** Programación 4

**Alumno:** Juan Manuel Gonzalez

---

## 📋 Descripción
Este es el componente backend del proyecto, construido con **FastAPI** y **SQLModel**. La API gestiona la persistencia de datos para las Rutinas y sus Ejercicios asociados, utilizando una base de datos **PostgreSQL**.

### Características Clave
* **Conexión DB:** PostgreSQL como base de datos principal.
* **ORM:** SQLModel para la definición de modelos y la interacción con la base de datos.
* **Relación 1:N:** Definición de una relación uno a muchos (`Rutina` tiene muchos `Ejercicio`).
* **Eliminación en Cascada:** Los ejercicios se eliminan automáticamente cuando se elimina su rutina padre.
* **Soporte CRUD:** Endpoints completos para la gestión de rutinas y ejercicios.

## ✨ Tecnologías Utilizadas
| Tecnología | Propósito |
|---|---|
| **FastAPI** | Framework principal para la construcción rápida de la API. |
| **SQLModel** | ORM basado en Pydantic y SQLAlchemy para la interacción segura con la DB. |
| **PostgreSQL** | Motor de base de datos relacional robusto. |
| **Uvicorn** | Servidor ASGI de alto rendimiento. |

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para instalar y ejecutar el Backend localmente.

### 1. Requisitos Previos
Debes tener instalado **Python 3.10+** y un servidor **PostgreSQL** corriendo.

### 2. Clonar y Configurar Entorno Virtual
```bash
# Clonar desde el repositorio remoto
git clone https://github.com/JuanM84/app-gimnasio.git

# Ingresar a la carpeta del Backend
cd app-gimnasio/gimnasio_api

# Crear y activar entorno virtual
python -m venv venv

# Activar el entorno virtual (Windows):
venv\Scripts\activate

# Linux/macOS:
source venv/bin/activate
```
### 3. Instalar Dependencias
``` bash
pip install -r requirements.txt
```
### 4. Configuración de la Base de Datos
Crea un archivo llamado `.env` en la carpeta raíz del backend (gimnasio_api) con la siguiente estructura:
``` bash
# .env
DATABASE_URL="postgresql://[usuario]:[password]@localhost:5432/gimnasio_db"
```
Asegúrate de que PostgreSQL esté corriendo y que la base de datos exista antes de continuar.
### 5. Ejecutar el Servidor
``` bash
uvicorn app.main:app --reload
```
La API estará disponible en: http://127.0.0.1:8000


## 🔗 Endpoints Principales
La documentación completa de la API se puede acceder en http://127.0.0.1:8000/docs.

| Recurso     | Método | Endpoint                               | Descripción                                                                 |
|------------|--------|----------------------------------------|------------------------------------------------------------------------------|
| Rutinas    | POST   | /api/rutinas                           | Crea una nueva rutina (aceptando ejercicios anidados para la creación inicial). |
| Rutinas    | GET    | /api/rutinas                           | Lista todas las rutinas.                                                     |
| Rutinas    | GET    | /api/rutinas/buscar?nombre=            | Realiza una búsqueda por nombre (parcial e insensible a mayúsculas).         |
| Rutinas    | GET    | /api/rutinas/{id}                      | Obtiene el detalle completo de una rutina por ID, incluyendo sus ejercicios. |
| Rutinas    | PUT    | /api/rutinas/{id}                      | Actualiza los campos de la rutina principal (nombre, descripcion).           |
| Rutinas    | DELETE | /api/rutinas/{id}                      | Elimina la rutina y todos sus ejercicios asociados (eliminación en cascada). |
| Ejercicios | POST   | /api/rutinas/{id}/ejercicios           | Agrega un nuevo ejercicio a una rutina existente.                            |
| Ejercicios | PUT    | /api/ejercicios/{id}                   | Actualiza un ejercicio específico. Se usa para la sincronización y el cambio de orden. |
| Ejercicios | DELETE | /api/ejercicios/{id}                   | Elimina un ejercicio específico de forma individual.                         |
