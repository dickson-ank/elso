import requests
from jose import jwk, jwt
from jose.utils import base64url_decode
from app.core.config import settings

COGNITO_KEYS_URL = f"https://cognito-idp.{settings.aws_region}.amazonaws.com/{settings.cognito_user_pool_id}/.well-known/jwks.json"

def get_cognito_public_keys():
    response = requests.get(COGNITO_KEYS_URL)
    response.raise_for_status()
    return response.json()["keys"]

def verify_cognito_token(token: str):
    headers = jwt.get_unverified_headers(token)
    kid = headers["kid"]
    keys = get_cognito_public_keys()

    # Find the matching key
    key_index = next((i for i, k in enumerate(keys) if k["kid"] == kid), None)
    if key_index is None:
        raise Exception("Public key not found in JWKS")

    public_key = jwk.construct(keys[key_index])
    payload = jwt.get_unverified_claims(token)

    # Verify expiration
    if payload.get("exp") < jwt.datetime_to_timestamp(jwt.datetime_now()):
        raise Exception("Token is expired")

    # Verify signature
    message, encoded_signature = str(token).rsplit(".", 1)
    decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

    if not public_key.verify(message.encode("utf-8"), decoded_signature):
        raise Exception("Signature verification failed")

    # Verify audience (app client ID)
    if payload.get("aud") != settings.cognito_app_client_id:
        raise Exception("Token was not issued for this audience")

    return payload

