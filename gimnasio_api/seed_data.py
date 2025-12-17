import sys
import os
from datetime import datetime
from sqlalchemy import text

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlmodel import Session
from app.core.db import engine, create_db_and_tables
from app.models.rutina import Rutina, Ejercicio, DiaSemana

SAMPLE_RUTINAS = [
    {
        "nombre": "Full Body Principiante",
        "descripcion": "Enfoque en técnica básica.",
        "ejercicios": [
            {"nombre": "Sentadilla", "dia_semana": DiaSemana.LUNES, "series": 3, "repeticiones": 10, "peso": 20.0, "orden": 1},
            {"nombre": "Press Banca", "dia_semana": DiaSemana.LUNES, "series": 3, "repeticiones": 10, "peso": 20.0, "orden": 2}
        ]
    },
    {
        "nombre": "Empuje (Push) A",
        "descripcion": "Pecho, hombros y tríceps - Fuerza.",
        "ejercicios": [
            {"nombre": "Press Militar", "dia_semana": DiaSemana.LUNES, "series": 4, "repeticiones": 6, "peso": 30.0, "orden": 1},
            {"nombre": "Fondos", "dia_semana": DiaSemana.LUNES, "series": 3, "repeticiones": 12, "peso": None, "orden": 2}
        ]
    },
    {
        "nombre": "Tracción (Pull) A",
        "descripcion": "Espalda y bíceps - Hipertrofia.",
        "ejercicios": [
            {"nombre": "Remo con Barra", "dia_semana": DiaSemana.MARTES, "series": 4, "repeticiones": 8, "peso": 40.0, "orden": 1},
            {"nombre": "Dominadas", "dia_semana": DiaSemana.MARTES, "series": 3, "repeticiones": 8, "peso": None, "orden": 2}
        ]
    },
    {
        "nombre": "Pierna (Legs) A",
        "descripcion": "Cuádriceps y gemelos.",
        "ejercicios": [
            {"nombre": "Prensa", "dia_semana": DiaSemana.MIERCOLES, "series": 4, "repeticiones": 10, "peso": 100.0, "orden": 1},
            {"nombre": "Extensiones", "dia_semana": DiaSemana.MIERCOLES, "series": 3, "repeticiones": 15, "peso": 40.0, "orden": 2}
        ]
    },
    {
        "nombre": "Rutina de Calistenia",
        "descripcion": "Solo peso corporal.",
        "ejercicios": [
            {"nombre": "Flexiones de Brazos", "dia_semana": DiaSemana.JUEVES, "series": 4, "repeticiones": 20, "peso": None, "orden": 1},
            {"nombre": "Australian Pull ups", "dia_semana": DiaSemana.JUEVES, "series": 4, "repeticiones": 12, "peso": None, "orden": 2}
        ]
    },
    {
        "nombre": "Core y Abdominales",
        "descripcion": "Estabilidad central.",
        "ejercicios": [
            {"nombre": "Plancha Frontal", "dia_semana": DiaSemana.VIERNES, "series": 3, "repeticiones": 60, "peso": None, "orden": 1},
            {"nombre": "Rueda Abdominal", "dia_semana": DiaSemana.VIERNES, "series": 3, "repeticiones": 12, "peso": None, "orden": 2}
        ]
    },
    {
        "nombre": "Cardio HIIT",
        "descripcion": "Alta intensidad.",
        "ejercicios": [
            {"nombre": "Burpees", "dia_semana": DiaSemana.SABADO, "series": 5, "repeticiones": 20, "peso": None, "orden": 1},
            {"nombre": "Escaladores", "dia_semana": DiaSemana.SABADO, "series": 5, "repeticiones": 40, "peso": None, "orden": 2}
        ]
    },
    {
        "nombre": "Powerlifting Meet Prep",
        "descripcion": "Bajas repes, mucho peso.",
        "ejercicios": [
            {"nombre": "Peso Muerto Convencional", "dia_semana": DiaSemana.LUNES, "series": 5, "repeticiones": 3, "peso": 140.0, "orden": 1}
        ]
    },
    {
        "nombre": "Movilidad y Yoga",
        "descripcion": "Recuperación activa.",
        "ejercicios": [
            {"nombre": "Perro boca abajo", "dia_semana": DiaSemana.DOMINGO, "series": 1, "repeticiones": 10, "peso": None, "orden": 1}
        ]
    },
    {
        "nombre": "Brazos de Acero",
        "descripcion": "Enfoque en brazos.",
        "ejercicios": [
            {"nombre": "Curl de Bíceps", "dia_semana": DiaSemana.MIERCOLES, "series": 4, "repeticiones": 12, "peso": 12.5, "orden": 1},
            {"nombre": "Tríceps Polea", "dia_semana": DiaSemana.MIERCOLES, "series": 4, "repeticiones": 12, "peso": 20.0, "orden": 2}
        ]
    },
    {
        "nombre": "Hombros 3D",
        "descripcion": "Deltoides completo.",
        "ejercicios": [
            {"nombre": "Vuelos Laterales", "dia_semana": DiaSemana.JUEVES, "series": 4, "repeticiones": 15, "peso": 7.5, "orden": 1},
            {"nombre": "Facepulls", "dia_semana": DiaSemana.JUEVES, "series": 4, "repeticiones": 15, "peso": 15.0, "orden": 2}
        ]
    },
    {
        "nombre": "Espalda Amplitud",
        "descripcion": "Dorsales.",
        "ejercicios": [
            {"nombre": "Jalón al Pecho", "dia_semana": DiaSemana.MARTES, "series": 4, "repeticiones": 10, "peso": 50.0, "orden": 1}
        ]
    },
    {
        "nombre": "Glúteos y Femoral",
        "descripcion": "Cadena posterior.",
        "ejercicios": [
            {"nombre": "Hip Thrust", "dia_semana": DiaSemana.VIERNES, "series": 4, "repeticiones": 8, "peso": 60.0, "orden": 1},
            {"nombre": "Curl Femoral", "dia_semana": DiaSemana.VIERNES, "series": 3, "repeticiones": 12, "peso": 30.0, "orden": 2}
        ]
    },
    {
        "nombre": "Agilidad Deportiva",
        "descripcion": "Fútbol/Basket.",
        "ejercicios": [
            {"nombre": "Zancadas con Salto", "dia_semana": DiaSemana.SABADO, "series": 3, "repeticiones": 12, "peso": None, "orden": 1}
        ]
    },
    {
        "nombre": "Fuerza de Agarre",
        "descripcion": "Antebrazos.",
        "ejercicios": [
            {"nombre": "Paseo del Granjero", "dia_semana": DiaSemana.LUNES, "series": 3, "repeticiones": 30, "peso": 25.0, "orden": 3}
        ]
    }
]

def load_data():
    print("--- 🏋️ INICIANDO CARGA MASIVA DE 15 RUTINAS ---")
    create_db_and_tables() 
    with Session(engine) as session:
        print("Limpiando datos existentes...")
        session.exec(text("TRUNCATE TABLE ejercicio RESTART IDENTITY CASCADE;"))
        session.exec(text("TRUNCATE TABLE rutina RESTART IDENTITY CASCADE;"))
        session.commit()

        for data in SAMPLE_RUTINAS:
            ejercicios_data = data.pop("ejercicios", [])
            rutina = Rutina(**data, fecha_creacion=datetime.now())
            rutina.ejercicios = [Ejercicio(**ej) for ej in ejercicios_data]
            session.add(rutina)
        
        session.commit()
        print("--- 🟢 CARGA COMPLETADA EXITOSAMENTE ---")

if __name__ == "__main__":
    load_data()