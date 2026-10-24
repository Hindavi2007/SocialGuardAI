import pytest
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR.parent))

from backend.ml.preprocess import clean_text_for_nlp, extract_urls
from backend.ml.predict import predict_ml
from backend.services.url_analyzer import analyze_urls_safely

def test_preprocess_url_extraction():
    sample = "Click here: https://secure-bank.xyz/login and also http://192.168.1.1/test"
    urls = extract_urls(sample)
    assert len(urls) == 2
    assert "https://secure-bank.xyz/login" in urls

def test_preprocess_text_cleaning():
    sample = "URGENT! Send $5,000 to user@scam.com or call +1 800-555-0199 now!"
    cleaned = clean_text_for_nlp(sample)
    assert "token_money" in cleaned
    assert "token_email" in cleaned
    assert "token_phone" in cleaned
    assert "!" not in cleaned

def test_url_analyzer_flags_ip_and_suspicious_tld():
    sample = "Visit http://192.168.1.1/verify and http://paypal-alert.xyz/update"
    res = analyze_urls_safely(sample)
    assert res["has_urls"] is True
    assert len(res["suspicious_urls"]) >= 2
    assert any("IP address" in flag for flag in res["risk_flags"])
    assert any("high-risk TLD" in flag or "impersonation" in flag for flag in res["risk_flags"])

def test_predict_ml_returns_expected_structure():
    res = predict_ml("Your bank account will be blocked today! Send your OTP immediately.")
    assert "ml_label" in res
    assert "ml_confidence" in res
    assert "ml_risk_score" in res
    assert 0 <= res["ml_risk_score"] <= 100
