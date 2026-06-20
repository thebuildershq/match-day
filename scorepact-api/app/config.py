from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env")
    
    APP_NAME: str = "Scorepact API"
    ENV: str = "development"
    FRONTEND_URL: str = "http://localhost:5173"
    DATABASE_URL: str
    CLERK_SECRET_KEY: str


settings = Settings()
