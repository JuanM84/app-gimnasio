# gimnasio_api/seed_data.py (CORREGIDO)

import sys
import os
from datetime import datetime
from sqlalchemy import text # Necesario para TRUNCATE

# Añadir la ruta del proyecto al path para las importaciones relativas
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session
from app.core.db import engine, create_db_and_tables
from app.models.rutina import Rutina, Ejercicio, DiaSemana

# =========================================================================
# 1. DATOS DE EJEMPLO CORREGIDOS (peso = None para Bodyweight)
# =========================================================================

SAMPLE_RUTINAS = [
    {
        "nombre": "Full Body para Principiantes",
        "descripcion": "Rutina de cuerpo completo enfocada en el desarrollo de fuerza y técnica básica. Ideal para las primeras 8 semanas de entrenamiento.",
        "ejercicios": [
            {
                "nombre": "Sentadilla con Barra",
                "dia_semana": DiaSemana.LUNES,
                "series": 3,
                "repeticiones": 10,
                "peso": 30.0,
                "notas": "Foco en la profundidad y mantener la espalda recta.",
                "orden": 1,
            },
            {
                "nombre": "Press de Banca",
                "dia_semana": DiaSemana.LUNES,
                "series": 3,
                "repeticiones": 8,
                "peso": 25.0,
                "notas": "Hacer pausa de 1 segundo en el pecho.",
                "orden": 2,
            },
            {
                "nombre": "Remo con Mancuerna",
                "dia_semana": DiaSemana.MIERCOLES,
                "series": 3,
                "repeticiones": 12,
                "peso": 10.0,
                "notas": "Controlar la fase excéntrica (bajada).",
                "orden": 1,
            },
            {
                "nombre": "Peso Muerto Rumano",
                "dia_semana": DiaSemana.VIERNES,
                "series": 3,
                "repeticiones": 10,
                "peso": 40.0,
                "notas": "Estirar bien los isquiotibiales, no bajar la cadera.",
                "orden": 1,
            },
        ],
    },
    {
        "nombre": "Rutina PPL Intermedio",
        "descripcion": "Push (Empuje), Pull (Tirón), Legs (Piernas). Un esquema de 6 días para crecimiento muscular.",
        "ejercicios": [
            {
                "nombre": "Press Militar (Hombros)",
                "dia_semana": DiaSemana.LUNES,
                "series": 4,
                "repeticiones": 6,
                "peso": 15.0,
                "notas": "Día de Empuje 1 (Pecho, Hombro, Tríceps).",
                "orden": 1,
            },
            {
                "nombre": "Dominadas",
                "dia_semana": DiaSemana.MARTES,
                "series": 4,
                "repeticiones": 8,
                "peso": None, # <--- CORRECCIÓN: Peso corporal es None
                "notas": "Al fallo. Agarre ancho.",
                "orden": 1,
            },
            {
                "nombre": "Sentadilla Frontal (Piernas)",
                "dia_semana": DiaSemana.MIERCOLES,
                "series": 3,
                "repeticiones": 10,
                "peso": 50.0,
                "notas": "Foco en cuádriceps.",
                "orden": 1,
            },
        ],
    },
    {
        "nombre": "Entrenamiento de Resistencia",
        "descripcion": "Circuito de ejercicios sin peso para mejorar la resistencia cardiovascular y muscular.",
        "ejercicios": [
            {
                "nombre": "Burpees",
                "dia_semana": DiaSemana.SABADO,
                "series": 5,
                "repeticiones": 15,
                "peso": None,
                "notas": "Máxima velocidad con buena forma.",
                "orden": 1,
            },
            {
                "nombre": "Plancha (Tiempo)",
                "dia_semana": DiaSemana.DOMINGO,
                "series": 3,
                "repeticiones": 60, 
                "peso": None,
                "notas": "Mantener el abdomen contraído.",
                "orden": 1,
            },
        ],
    },
    {
        "nombre": "Descanso Activo",
        "descripcion": "Rutina de yoga ligero y estiramiento. Sin ejercicios de fuerza.",
        "ejercicios": [
            {
                "nombre": "Saludo al Sol (Yoga)",
                "dia_semana": DiaSemana.JUEVES,
                "series": 1,
                "repeticiones": 15,
                "peso": None,
                "notas": "Flujo lento y consciente.",
                "orden": 1,
            },
        ],
    },
]

# =========================================================================
# 2. FUNCIÓN DE CARGA (Sin cambios, solo usa el import 'text' que ya hiciste)
# =========================================================================

def load_data():
    """
    Función principal para cargar las rutinas de ejemplo en la base de datos.
    """
    print("--- 🏋️ INICIANDO CARGA DE DATOS DE EJEMPLO ---")
    
    create_db_and_tables() 
    
    with Session(engine) as session:
        
        # Eliminar datos existentes
        print("Limpiando datos existentes...")
        session.exec(text("TRUNCATE TABLE ejercicio RESTART IDENTITY CASCADE;"))
        session.exec(text("TRUNCATE TABLE rutina RESTART IDENTITY CASCADE;"))
        session.commit()
        print("Tablas limpiadas.")

        rutinas_creadas = []
        
        for data in SAMPLE_RUTINAS:
            ejercicios_data = data.pop("ejercicios", [])
            
            rutina = Rutina(**data, fecha_creacion=datetime.now())
            
            rutina.ejercicios = [Ejercicio(**ej) for ej in ejercicios_data]
            
            session.add(rutina)
            rutinas_creadas.append(rutina)
        
        session.commit()
        
        for rutina in rutinas_creadas:
            session.refresh(rutina)
            print(f"✅ Rutina '{rutina.nombre}' ({len(rutina.ejercicios)} ejercicios) cargada con ID: {rutina.id}")

    print("--- 🟢 CARGA DE DATOS COMPLETADA EXITOSAMENTE ---")

if __name__ == "__main__":
    load_data()