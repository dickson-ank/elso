from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Basic app info
    app_name: str = "API Authentication"
    environment: str = "development"

    # JWT config
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"

    # AWS Cognito config
    aws_region: str
    cognito_user_pool_id: str
    cognito_app_client_id: str
    class Config:
        env_file = ".env"  # load environment variables from this file


settings = Settings()
