import re
from flask import Blueprint, request, jsonify
from backend.models import User
from backend.database import db_session
from backend.middleware.auth_middleware import generate_token, token_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")
    confirm_password = data.get("confirm_password", "")

    # Validations
    if not name:
        return jsonify({"error": "Full name is required"}), 400
    if len(name) < 2 or len(name) > 100:
        return jsonify({"error": "Name must be between 2 and 100 characters"}), 400

    if not email or not EMAIL_REGEX.match(email):
        return jsonify({"error": "A valid email address is required"}), 400

    if not password:
        return jsonify({"error": "Password is required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters long"}), 400

    if confirm_password and password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    # Check if user exists
    existing_user = db_session.query(User).filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "An account with this email already exists"}), 409

    try:
        user = User(
            name=name,
            email=email,
            role="user"
        )
        user.set_password(password)
        db_session.add(user)
        db_session.commit()

        token = generate_token(user)
        return jsonify({
            "message": "Registration successful",
            "token": token,
            "user": user.to_dict()
        }), 201
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": f"Failed to register user: {str(e)}"}), 500

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = db_session.query(User).filter_by(email=email).first()
    if not user or not user.check_password(password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": user.to_dict()
    }), 200

@auth_bp.route("/me", methods=["GET"])
@token_required
def get_current_user(current_user):
    return jsonify({
        "user": current_user.to_dict()
    }), 200

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    # Secure response pattern: do not leak whether account exists
    return jsonify({
        "message": "If an account exists for this email, password reset instructions have been dispatched."
    }), 200
