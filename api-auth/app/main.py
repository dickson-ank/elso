from fastapi import FastAPI
from app.auth.routes import router as auth_router
from app.core.config import settings

app = FastAPI(title=settings.app_name)

app.include_router(auth_router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the AWS Auth Lab API!",
        "environment": settings.environment
    }


