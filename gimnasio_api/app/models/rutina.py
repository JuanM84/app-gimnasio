from sqlmodel import Field, SQLModel, Relationship, Enum
from typing import Optional, List
from datetime import datetime
from enum import Enum as PyEnum

# Días de la semana
class DiaSemana(str, PyEnum):
    """Enumeración de los días de la semana."""
    LUNES = "Lunes"
    MARTES = "Martes"
    MIERCOLES = "Miércoles"
    JUEVES = "Jueves"
    VIERNES = "Viernes"
    SABADO = "Sábado"
    DOMINGO = "Domingo"


# --- EJERCICIO ---
class EjercicioBase(SQLModel):
    nombre: str = Field(index=True)
    dia_semana: DiaSemana
    series: int = Field(gt=0)
    repeticiones: int = Field(gt=0)
    peso: Optional[float] = Field(default=None, gt=0)
    notas: Optional[str] = None
    orden: int = Field(default=0)
    
class Ejercicio(EjercicioBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rutina_id: int = Field(foreign_key="rutina.id") # Clave Foránea

    # Relación con Rutina
    rutina: "Rutina" = Relationship(back_populates="ejercicios")

# --- RUTINA ---
class RutinaBase(SQLModel):
    nombre: str = Field(index=True, unique=True)
    descripcion: Optional[str] = None

class Rutina(RutinaBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    fecha_creacion: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relación One-to-Many con Ejercicio
    ejercicios: List["Ejercicio"] = Relationship(
        back_populates="rutina",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"} 
    )

# --- Esquemas para la API ---
# Usados para la creación y actualización de datos
class RutinaCreate(RutinaBase):
    ejercicios: Optional[List[EjercicioBase]] = None

class RutinaUpdate(RutinaBase):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    # No manejamos ejercicios en la actualización de la Rutina principal, 
    # ya que los ejercicios deberían tener sus propios endpoints CRUD para ser modificados.

# Usados para la lectura y retorno de datos
class EjercicioRead(EjercicioBase):
    id: int
    rutina_id: int

class RutinaRead(RutinaBase):
    id: int
    fecha_creacion: datetime
    ejercicios: List[EjercicioRead] = []