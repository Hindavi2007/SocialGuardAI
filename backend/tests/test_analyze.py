import pytest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR.parent))

from backend.app import create_app

@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_analyze_empty_message(client):
    res = client.post("/api/analyze", json={"text": ""})
    assert res.status_code == 400
    assert "error" in res.get_json()

def test_analyze_safe_message(client):
    res = client.post("/api/analyze", json={
        "text": "Your college meeting is scheduled for tomorrow at 10 AM in the main auditorium."
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["classification"] == "Low Risk"
    assert data["risk_score"] <= 30
    assert "recommendations" in data
    assert "explanation" in data

def test_analyze_high_risk_otp_message(client):
    res = client.post("/api/analyze", json={
        "text": "URGENT: Your bank account will be blocked today! Send your OTP immediately to verify your account."
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["classification"] in ["High Risk", "Critical Risk"]
    assert data["risk_score"] >= 61
    # Check that indicators are detected
    indicators = data["indicators"]
    assert any("Urgency" in ind for ind in indicators)
    assert any("OTP" in ind or "Threat" in ind for ind in indicators)

def test_analyze_email_with_suspicious_url(client):
    res = client.post("/api/analyze/email", json={
        "sender": "support@paypal-security-alert.xyz",
        "subject": "Account Frozen",
        "body": "Dear customer, your PayPal card has been suspended. Visit http://paypal-security-alert.xyz/restore to verify your PIN immediately."
    })
    assert res.status_code == 200
    data = res.get_json()
    assert data["classification"] in ["High Risk", "Critical Risk"]
    assert any("Suspicious Links" in ind for ind in data["indicators"])
