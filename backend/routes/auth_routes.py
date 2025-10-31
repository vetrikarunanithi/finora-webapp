from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
import json, os
from utils.auth_utils import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token,
)

router = APIRouter()
USERS_FILE = "data/users.json"

class SignupModel(BaseModel):
    name: str
    email: str
    mobile: str
    password: str

class LoginModel(BaseModel):
    mobile: str
    password: str

class RefreshModel(BaseModel):
    refresh_token: str

def read_users():
    if not os.path.exists(USERS_FILE):
        return []
    with open(USERS_FILE, "r") as f:
        return json.load(f)

def write_users(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

@router.post("/signup")
def signup(user: SignupModel):
    users = read_users()
    if any(u["mobile"] == user.mobile for u in users):
        raise HTTPException(status_code=400, detail="User already exists")

    hashed_pw = hash_password(user.password)
    new_user = {
        "name": user.name,
        "email": user.email,
        "mobile": user.mobile,
        "password": hashed_pw
    }
    users.append(new_user)
    write_users(users)
    return {"message": "Signup successful"}

@router.post("/login")
def login(credentials: LoginModel):
    users = read_users()
    user = next((u for u in users if u["mobile"] == credentials.mobile), None)
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token({"mobile": user["mobile"], "name": user["name"]})
    refresh_token = create_refresh_token({"mobile": user["mobile"], "name": user["name"]})

    return {
        "message": "Login successful",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"name": user["name"], "mobile": user["mobile"]}
    }

@router.post("/refresh")
def refresh_token(request: RefreshModel):
    payload = decode_token(request.refresh_token, expected_type="refresh")
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired refresh token")

    new_access = create_access_token({"mobile": payload["mobile"], "name": payload["name"]})
    return {"access_token": new_access, "message": "Access token refreshed successfully"}
