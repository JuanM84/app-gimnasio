from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Carga de la URL de la Base de Datos
    DATABASE_URL: Optional[str] = None
    
    # Carga del archivo con las variables de entorno
    model_config = SettingsConfigDict(env_file='.env')

settings = Settings()