from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.utils.cognito_auth import verify_cognito_token

# This defines how FastAPI expects tokens to be sent in requests
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user_from_cognito(token: str = Depends(oauth2_scheme)):
    """
    Verify AWS Cognito access token and return user claims.
    """
    try:
        payload = verify_cognito_token(token)
        return payload
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Cognito token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
