from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
from typing import List, Optional
from app.core.db import get_session
from app.models.rutina import Rutina, RutinaCreate, RutinaRead, Ejercicio, RutinaUpdate


router = APIRouter()

# ----------------------------------------------------
# 1. POST /api/rutinas - CREAR RUTINA
# ----------------------------------------------------
@router.post("/", response_model=RutinaRead, status_code=status.HTTP_201_CREATED)
def create_rutina(*, session: Session = Depends(get_session), rutina: RutinaCreate):
    # Crea la Rutina sin los ejercicios
    rutina_db = Rutina.model_validate(rutina, update={"ejercicios": []}) 
    
    try:
        session.add(rutina_db)
        session.commit()
        session.refresh(rutina_db)

        # Si vienen ejercicios en el payload, los creamos y los asociamos
        if rutina.ejercicios:
            for ej in rutina.ejercicios:
                ejercicio_db = Ejercicio.model_validate(ej, update={"rutina_id": rutina_db.id})
                session.add(ejercicio_db)

            session.commit()
            session.refresh(rutina_db)
            
        return rutina_db

    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear la rutina. Asegúrate de que el nombre sea único y los datos válidos. Detalle: {e}"
        )


# ----------------------------------------------------
# 2. GET /api/rutinas - LISTAR TODAS LAS RUTINAS
# ----------------------------------------------------
@router.get("/", response_model=List[RutinaRead])
def read_rutinas(
    *, 
    session: Session = Depends(get_session), 
    offset: int = 0, 
    limit: int = Query(default=100, le=100)
):
    statement = select(Rutina).offset(offset).limit(limit)
    rutinas = session.exec(statement).all()
    
    return rutinas


# ----------------------------------------------------
# 3. GET /api/rutinas/{id} - OBTENER DETALLE
# ----------------------------------------------------
@router.get("/{rutina_id}", response_model=RutinaRead)
def read_rutina(*, session: Session = Depends(get_session), rutina_id: int):
    rutina = session.get(Rutina, rutina_id)
    
    if not rutina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rutina con ID {rutina_id} no encontrada."
        )
    return rutina


# ----------------------------------------------------
# 4. PUT /api/rutinas/{id} - ACTUALIZAR RUTINA
# ----------------------------------------------------
@router.put("/{rutina_id}", response_model=RutinaRead)
def update_rutina(*, session: Session = Depends(get_session), rutina_id: int, rutina: RutinaUpdate):
    
    rutina_db = session.get(Rutina, rutina_id)

    if not rutina_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rutina con ID {rutina_id} no encontrada."
        )

    # Convertir el modelo de actualización a un diccionario sin campos nulos
    update_data = rutina.model_dump(exclude_unset=True) 

    # Aplicar los cambios al objeto de la base de datos
    for key, value in update_data.items():
        setattr(rutina_db, key, value)
    
    # Guardar y refrescar
    try:
        session.add(rutina_db)
        session.commit()
        session.refresh(rutina_db)
        return rutina_db
    except Exception:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al actualizar. El nombre puede estar duplicado o los datos no son válidos."
        )
    
# ----------------------------------------------------
# 5. DELETE /api/rutinas/{id} - ELIMINAR RUTINA
# ----------------------------------------------------
@router.delete("/{rutina_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_rutina(*, session: Session = Depends(get_session), rutina_id: int):
    rutina = session.get(Rutina, rutina_id)

    if not rutina:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Rutina con ID {rutina_id} no encontrada."
        )

    session.delete(rutina)
    session.commit()
    
    return {"ok": True}

# ----------------------------------------------------
# 6. GET /api/rutinas/buscar?nombre={texto} - BÚSQUEDA
# ----------------------------------------------------
@router.get("/buscar", response_model=List[RutinaRead])
def search_rutinas(
    *, 
    session: Session = Depends(get_session), 
    nombre: str = Query(..., description="Texto para buscar rutinas por nombre (parcial e ignorando mayúsculas/minúsculas)")
):
    statement = select(Rutina).where(Rutina.nombre.ilike(f"%{nombre}%"))
    rutinas = session.exec(statement).all()

    if not rutinas:
        return []

    return rutinas