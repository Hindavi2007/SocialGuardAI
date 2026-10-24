import pytest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR.parent))

from backend.app import create_app
from backend.database import db_session, Base, engine
from backend.models import User

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "healthy"

def test_login_demo_user(client):
    res = client.post("/api/auth/login", json={
        "email": "user@socialguard.ai",
        "password": "User@123"
    })
    assert res.status_code == 200
    data = res.get_json()
    assert "token" in data
    assert data["user"]["email"] == "user@socialguard.ai"
    assert data["user"]["role"] == "user"

def test_login_invalid_password(client):
    res = client.post("/api/auth/login", json={
        "email": "user@socialguard.ai",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401
    assert "error" in res.get_json()

def test_register_validation_missing_fields(client):
    res = client.post("/api/auth/register", json={
        "name": "",
        "email": "bademail",
        "password": "123"
    })
    assert res.status_code == 400

def test_register_new_user_success(client):
    import time
    unique_email = f"test_{int(time.time())}@socialguard.ai"
    res = client.post("/api/auth/register", json={
        "name": "Jane Tester",
        "email": unique_email,
        "password": "SecretPassword123!",
        "confirm_password": "SecretPassword123!"
    })
    assert res.status_code == 201
    data = res.get_json()
    assert "token" in data
    assert data["user"]["email"] == unique_email
