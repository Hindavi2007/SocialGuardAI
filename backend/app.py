import os
import logging
from flask import Flask, jsonify
from flask_cors import CORS
from backend.config import Config
from backend.database import db_session, init_db
from backend.ml.predict import load_ml_artifacts
from backend.routes.auth_routes import auth_bp
from backend.routes.analyze_routes import analyze_bp
from backend.routes.history_routes import history_bp
from backend.routes.dashboard_routes import dashboard_bp
from backend.routes.profile_routes import profile_bp
from backend.routes.safety_routes import safety_bp

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SocialGuard")

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable robust CORS for all origins and headers
    CORS(
        app,
        resources={r"/api/*": {"origins": "*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # Initialize Database tables
    init_db()

    # Pre-warm ML model in memory at startup so request latency is <5ms
    try:
        load_ml_artifacts()
        logger.info("[SocialGuard ML] Model artifacts pre-warmed successfully.")
    except Exception as e:
        logger.warning(f"[SocialGuard ML] Failed to pre-warm model: {e}")

    # Register Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(analyze_bp)
    app.register_blueprint(history_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(safety_bp)

    # Teardown database session at end of each request
    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db_session.remove()

    # Health check endpoint
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "SocialGuard AI - Security Engine",
            "version": "1.0.0",
            "db_type": Config.DB_TYPE
        }), 200

    # Global Error Handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({"error": "Bad request"}), 400

    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({"error": "Internal server error"}), 500

    return app

app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"[SocialGuard] Starting server on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
