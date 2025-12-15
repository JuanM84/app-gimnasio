
# Trabajo Final: Sistema de Gestión de Rutinas de Gimnasio 🏋️
## React + Material-UI + React Router DOM 

**Asignatura:** Programación 4

**Docente:** Facundo Fumaneri

**Alumno:** Juan Manuel Gonzalez

## 📋 Descripción
Este proyecto es el frontend de una aplicación web para la gestión de rutinas de entrenamiento, desarrollado como Trabajo Práctico. Permite a los usuarios listar, crear, editar y visualizar rutinas completas, incluyendo la gestión detallada de ejercicios anidados. La interfaz es moderna, intuitiva y completamente responsive, diseñada con Material-UI (MUI).
## ✨ Tecnologías Utilizadas
| Tecnología | Versión Requerida | Propósito |
|---|---|---|
| **React** | 19.1.1 | Librería principal para la interfaz de usuario. |
| **Material-UI (MUI)** | 7.x | Framework de componentes para diseño. |
| **React Router DOM** | 7.x | Manejo de rutas y navegación entre páginas. |
| **Vite** | Última | Herramienta de construcción rápida para el proyecto. |
| **@hello-pangea/dnd** | Última | Implementación de la funcionalidad Drag and Drop (DND) para reordenar elementos.|
| **lodash-es** | Última | Utilidad para implementar la función debounce en la búsqueda. |

## 🚀 Instalación y Ejecución

Sigue estos pasos para instalar y ejecutar el proyecto localmente.

### 1. Clonar el Repositorio
```bash
git clone https://github.com/JuanM84/app-gimnasio.git
cd app-gimnasio/gimnasio_front
```
### 2. Instalar las dependencias
```
npm install
```
### 3. Ejecutar el proyecto
```
npm run dev
```
### 4. Abrir en el Navegador
Abre la siguiente dirección en tu navegador: http://localhost:5173 (o el puerto que indique Vite)


## Estructura del Proyecto
```
src/
├── api/                       
│   └── api.js                          # Conexión con Endpoints de Backend
├── assets/                             # Imagenes a mostrar 
├── components/
│   ├── EjercicioForm.jsx               # Formulario individual de Ejercicio
│   ├── RutinaCard.jsx                  # Tarjeta de Rutina en Listado
│   └── shared/                         # Componentes compartidos
│       ├── Footer.jsx                  # Footer con Información de Contacto y Derechos
│       ├── Header.jsx                  # Header con Logo y Vinculos de Navegación
│       ├── Layout.jsx                  # Layout común para la App
│       └── SearchBar.jsx               # Barra de búsqueda.
├── hooks/                       
│   └── useDebounce.jsx                 # Hook Personalizado para busqueda de rutina
├── pages/                          
│   ├── Home.jsx                        # Página de Inicio
│   ├── RutinaForm.jsx                  # Formulario para la creación de Rutina
│   ├── RutinaList.jsx                  # Listado de las Rutinas Guardadas
│   └── RutinaDetail.jsx                # Página de detalle de Rutina
├── App.jsx                             # Configuración de rutas
└── main.jsx                            # Punto de entrada
```
## 🛠️ Requisitos Técnicos

### **Dependencias Requeridas**


```json
{
  "dependencies": {
    "@emotion/react": "^11.14.0",
    "@emotion/styled": "^11.14.1",
    "@hello-pangea/dnd": "^18.0.1",
    "@mui/icons-material": "^7.3.6",
    "@mui/material": "^7.3.6",
    "axios": "^1.13.2",
    "lodash-es": "^4.17.21",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.10.1"
  }
}
```

👤 Autor
Juan Manuel Gonzalez
Universidad Tecnológica Nacional - Facultad Regional Paraná
Año: 2025
Email: jmgonzalez.parana@gmail.com  