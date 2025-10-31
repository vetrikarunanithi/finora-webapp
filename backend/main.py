from fastapi import FastAPI
from routes.auth_routes import router as auth_router
from routes.finance_routes import router as finance_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routes
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(finance_router, prefix="/api/finance", tags=["Finance"])

@app.get("/")
def home():
    return {"message": "Welcome to Finora Backend API"}
