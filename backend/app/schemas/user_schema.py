from pydantic import BaseModel
from datetime import datetime


class UserBase(BaseModel):
    username: str

class UserLogin(UserBase):
    password: str


class UserCreate(UserBase):
    password: str
    is_superuser: bool


class UserOut(UserBase):
    id: int
