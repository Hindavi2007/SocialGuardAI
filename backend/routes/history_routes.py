from flask import Blueprint, request, jsonify
from backend.models import Analysis
from backend.database import db_session
from backend.middleware.auth_middleware import token_required

history_bp = Blueprint("history", __name__, url_prefix="/api/history")

@history_bp.route("", methods=["GET"])
@token_required
def get_history(current_user):
    # Query parameters
    classification_filter = request.args.get("classification", "").strip()
    content_type_filter = request.args.get("type", "").strip()
    search_query = request.args.get("search", "").strip()
    limit = min(int(request.args.get("limit", 100)), 200)
    offset = int(request.args.get("offset", 0))

    query = db_session.query(Analysis).filter(Analysis.user_id == current_user.id)

    # Classification filtering
    if classification_filter and classification_filter.lower() != "all":
        query = query.filter(Analysis.classification.ilike(f"%{classification_filter}%"))

    # Content type filtering (message / email)
    if content_type_filter and content_type_filter.lower() != "all":
        query = query.filter(Analysis.content_type == content_type_filter.lower())

    # Search filter
    if search_query:
        search_pattern = f"%{search_query}%"
        query = query.filter(
            (Analysis.content.ilike(search_pattern)) |
            (Analysis.subject.ilike(search_pattern)) |
            (Analysis.sender.ilike(search_pattern))
        )

    total_count = query.count()
    analyses = query.order_by(Analysis.created_at.desc()).offset(offset).limit(limit).all()

    return jsonify({
        "total": total_count,
        "offset": offset,
        "limit": limit,
        "items": [a.to_dict(include_full=False) for a in analyses]
    }), 200

@history_bp.route("/<int:analysis_id>", methods=["GET"])
@token_required
def get_analysis_detail(current_user, analysis_id):
    analysis = db_session.query(Analysis).filter_by(id=analysis_id, user_id=current_user.id).first()
    if not analysis:
        # Check if admin has access to view
        if current_user.role == "admin":
            analysis = db_session.query(Analysis).filter_by(id=analysis_id).first()
        
    if not analysis:
        return jsonify({"error": "Analysis record not found"}), 404

    return jsonify({"analysis": analysis.to_dict(include_full=True)}), 200

@history_bp.route("/<int:analysis_id>", methods=["DELETE"])
@token_required
def delete_analysis(current_user, analysis_id):
    analysis = db_session.query(Analysis).filter_by(id=analysis_id, user_id=current_user.id).first()
    if not analysis:
        if current_user.role == "admin":
            analysis = db_session.query(Analysis).filter_by(id=analysis_id).first()

    if not analysis:
        return jsonify({"error": "Analysis record not found"}), 404

    try:
        db_session.delete(analysis)
        db_session.commit()
        return jsonify({"message": "Analysis record deleted successfully", "id": analysis_id}), 200
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": f"Failed to delete record: {str(e)}"}), 500

@history_bp.route("", methods=["DELETE"])
@token_required
def clear_all_history(current_user):
    try:
        deleted_count = db_session.query(Analysis).filter_by(user_id=current_user.id).delete()
        db_session.commit()
        return jsonify({
            "message": f"Successfully deleted {deleted_count} analysis records",
            "deleted_count": deleted_count
        }), 200
    except Exception as e:
        db_session.rollback()
        return jsonify({"error": f"Failed to clear history: {str(e)}"}), 500
