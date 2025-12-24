from fastapi import FastAPI
from routers import solve_putt, courses

app = FastAPI(title="AIME Backend", version="0.1.0")

@app.get("/api/health")
def health():
    return {"status": "ok", "service": "aime-backend", "version": app.version}

app.include_router(solve_putt.router)
app.include_router(courses.router)
