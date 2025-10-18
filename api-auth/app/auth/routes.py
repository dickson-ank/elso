import requests
from app.core.config import settings
from fastapi import APIRouter, HTTPException, Depends
from datetime import timedelta
from app.utils.security import verify_access_token
from app.utils.security import get_current_user
from app.utils.security import get_current_user_from_cognito

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.get("/cognito/me")
def read_current_cognito_user(current_user: dict = Depends(get_current_user_from_cognito)):
    return {
        "message": "Cognito token verified successfully",
        "user": current_user
    }


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(username: str, password: str):
    # Send login request to Cognito
    url = f"https://{settings.cognito_domain}/oauth2/token"
    data = {
        "grant_type": "password",
        "client_id": settings.cognito_app_client_id,
        "username": username,
        "password": password,
    }
    headers = {"Content-Type": "application/x-www-form-urlencoded"}

    response = requests.post(url, data=data, headers=headers)

    if response.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid credentials or Cognito error")

    tokens = response.json()
    return {
        "access_token": tokens["access_token"],
        "id_token": tokens["id_token"],
        "refresh_token": tokens.get("refresh_token"),
        "token_type": tokens["token_type"],
    }


router = APIRouter(prefix="/auth", tags=["Auth"])

@router.get("/verify")
def verify_token(token: str):
    payload = verify_cognito_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"user": payload["username"], "status": "Token valid"}

@router.get("/me")
def read_current_user(current_user: dict = Depends(get_current_user)):
    return {"user": current_user["username"], "message": "You have access to this route"}