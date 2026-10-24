from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from werkzeug.security import generate_password_hash, check_password_hash
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="user")  # 'user' or 'admin'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    analyses = relationship("Analysis", back_populates="user", cascade="all, delete-orphan", order_by="desc(Analysis.created_at)")

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }

class Analysis(Base):
    __tablename__ = "analyses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True, index=True)
    content_type = Column(String(20), nullable=False, default="message")  # 'message' or 'email'
    sender = Column(String(255), nullable=True)
    subject = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    classification = Column(String(50), nullable=False, index=True)  # 'Low Risk', 'Suspicious', 'High Risk', 'Critical Risk'
    risk_score = Column(Integer, nullable=False)  # 0 to 100
    confidence = Column(Float, nullable=False, default=0.0)
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    user = relationship("User", back_populates="analyses")
    indicators = relationship("Indicator", back_populates="analysis", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="analysis", cascade="all, delete-orphan")

    def to_dict(self, include_full=True):
        data = {
            "id": self.id,
            "user_id": self.user_id,
            "content_type": self.content_type,
            "sender": self.sender,
            "subject": self.subject,
            "classification": self.classification,
            "risk_score": self.risk_score,
            "confidence": round(self.confidence, 2),
            "explanation": self.explanation,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "indicators": [ind.to_dict() for ind in self.indicators],
            "indicator_names": [ind.indicator_name for ind in self.indicators],
            "recommendations": [rec.recommendation_text for rec in self.recommendations]
        }
        if include_full:
            data["content"] = self.content
        else:
            # Preview for list views
            data["content_preview"] = (self.content[:120] + "...") if len(self.content) > 120 else self.content
        return data

class Indicator(Base):
    __tablename__ = "indicators"

    id = Column(Integer, primary_key=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    indicator_name = Column(String(100), nullable=False, index=True)
    severity = Column(String(20), nullable=False, default="medium")  # 'low', 'medium', 'high', 'critical'

    analysis = relationship("Analysis", back_populates="indicators")

    def to_dict(self):
        return {
            "id": self.id,
            "indicator_name": self.indicator_name,
            "severity": self.severity
        }

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, autoincrement=True)
    analysis_id = Column(Integer, ForeignKey("analyses.id", ondelete="CASCADE"), nullable=False, index=True)
    recommendation_text = Column(Text, nullable=False)

    analysis = relationship("Analysis", back_populates="recommendations")

    def to_dict(self):
        return {
            "id": self.id,
            "recommendation_text": self.recommendation_text
        }
