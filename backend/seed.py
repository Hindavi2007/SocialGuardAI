import sys
from datetime import datetime, timedelta
from pathlib import Path

# Ensure backend root is in sys.path
BASE_DIR = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE_DIR.parent))

from backend.database import db_session, init_db
from backend.models import User, Analysis, Indicator, Recommendation

def seed():
    print("[*] Initializing database schema...")
    init_db()

    # 1. Create Demo User
    user = db_session.query(User).filter_by(email="user@socialguard.ai").first()
    if not user:
        user = User(
            name="Alex Morgan",
            email="user@socialguard.ai",
            role="user",
            created_at=datetime.utcnow() - timedelta(days=30)
        )
        user.set_password("User@123")
        db_session.add(user)
        print("[+] Created standard user: user@socialguard.ai (Password: User@123)")
    else:
        print("[*] Standard user already exists.")

    # 2. Create Admin User
    admin = db_session.query(User).filter_by(email="admin@socialguard.ai").first()
    if not admin:
        admin = User(
            name="Security Admin",
            email="admin@socialguard.ai",
            role="admin",
            created_at=datetime.utcnow() - timedelta(days=60)
        )
        admin.set_password("Admin@123")
        db_session.add(admin)
        print("[+] Created admin user: admin@socialguard.ai (Password: Admin@123)")
    else:
        print("[*] Admin user already exists.")

    db_session.commit()

    # 3. Seed Realistic Historical Analyses for User
    existing_analyses = db_session.query(Analysis).filter_by(user_id=user.id).count()
    if existing_analyses == 0:
        print("[*] Seeding sample analyses for demo user...")

        samples = [
            {
                "content_type": "message",
                "content": "URGENT: Your State Bank account will be blocked today! Send your OTP immediately to verify your account.",
                "classification": "Critical Risk",
                "risk_score": 93,
                "confidence": 0.94,
                "explanation": "Creates intense artificial urgency, threatens bank account blocking, and explicitly solicits your One-Time Password (OTP).",
                "days_ago": 1,
                "indicators": [
                    ("Urgency", "high"),
                    ("Fear or Threats", "critical"),
                    ("Requests for OTP / Password / PIN", "critical"),
                    ("Authority / Impersonation", "high")
                ],
                "recommendations": [
                    "Never disclose passwords, OTPs, or verification codes to anyone.",
                    "Take a step back. Scammers create urgency to rush your critical thinking.",
                    "Hang up or disconnect. Contact official bank customer support directly."
                ]
            },
            {
                "content_type": "email",
                "sender": "security-update@paypal-verify-account.xyz",
                "subject": "Action Required: Suspicious Login Detected",
                "content": "Subject: Action Required: Suspicious Login Detected\nSender: security-update@paypal-verify-account.xyz\n\nDear Customer, We detected an unauthorized login to your PayPal account from Moscow. Click http://paypal-verify-account.xyz/login to secure your account within 24 hours.",
                "classification": "High Risk",
                "risk_score": 78,
                "confidence": 0.88,
                "explanation": "Deceptive sender domain mimicking PayPal, suspicious .xyz TLD, and urgent account verification prompting credentials.",
                "days_ago": 2,
                "indicators": [
                    ("Suspicious Links", "high"),
                    ("Account Verification Scam", "high"),
                    ("Authority / Impersonation", "high"),
                    ("Urgency", "high")
                ],
                "recommendations": [
                    "Do not click unknown links or shortened URLs.",
                    "Navigate to PayPal directly by typing paypal.com into your browser.",
                    "Report the phishing email to spoof@paypal.com."
                ]
            },
            {
                "content_type": "message",
                "content": "Congratulations! You have won ₹50,000 cash prize in our international festival lottery! Send bank details to claim your prize.",
                "classification": "High Risk",
                "risk_score": 75,
                "confidence": 0.85,
                "explanation": "Classic prize bait scam promising unverified lottery winnings while demanding bank details.",
                "days_ago": 4,
                "indicators": [
                    ("Fake Rewards / Prize Bait", "high"),
                    ("Requests for Financial Information", "critical")
                ],
                "recommendations": [
                    "Legitimate lotteries do not require banking details or advance fees.",
                    "Block the sender number immediately.",
                    "Do not provide bank account numbers or IFSC codes."
                ]
            },
            {
                "content_type": "message",
                "content": "Your cloud storage subscription will expire in 48 hours. Update your payment method to avoid file deletion.",
                "classification": "Suspicious",
                "risk_score": 48,
                "confidence": 0.72,
                "explanation": "Creates moderate urgency regarding subscription renewal and data loss.",
                "days_ago": 5,
                "indicators": [
                    ("Urgency", "high"),
                    ("Fear or Threats", "critical")
                ],
                "recommendations": [
                    "Check your account status directly in your official cloud provider app.",
                    "Verify past billing statements before updating payment details."
                ]
            },
            {
                "content_type": "message",
                "content": "Your college meeting is scheduled for tomorrow at 10 AM in the main auditorium. Please bring your student ID.",
                "classification": "Low Risk",
                "risk_score": 12,
                "confidence": 0.95,
                "explanation": "Standard educational announcement with normal operational tone. No threats, no links, and no credential requests.",
                "days_ago": 6,
                "indicators": [],
                "recommendations": [
                    "No immediate social engineering patterns detected.",
                    "Always remain mindful when sharing sensitive data."
                ]
            },
            {
                "content_type": "email",
                "sender": "newsletter@github.com",
                "subject": "GitHub Changelog: September 2026",
                "content": "Subject: GitHub Changelog: September 2026\nSender: newsletter@github.com\n\nHere are the top product updates and features released on GitHub this month.",
                "classification": "Low Risk",
                "risk_score": 10,
                "confidence": 0.96,
                "explanation": "Legitimate product newsletter without suspicious manipulation patterns or urgent credential harvesting.",
                "days_ago": 7,
                "indicators": [],
                "recommendations": [
                    "Standard informational newsletter."
                ]
            }
        ]

        for s in samples:
            analysis = Analysis(
                user_id=user.id,
                content_type=s["content_type"],
                sender=s.get("sender"),
                subject=s.get("subject"),
                content=s["content"],
                classification=s["classification"],
                risk_score=s["risk_score"],
                confidence=s["confidence"],
                explanation=s["explanation"],
                created_at=datetime.utcnow() - timedelta(days=s["days_ago"])
            )
            db_session.add(analysis)
            db_session.flush()

            for ind_name, severity in s["indicators"]:
                db_session.add(Indicator(
                    analysis_id=analysis.id,
                    indicator_name=ind_name,
                    severity=severity
                ))

            for rec_text in s["recommendations"]:
                db_session.add(Recommendation(
                    analysis_id=analysis.id,
                    recommendation_text=rec_text
                ))

        db_session.commit()
        print("[+] Seeded 6 realistic historical analyses.")
    else:
        print(f"[*] Found {existing_analyses} existing analyses. Skipping analysis seed.")

    print("[OK] Database seeding completed successfully!")

if __name__ == "__main__":
    seed()
