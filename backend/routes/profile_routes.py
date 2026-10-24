from flask import Blueprint, request, jsonify
from backend.models import User, Analysis
from backend.database import db_session
from backend.middleware.auth_middleware import token_required

profile_bp = Blueprint("profile", __name__, url_prefix="/api/profile")

@profile_bp.route("", methods=["GET"])
@token_required
def get_profile(current_user):
    user_analyses = db_session.query(Analysis).filter_by(user_id=current_user.id).all()
    high_risk_count = sum(1 for a in user_analyses if a.classification in ["High Risk", "Critical Risk"])
    
    return jsonify({
        "user": current_user.to_dict(),
        "stats": {
            "total_analyses": len(user_analyses),
            "high_risk_detections": high_risk_count,
            "member_since": current_user.created_at.strftime("%B %Y") if current_user.created_at else "Recently"
        }
    }), 200

@profile_bp.route("", methods=["PUT"])
@token_required
def update_profile(current_user):
    data = request.get_json() or {}
    name = data.get("name", "").strip()

    if not name:
        return jsonify({"error": "Name cannot be empty"}), 400

    if len(name) < 2 or len(name) > 100:
        return jsonify({"error": "Name must be between 2 and 100 characters"}), 400

    try:
        current_user.name = name
        db_session.commit()
        return jsonify({
            "message": "Profile updated successfully",
            "user": current_user.to_dict()
        }), 200
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": f"Failed to update profile: {str(e)}"}), 500

@profile_bp.route("/password", methods=["PUT"])
@token_required
def change_password(current_user):
    data = request.get_json() or {}
    current_password = data.get("current_password", "")
    new_password = data.get("new_password", "")
    confirm_new_password = data.get("confirm_new_password", "")

    if not current_password or not new_password:
        return jsonify({"error": "Current and new password are required"}), 400

    if not current_user.check_password(current_password):
        return jsonify({"error": "Current password is incorrect"}), 401

    if len(new_password) < 6:
        return jsonify({"error": "New password must be at least 6 characters long"}), 400

    if confirm_new_password and new_password != confirm_new_password:
        return jsonify({"error": "New passwords do not match"}), 400

    try:
        current_user.set_password(new_password)
        db_session.commit()
        return jsonify({"message": "Password changed successfully"}), 200
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": f"Failed to change password: {str(e)}"}), 500
