import os
import logging
from pathlib import Path
import joblib
from backend.ml.preprocess import clean_text_for_nlp

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent

_model = None
_vectorizer = None

def load_ml_artifacts():
    """Load model and vectorizer with singleton caching."""
    global _model, _vectorizer
    if _model is not None and _vectorizer is not None:
        return _model, _vectorizer

    model_path = BASE_DIR / "model.pkl"
    vectorizer_path = BASE_DIR / "vectorizer.pkl"

    if model_path.exists() and vectorizer_path.exists():
        try:
            _model = joblib.load(model_path)
            _vectorizer = joblib.load(vectorizer_path)
            logger.info(f"[SocialGuard ML] Loaded model from {model_path}")
        except Exception as e:
            logger.error(f"[SocialGuard ML] Error loading model artifacts: {e}")
            _model = None
            _vectorizer = None
    else:
        logger.warning("[SocialGuard ML] Model artifacts not found. Heuristic analyzer will be used.")

    return _model, _vectorizer

def predict_ml(text: str) -> dict:
    """
    Run ML prediction on input text.
    Returns label, confidence, risk score contribution, and class probabilities.
    """
    model, vectorizer = load_ml_artifacts()
    cleaned = clean_text_for_nlp(text)

    if not model or not vectorizer or not cleaned:
        return {
            "ml_label": "Safe",
            "ml_confidence": 0.5,
            "ml_risk_score": 15,
            "probabilities": {"Safe": 0.7, "Suspicious": 0.2, "Social Engineering": 0.1},
            "is_fallback": True
        }

    try:
        vec = vectorizer.transform([cleaned])
        pred_label = model.predict(vec)[0]
        probs = model.predict_proba(vec)[0]
        classes = list(model.classes_)

        prob_dict = {classes[i]: float(probs[i]) for i in range(len(classes))}
        confidence = float(max(probs))

        p_safe = prob_dict.get("Safe", 0.0)
        p_susp = prob_dict.get("Suspicious", 0.0)
        p_soc = prob_dict.get("Social Engineering", 0.0)

        # Base calibrated risk score from ML distribution (0-100)
        # Suspicious weights 50%, Social Engineering weights 95%
        raw_score = int(round((p_susp * 55.0) + (p_soc * 95.0)))
        # Low risk bounds
        if p_safe > 0.75 and p_soc < 0.1:
            raw_score = min(raw_score, 25)

        raw_score = max(5, min(98, raw_score))

        return {
            "ml_label": pred_label,
            "ml_confidence": round(confidence, 3),
            "ml_risk_score": raw_score,
            "probabilities": {k: round(v, 4) for k, v in prob_dict.items()},
            "is_fallback": False
        }
    except Exception as e:
        logger.error(f"[SocialGuard ML] Prediction error: {e}")
        return {
            "ml_label": "Suspicious",
            "ml_confidence": 0.5,
            "ml_risk_score": 45,
            "probabilities": {"Safe": 0.33, "Suspicious": 0.34, "Social Engineering": 0.33},
            "is_fallback": True
        }
