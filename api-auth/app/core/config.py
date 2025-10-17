from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "API Authentication"
    environment: str = "development"
    jwt_secret_key: str = "supersecretkey"  # will move to .env later
    jwt_algorithm: str = "HS256"

    class Config:
        env_file = ".env"  # load environment variables from this file


settings = Settings()
