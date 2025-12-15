# Trabajo Práctico: Sistema de Gestión de Rutinas de Gimnasio

Sistema de Gestión de Rutinas de Gimnasio (app-gimnasio), una aplicación web integral para crear, gestionar y organizar rutinas y ejercicios de entrenamiento. El sistema permite a los usuarios definir rutinas con ejercicios asociados, especificando detalles como series, repeticiones, peso, día de la semana y ordenación personalizada mediante la función de arrastrar y soltar.

## Arquitectura del sistema
La aplicación sigue una arquitectura de tres niveles : un frontend basado en React, un backend FastAPI y una base de datos PostgreSQL. El frontend se comunica con el backend mediante puntos finales HTTP RESTful, y este gestiona la persistencia de los datos mediante una capa ORM.

## Pila de tecnología
### Tecnologías Frontend

| Tecnología              | Versión           | Objetivo                                                                 |
|------------------------|-------------------|--------------------------------------------------------------------------|
| React                  | 19.2.0            | Marco de interfaz de usuario central con arquitectura basada en componentes |
| React Router DOM       | 7.10.1            | Enrutamiento y navegación del lado del cliente                            |
| Vite                   | 7.2.4             | Herramienta de compilación y servidor de desarrollo                       |
| Material-UI            | 7.3.6             | Biblioteca de componentes para un diseño de interfaz de usuario consistente |
| Emotion                | 11.14.0 / 11.14.1 | Solución de estilo CSS en JS                                              |
| Axios                  | 1.13.2            | Cliente HTTP para comunicación API                                       |
| @hello-pangea/dnd      | 18.0.1            | Funcionalidad de arrastrar y soltar para reordenar ejercicios             |
| lodash-es              | 4.17.21           | Funciones de utilidad                                                     |

### Tecnologías Backend

| Tecnología             | Objetivo                                                                 |
|------------------------|--------------------------------------------------------------------------|
| FastAPI                | Marco web asincrónico moderno con documentación de API automática         |
| SQLModel               | ORM que combina SQLAlchemy y Pydantic para operaciones de bases de datos con seguridad de tipos |
| PostgreSQL             | Base de datos relacional (versión 13+)                                    |
| Uvicorn                | Servidor ASGI para ejecutar aplicaciones FastAPI                          |
| Pydantic Settings      | Gestión de la configuración mediante variables de entorno                 |
| python-dotenv          | Cargar variables de entorno desde archivos `.env`                         |

## Descripción general del modelo de datos
El sistema gestiona dos entidades principales con una relación de uno a muchos:
### Rutina
La clase `Rutina` representa una rutina de ejercicios con:

- **nombre** : Nombre de la rutina (obligatorio)
- **descripcion** : Descripción opcional
- **fecha_creacion** : marca de tiempo generada automáticamente
- **ejercicios** : Relación con una lista de Ejercicioinstancias

### Ejercicio
La clase `Ejercicio` representa ejercicios individuales con:

- **nombre** : Nombre del ejercicio (obligatorio)
- **dia_semana** : Día de la semana ( DiaSemana `enum`: Lunes, Martes, Miércoles, Jueves, Viernes, Sábado, Domingo)
- **serie** : Número de conjuntos
- **repeticiones** : Número de repeticiones por serie.
- **peso** : Peso en kilogramos (opcional, puede ser `None` para ejercicios de peso corporal)
- **notas** : Notas opcionales
- **orden** : Entero para pedidos personalizados dentro de un día
- **rutina_id** : Clave externa a `Rutina`.
  
El modelo `Ejercicio` define una restricción de clave externa a nivel de base de datos, lo que garantiza la integridad referencial. La eliminación en cascada  de una `Rutina` elimina todos los `Ejercicio` registros asociados.

## Endpoints de `rutina` ( /api/rutinas)
| Método | Camino                                | Descripción                                                                 |
|--------|---------------------------------------|------------------------------------------------------------------------------|
| GET    | /api/rutinas                          | Enumera todas las rutinas con soporte de paginación                          |
| GET    | /api/rutinas/buscar?nombre={text}     | Rutinas de búsqueda por nombre (coincidencia parcial sin distinción entre mayúsculas y minúsculas) |
| GET    | /api/rutinas/{id}                     | Recupera una rutina única con todos los ejercicios                           |
| POST   | /api/rutinas                          | Crea una rutina (puede incluir una matriz de ejercicios anidados)            |
| PUT    | /api/rutinas/{id}                     | Actualiza los metadatos de la rutina (nombre, descripción)                   |
| DELETE | /api/rutinas/{id}                     | Elimina la rutina (elimina en cascada los ejercicios)                        |

## Endpoints de `ejercicio` ( /api/ejercicios)

| Método | Camino                                  | Descripción                              |
|--------|-----------------------------------------|------------------------------------------|
| POST   | /api/ejercicios/rutinas/{id}/ejercicios | Añade un ejercicio a una rutina existente |
| PUT    | /api/ejercicios/{id}                    | Actualiza los campos del ejercicio       |
| DELETE | /api/ejercicios/{id}                    | Elimina el ejercicio de la rutina        |

## Flujo de trabajo de desarrollo
El sistema utiliza servidores de desarrollo separados para el **frontend** y el **backend**:

Para ejecutar el `backend`:
``` bash 
uvicorn app.main:app --reload (puerto predeterminado 8000)
```
Para ejecutar el `frontend`
``` bash 
npm run dev(puerto predeterminado 5173)
```
La documentación automática de **FastAPI** está disponible en http://127.0.0.1:8000/docs (Swagger UI) y http://127.0.0.1:8000/redoc (ReDoc) .

La configuración de la conexión a la base de datos se carga desde un `.env` archivo que contiene la `DATABASE_URL` variable de entorno en formato de cadena de conexión PostgreSQL.

Para obtener instrucciones completas de configuración, consulte [README del backend](https://github.com/JuanM84/app-gimnasio/blob/main/gimnasio_api/README.md) y [README del frontend](https://github.com/JuanM84/app-gimnasio/blob/main/gimnasio_front/README.md)