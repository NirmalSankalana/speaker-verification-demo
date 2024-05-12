from fastapi import APIRouter, Depends, status, HTTPException, responses
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy.orm import session

from .. import database, models, utils, oath2

from ..schemas import user_schema, util_schema

router = APIRouter(tags=['Authentication'])


@router.post('/login', response_model=util_schema.Token)
def login(user_credentials: OAuth2PasswordRequestForm = Depends(), db: session = Depends(database.get_db)):
    user = db.query(models.User).filter(
        models.User.usename == user_credentials.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")
    if not utils.verify(user_credentials.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail=f"Invalid Credentials")

    access_token = oath2.create_access_token(data={"user_id": user.id})

    return {"access_token": access_token, "token_type": "bearer"}
