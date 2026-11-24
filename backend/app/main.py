
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

# API Routers
from app.auth.routes import router as auth_router
from app.items.routes import router as item_router
from app.found_items.routes import router as found_item_router

# Database Models
from app.models.user import User
from app.models.revoked_token import RevokedToken
from app.models.item import Item

from app.claims.routes import router as claim_router
from app.models.claim import Claim

app = FastAPI(
    title="Campus Lost and Found API",
    description="Backend API for the Campus Lost and Found Management System",
    version="1.0.0"
)


# Initialize database tables
Base.metadata.create_all(bind=engine)


# Register API routes
app.include_router(auth_router)
app.include_router(item_router)
app.include_router(found_item_router)
app.include_router(claim_router)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Campus Lost and Found API is running"
    }


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Campus Lost and Found Backend"
    }
