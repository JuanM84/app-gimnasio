from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.db import create_db_and_tables
from app.routers import rutina as rutina_router

# Inicialización de app
app = FastAPI(
    title="Sistema de Gestión de Rutinas de Gimnasio",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuración de CORS

origins = [
    "http://localhost:5173",  # Puerto por defecto de Vite/React
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(rutina_router.router, prefix="/api/rutinas", tags=["rutinas"])


@app.on_event("startup")
def on_startup():
    """Función que se ejecuta al iniciar el servidor."""
    print("Creando tablas de la base de datos...")
    create_db_and_tables()

@app.get("/")
def read_root():
    return {"message": "API de Gestión de Rutinas de Gimnasio funcionando. Ve a /docs para la documentación."}