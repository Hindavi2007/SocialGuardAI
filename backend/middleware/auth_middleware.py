from functools import wraps
from datetime import datetime, timedelta, timezone
import jwt
from flask import request, jsonify
from backend.config import Config
from backend.models import User
from backend.database import db_session

def generate_token(user: User) -> str:
    """Generate a JWT access token for a user."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "name": user.name,
        "exp": now + timedelta(hours=Config.JWT_ACCESS_TOKEN_EXPIRES_HOURS),
        "iat": now
    }
    return jwt.encode(payload, Config.JWT_SECRET_KEY, algorithm="HS256")

def decode_token(token: str) -> dict:
    """Decode and validate a JWT token."""
    try:
        return jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    """Decorator to require a valid JWT token."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization token is missing"}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid Authorization header format. Expected 'Bearer <token>'"}), 401

        token = parts[1]
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Token is invalid or has expired"}), 401

        user = db_session.query(User).filter_by(id=int(payload["sub"])).first()
        if not user:
            return jsonify({"error": "User account no longer exists"}), 401

        return f(current_user=user, *args, **kwargs)
    return decorated

def admin_required(f):
    """Decorator to require a valid token with admin privileges."""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Authorization token is missing"}), 401

        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid Authorization header format"}), 401

        token = parts[1]
        payload = decode_token(token)
        if not payload:
            return jsonify({"error": "Token is invalid or has expired"}), 401

        user = db_session.query(User).filter_by(id=int(payload["sub"])).first()
        if not user or user.role != "admin":
            return jsonify({"error": "Access denied: Admin privileges required"}), 403

        return f(current_user=user, *args, **kwargs)
    return decorated

def optional_token(f):
    """Decorator for routes that can function both anonymously or authenticated."""
    @wraps(f)
    def decorated(*args, **kwargs):
        current_user = None
        auth_header = request.headers.get("Authorization")
        if auth_header:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == "bearer":
                payload = decode_token(parts[1])
                if payload:
                    try:
                        current_user = db_session.query(User).filter_by(id=int(payload["sub"])).first()
                    except (ValueError, TypeError):
                        current_user = None
        return f(current_user=current_user, *args, **kwargs)
    return decorated
