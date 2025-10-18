from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.utils.cognito_auth import verify_cognito_token
from datetime import datetime, timedelta
from jose import jwt, JWTError
from app.core.config import settings
import requests


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Fetch Cognito JSON Web Keys (JWKS) automatically
COGNITO_JWKS_URL = f"https://cognito-idp.{settings.aws_region}.amazonaws.com/{settings.cognito_user_pool_id}/.well-known/jwks.json"
jwks = requests.get(COGNITO_JWKS_URL).json()

def verify_access_token(token: str):
    try:
        # Decode header to get key id (kid)
        header = jwt.get_unverified_header(token)
        kid = header.get("kid")

        # Find the matching public key from Cognito’s JWKS
        key = next((k for k in jwks["keys"] if k["kid"] == kid), None)
        if not key:
            raise HTTPException(status_code=401, detail="Invalid token header")

        # Build public key
        public_key = jwt.construct_rsa_public_key(key)
        
        # Decode and verify token
        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=settings.cognito_app_client_id,
            issuer=f"https://cognito-idp.{settings.aws_region}.amazonaws.com/{settings.cognito_user_pool_id}"
        )
        return payload
    except JWTError as e:
        print("Token verification failed:", str(e))
        raise HTTPException(status_code=401, detail="Invalid or expired token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    payload = verify_access_token(token)
    return payload.get("username") or payload.get("sub")


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
