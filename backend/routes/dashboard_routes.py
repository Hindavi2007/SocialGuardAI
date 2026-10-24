from collections import Counter
from datetime import datetime, timedelta
from flask import Blueprint, jsonify
from sqlalchemy import func
from backend.models import User, Analysis, Indicator
from backend.database import db_session
from backend.middleware.auth_middleware import token_required, admin_required

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/api")

@dashboard_bp.route("/dashboard/stats", methods=["GET"])
@token_required
def get_user_dashboard_stats(current_user):
    user_id = current_user.id

    # 1. Total and Risk Category Counts
    user_analyses = db_session.query(Analysis).filter_by(user_id=user_id).all()
    total_analyses = len(user_analyses)

    low_risk = sum(1 for a in user_analyses if a.classification == "Low Risk")
    suspicious = sum(1 for a in user_analyses if a.classification == "Suspicious")
    high_risk = sum(1 for a in user_analyses if a.classification in ["High Risk", "Critical Risk"])
    critical_risk = sum(1 for a in user_analyses if a.classification == "Critical Risk")

    # 2. Risk Distribution Chart Data
    distribution = [
        {"name": "Low Risk", "count": low_risk, "color": "#10B981"},
        {"name": "Suspicious", "count": suspicious, "color": "#F59E0B"},
        {"name": "High Risk", "count": high_risk - critical_risk, "color": "#F97316"},
        {"name": "Critical Risk", "count": critical_risk, "color": "#EF4444"}
    ]

    # 3. Risk Trend Over Time (Last 7 Days)
    today = datetime.utcnow().date()
    trend_data = []
    for i in range(6, -1, -1):
        target_day = today - timedelta(days=i)
        day_analyses = [a for a in user_analyses if a.created_at and a.created_at.date() == target_day]
        avg_score = round(sum(a.risk_score for a in day_analyses) / len(day_analyses)) if day_analyses else 0
        trend_data.append({
            "date": target_day.strftime("%b %d"),
            "analyses": len(day_analyses),
            "avg_risk": avg_score
        })

    # 4. Most Detected Social Engineering Indicators
    # Join with Indicator table for this user
    indicators_query = (
        db_session.query(Indicator.indicator_name, func.count(Indicator.id))
        .join(Analysis, Indicator.analysis_id == Analysis.id)
        .filter(Analysis.user_id == user_id)
        .group_by(Indicator.indicator_name)
        .order_by(func.count(Indicator.id).desc())
        .limit(6)
        .all()
    )
    top_indicators = [
        {"indicator": name, "count": count}
        for name, count in indicators_query
    ]

    # 5. Recent Analyses (up to 5 items)
    recent_analyses = (
        db_session.query(Analysis)
        .filter_by(user_id=user_id)
        .order_by(Analysis.created_at.desc())
        .limit(5)
        .all()
    )

    return jsonify({
        "cards": {
            "total": total_analyses,
            "low_risk": low_risk,
            "suspicious": suspicious,
            "high_risk": high_risk
        },
        "distribution": distribution,
        "trend": trend_data,
        "top_indicators": top_indicators,
        "recent_analyses": [a.to_dict(include_full=False) for a in recent_analyses]
    }), 200

@dashboard_bp.route("/admin/stats", methods=["GET"])
@admin_required
def get_admin_stats(current_user):
    total_users = db_session.query(User).count()
    total_analyses = db_session.query(Analysis).count()

    low_risk = db_session.query(Analysis).filter(Analysis.classification == "Low Risk").count()
    suspicious = db_session.query(Analysis).filter(Analysis.classification == "Suspicious").count()
    high_risk = db_session.query(Analysis).filter(Analysis.classification.in_(["High Risk", "Critical Risk"])).count()

    # Daily Volume (Last 7 Days)
    today = datetime.utcnow().date()
    daily_volume = []
    for i in range(6, -1, -1):
        target_day = today - timedelta(days=i)
        start = datetime.combine(target_day, datetime.min.time())
        end = datetime.combine(target_day, datetime.max.time())
        count = db_session.query(Analysis).filter(Analysis.created_at >= start, Analysis.created_at <= end).count()
        daily_volume.append({
            "date": target_day.strftime("%b %d"),
            "count": count
        })

    # Most Common Indicators across all users
    indicators_query = (
        db_session.query(Indicator.indicator_name, func.count(Indicator.id))
        .group_by(Indicator.indicator_name)
        .order_by(func.count(Indicator.id).desc())
        .limit(6)
        .all()
    )
    top_indicators = [
        {"indicator": name, "count": count}
        for name, count in indicators_query
    ]

    distribution = [
        {"name": "Low Risk", "count": low_risk, "color": "#10B981"},
        {"name": "Suspicious", "count": suspicious, "color": "#F59E0B"},
        {"name": "High Risk", "count": high_risk, "color": "#EF4444"}
    ]

    return jsonify({
        "cards": {
            "total_users": total_users,
            "total_analyses": total_analyses,
            "high_risk": high_risk,
            "suspicious": suspicious,
            "low_risk": low_risk
        },
        "distribution": distribution,
        "daily_volume": daily_volume,
        "top_indicators": top_indicators
    }), 200

@dashboard_bp.route("/admin/users", methods=["GET"])
@admin_required
def get_admin_users(current_user):
    users = db_session.query(User).order_by(User.created_at.desc()).all()
    result = []
    for u in users:
        analysis_count = db_session.query(Analysis).filter_by(user_id=u.id).count()
        last_analysis = (
            db_session.query(Analysis)
            .filter_by(user_id=u.id)
            .order_by(Analysis.created_at.desc())
            .first()
        )
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "total_analyses": analysis_count,
            "last_activity": last_analysis.created_at.isoformat() if last_analysis else "No activity yet",
            "status": "Active"
        })

    return jsonify({"users": result}), 200
