from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from typing import Dict, Any
from datetime import datetime

# Load environment variables
load_dotenv()

# Configuration from environment variables
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
DEBUG = os.getenv("DEBUG", "True").lower() in ("true", "1", "t")

app = FastAPI(
    title="AIME Golf AI API",
    description="Backend API for AIME Golf Assistant - FastAPI service for golf AI features",
    version="0.2.0",
    debug=DEBUG
)

# Configure CORS to allow requests from the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3001"],  # Allow both frontend ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root() -> Dict[str, Any]:
    """Root endpoint that confirms the API is running."""
    return {
        "status": "ok",
        "message": "AIME Golf AI Backend API is running",
        "version": "0.2.0",
        "environment": "development" if DEBUG else "production"
    }

@app.get("/api/hello")
def hello_world() -> Dict[str, str]:
    """Simple hello world endpoint for testing."""
    return {"message": "Hello from the AIME Golf AI backend!"}

@app.get("/api/config")
def get_config() -> Dict[str, Any]:
    """Return configuration information for the client."""
    return {
        "apiVersion": "0.2.0",
        "environment": "development" if DEBUG else "production",
        "features": {
            "logging": True,
            "authentication": True,
            "golf_ai": True,
            "putt_solver": True
        }
    }

@app.get("/api/status")
def get_status() -> Dict[str, Any]:
    """Return authentication status for the client."""
    return {
        "authenticated": True,  # For demo, we'll always return true
        "serverTime": datetime.now().isoformat(),
        "serverStatus": "operational"
    }

# Import routers
from routers import solve_putt
app.include_router(solve_putt.router)

# Only run the server directly when this file is executed as a script
if __name__ == "__main__":
    import uvicorn
    
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    
    uvicorn.run(
        "main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info" if DEBUG else "error"
    )

