from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List, Optional

from app.core.db import get_session
from app.models.rutina import Ejercicio, EjercicioBase, EjercicioRead, Rutina, DiaSemana

router = APIRouter()

# --- Modelos de Actualización de Ejercicio ---
class EjercicioUpdate(EjercicioBase):
    nombre: Optional[str] = None
    dia_semana: Optional[DiaSemana] = None
    series: Optional[int] = None
    repeticiones: Optional[int] = None
    peso: Optional[float] = None
    notas: Optional[str] = None
    orden: Optional[int] = None


# ----------------------------------------------------
# 1. POST /api/rutinas/{id}/ejercicios - AGREGAR EJERCICIO
# ----------------------------------------------------

@router.post("/rutinas/{rutina_id}/ejercicios", response_model=EjercicioRead, status_code=status.HTTP_201_CREATED)
def add_ejercicio_to_rutina(
    *, 
    session: Session = Depends(get_session), 
    rutina_id: int, 
    ejercicio: EjercicioBase
):
    rutina_db = session.get(Rutina, rutina_id)
    if not rutina_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rutina con ID {rutina_id} no encontrada."
        )

    ejercicio_db = Ejercicio.model_validate(ejercicio, update={"rutina_id": rutina_id})
    
    session.add(ejercicio_db)
    session.commit()
    session.refresh(ejercicio_db)
    
    return ejercicio_db

# ----------------------------------------------------
# 2. PUT /api/ejercicios/{id} - MODIFICAR EJERCICIO
# ----------------------------------------------------
@router.put("/{ejercicio_id}", response_model=EjercicioRead)
def update_ejercicio(
    *, 
    session: Session = Depends(get_session), 
    ejercicio_id: int, 
    ejercicio: EjercicioUpdate
):
    ejercicio_db = session.get(Ejercicio, ejercicio_id)

    if not ejercicio_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ejercicio con ID {ejercicio_id} no encontrado."
        )

    update_data = ejercicio.model_dump(exclude_unset=True) 
    
    for key, value in update_data.items():
        setattr(ejercicio_db, key, value)
    
    session.add(ejercicio_db)
    session.commit()
    session.refresh(ejercicio_db)
    
    return ejercicio_db

# ----------------------------------------------------
# 3. DELETE /api/ejercicios/{id} - ELIMINAR EJERCICIO
# ----------------------------------------------------
@router.delete("/{ejercicio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ejercicio(*, session: Session = Depends(get_session), ejercicio_id: int):

    ejercicio_db = session.get(Ejercicio, ejercicio_id)

    if not ejercicio_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Ejercicio con ID {ejercicio_id} no encontrado."
        )

    session.delete(ejercicio_db)
    session.commit()
    
    return {"ok": True}