from sqlmodel import create_engine, Session, SQLModel
from app.core.config import settings

# Creamos el Engine SQLModel
engine = create_engine(
    settings.DATABASE_URL, 
    echo=True
)

def create_db_and_tables():
    """Crea las tablas de la DB si no existen."""
    from app.models.rutina import Rutina, Ejercicio 
    
    SQLModel.metadata.create_all(engine)

def get_session():
    """Sesión FastAPI para DB."""
    with Session(engine) as session:
        yield session