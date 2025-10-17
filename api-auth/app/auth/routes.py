from fastapi import APIRouter, HTTPException, Depends
from datetime import timedelta
from app.utils.security import create_access_token, verify_access_token
from app.utils.security import get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

# Dummy user for testing — later we’ll replace with Cognito or database users
FAKE_USER = {"username": "dickson", "password": "pass123"}

@router.post("/login")
def login(username: str, password: str):
    # Basic test authentication
    if username != FAKE_USER["username"] or password != FAKE_USER["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Create token valid for 60 minutes
    access_token = create_access_token(data={"sub": username}, expires_delta=timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/verify")
def verify_token(token: str):
    payload = verify_access_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return {"user": payload["sub"], "status": "Token valid"}

@router.get("/me")
def read_current_user(current_user: str = Depends(get_current_user)):
    return {"user": current_user, "message": "You have access to this route"}
