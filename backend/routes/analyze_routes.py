from flask import Blueprint, request, jsonify
from backend.services.analysis_service import analyze_content
from backend.models import Analysis, Indicator, Recommendation
from backend.database import db_session
from backend.middleware.auth_middleware import optional_token, token_required

analyze_bp = Blueprint("analyze", __name__, url_prefix="/api")

@analyze_bp.route("/analyze", methods=["POST"])
@optional_token
def analyze_message(current_user):
    data = request.get_json() or {}
    text = data.get("text") or data.get("message") or data.get("content") or ""
    text = text.strip()

    if not text:
        return jsonify({"error": "Message content is required"}), 400

    if len(text) > 15000:
        return jsonify({"error": "Message exceeds maximum allowed length (15,000 characters)"}), 400

    result = analyze_content(content=text, content_type="message")

    # If user is authenticated, automatically persist analysis to their history
    saved_analysis_id = None
    if current_user:
        try:
            analysis = Analysis(
                user_id=current_user.id,
                content_type="message",
                content=text,
                classification=result["classification"],
                risk_score=result["risk_score"],
                confidence=result["confidence"],
                explanation=result["explanation"]
            )
            db_session.add(analysis)
            db_session.flush()

            # Save indicators
            for ind in result.get("indicator_details", []):
                indicator_record = Indicator(
                    analysis_id=analysis.id,
                    indicator_name=ind["indicator_name"],
                    severity=ind.get("severity", "medium")
                )
                db_session.add(indicator_record)

            # Save recommendations
            for rec_text in result.get("recommendations", []):
                rec_record = Recommendation(
                    analysis_id=analysis.id,
                    recommendation_text=rec_text
                )
                db_session.add(rec_record)

            db_session.commit()
            saved_analysis_id = analysis.id
        except Exception as e:
            db_session.rollback()
            # Do not block the user if persistence fails
            print(f"[SocialGuard Error] Failed to persist analysis: {e}")

    result["analysis_id"] = saved_analysis_id
    result["saved"] = saved_analysis_id is not None

    return jsonify(result), 200

@analyze_bp.route("/analyze/email", methods=["POST"])
@optional_token
def analyze_email(current_user):
    data = request.get_json() or {}
    sender = data.get("sender", "").strip()
    subject = data.get("subject", "").strip()
    body = data.get("body") or data.get("content") or ""
    body = body.strip()

    if not body and not subject:
        return jsonify({"error": "Email subject or body content is required"}), 400

    if len(body) > 25000:
        return jsonify({"error": "Email content exceeds maximum allowed length (25,000 characters)"}), 400

    result = analyze_content(
        content=body,
        content_type="email",
        sender=sender,
        subject=subject
    )

    saved_analysis_id = None
    if current_user:
        try:
            analysis = Analysis(
                user_id=current_user.id,
                content_type="email",
                sender=sender,
                subject=subject,
                content=f"Subject: {subject}\nSender: {sender}\n\n{body}",
                classification=result["classification"],
                risk_score=result["risk_score"],
                confidence=result["confidence"],
                explanation=result["explanation"]
            )
            db_session.add(analysis)
            db_session.flush()

            for ind in result.get("indicator_details", []):
                db_session.add(Indicator(
                    analysis_id=analysis.id,
                    indicator_name=ind["indicator_name"],
                    severity=ind.get("severity", "medium")
                ))

            for rec_text in result.get("recommendations", []):
                db_session.add(Recommendation(
                    analysis_id=analysis.id,
                    recommendation_text=rec_text
                ))

            db_session.commit()
            saved_analysis_id = analysis.id
        except Exception as e:
            db_session.rollback()
            print(f"[SocialGuard Error] Failed to persist email analysis: {e}")

    result["analysis_id"] = saved_analysis_id
    result["saved"] = saved_analysis_id is not None
    result["sender"] = sender
    result["subject"] = subject

    return jsonify(result), 200
