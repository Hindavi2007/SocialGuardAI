import re
from typing import Dict, List, Any
from backend.ml.predict import predict_ml
from backend.services.url_analyzer import analyze_urls_safely

# Comprehensive heuristic patterns for Social Engineering Indicators
INDICATOR_DEFINITIONS = {
    "Urgency": {
        "severity": "high",
        "weight": 22,
        "raw_patterns": [
            r"\b(?:act|respond|update|verify|call|pay)\s+(?:immediately|now|urgently|today|within\s+\d+\s*(?:hours|mins|minutes|days))\b",
            r"\b(?:last|final)\s+(?:chance|notice|warning)\b",
            r"\b(?:urgent|immediate)\s+(?:action|notice|request|alert|attention)\b",
            r"\b(?:expires?|deactivat(?:ed|ing)|terminat(?:ed|ing))\s+(?:today|soon|in\s+\d+\s*(?:hours|hrs|days)|at\s+midnight)\b",
            r"\b(?:account|service|subscription|membership)\s+(?:will\s+be|has\s+been)\s+(?:blocked|suspended|closed|terminated|frozen|expired)\b",
            r"\b(?:immediately|urgently|right\s+now|without\s+delay|at\s+once)\b",
            r"\btime\s+is\s+running\s+out\b"
        ],
        "explanation": "Creates intense artificial urgency to pressure you into acting before you can verify the claim."
    },
    "Fear or Threats": {
        "severity": "critical",
        "weight": 28,
        "raw_patterns": [
            r"\b(?:legal\s+action|lawsuit|police|arrest|court\s+summons|warrant|imprisonment|fine|penalty)\b",
            r"\b(?:account|card|access|subscription|membership)\s+(?:will\s+be|has\s+been|is)\s+(?:blocked|suspended|frozen|restricted|terminated|cancelled|deactivated|on\s+hold|closed)\b",
            r"\b(?:prosecution|arrested|evasion|investigation\s+initiated)\b",
            r"\b(?:power\s+supply|electricity)\s+will\s+be\s+(?:disconnected|cut\s+off)\b",
            r"\b(?:infected\s+with\s+\d+\s+viruses|compromised|hacked|breached)\b",
            r"\b(?:avoid\s+(?:suspension|cancellation|termination|interruption|deactivation)|prevent\s+(?:closure|blocking))\b"
        ],
        "explanation": "Uses intimidating or threatening statements (legal action, service termination, arrest) to induce panic."
    },
    "Requests for OTP / Password / PIN": {
        "severity": "critical",
        "weight": 35,
        "raw_patterns": [
            r"\b(?:one[\s-]time\s+password|otp|pin|cvv|cvc|password|passcode|security\s+code|secret\s+key|seed\s+phrase)\b",
            r"\b(?:share|send|enter|reply\s+with|provide)\s+(?:your\s+)?(?:otp|pin|password|verification\s+code|code\s+received)\b",
            r"\b(?:6|4)[\s-]digit\s+(?:code|otp|sms\s+code)\b"
        ],
        "explanation": "Explicitly requests credentials, OTPs, or passwords that legitimate organizations will NEVER ask you to disclose."
    },
    "Requests for Financial Information": {
        "severity": "critical",
        "weight": 30,
        "raw_patterns": [
            r"\b(?:bank\s+(?:account|details|info)|banking\s+details|card\s+(?:details|number|info)|(?:credit|debit)\s+card(?:\s+details)?|16[\s-]digit|cvv|cvc|routing\s+number|pan\s+card|aadhaar|social\s+security|ssn|billing\s+(?:address|details|info))\b",
            r"\b(?:transfer\s+funds|wire\s+transfer|western\s+union|crypto\s+atm|bitcoin|prepaid\s+(?:visa|card)|apple\s+gift\s+cards?)\b",
            r"\b(?:update|enter|input|provide|submit|confirm|verify|send|share|give)\s+(?:(?:your|the)\s+)?(?:(?:credit|debit|bank)?\s*card(?:\s+details)?|card\s+details|banking\s+details|bank\s+(?:details|account)|payment\s+(?:details|method|info)|billing\s+(?:details|info|address)|financial\s+details)\b",
            r"\b(?:pay\s+[\$€£₹]?\s*[\d,]+|(?:send|share|provide|submit|give)\s+(?:(?:your|the)\s+)?(?:money|cash|details|info))\b"
        ],
        "explanation": "Solicits sensitive financial details or unconventional untraceable payment methods (gift cards, crypto, wire transfer)."
    },
    "Payment Request": {
        "severity": "high",
        "weight": 24,
        "raw_patterns": [
            r"\b(?:membership\s+payment|subscription\s+payment|billing\s+(?:issue|failure|problem|resolve)|payment\s+(?:declined|failed|overdue|pending|required|unsuccessful))\b",
            r"\b(?:update\s+(?:your\s+)?(?:payment\s+method|billing\s+(?:info|information|details)|card\s+details)|renew\s+(?:your\s+)?(?:subscription|membership))\b",
            r"\b(?:subscription\s+(?:could\s+not\s+be\s+renewed|has\s+expired|renewal\s+failed)|membership\s+(?:declined|expired|suspended))\b",
            r"\b(?:to\s+continue\s+(?:watching|service|membership|streaming)|reactivate\s+your\s+(?:account|membership|subscription))\b"
        ],
        "explanation": "Demands payment method updates, renewal fees, or card inputs under the pretense of billing issues or subscription lapses."
    },
    "Fake Rewards / Prize Bait": {
        "severity": "high",
        "weight": 25,
        "raw_patterns": [
            r"\b(?:congratulations|congrats|you\s+have\s+won|lucky\s+winner|prize|lottery|jackpot|free\s+gift|free\s+iphone|unclaimed\s+inheritance)\b",
            r"\b(?:claim\s+(?:your\s+)?(?:reward|prize|cashback|bonus|gift|money))\b",
            r"\b(?:won\s+[\$€£₹]?\s*[\d,]+|\d+\s*lakh|\d+\s*million\s+usd)\b"
        ],
        "explanation": "Promises unrealistic financial gains, lottery prizes, or gifts designed to bait you into revealing personal info or paying fees."
    },
    "Authority / Impersonation": {
        "severity": "high",
        "weight": 24,
        "raw_patterns": [
            r"\b(?:bank\s+(?:representative|officer|security|manager)|state\s+bank|sbi|chase|paypal|netflix|amazon\s+fraud)\b",
            r"\b(?:government\s+officer|tax\s+department|irs|fbi|cyber\s+crime|police\s+department)\b",
            r"\b(?:ceo|managing\s+director|company\s+administrator|hr\s+department|it\s+support|microsoft\s+certified)\b",
            r"\b(?:this\s+is\s+ceo\s+[a-z]+|dear\s+customer|dear\s+employee)\b"
        ],
        "explanation": "Claims to represent high-authority figures (CEO, government agents, fraud investigators) to demand compliance."
    },
    "Account Verification Scam": {
        "severity": "high",
        "weight": 22,
        "raw_patterns": [
            r"\b(?:kyc\s+(?:expired|update|mandatory)|verify\s+your\s+account|account\s+requires\s+(?:immediate\s+)?verification)\b",
            r"\b(?:unusual\s+activity|unrecognized\s+device|fraudulent\s+charge|unauthorized\s+(?:withdrawal|transaction|access))\b",
            r"\b(?:mandatory\s+verification|confirm\s+your\s+identity|restore\s+access|reactivate\s+(?:your\s+)?account)\b",
            r"\b(?:subscription|membership|account)\s+(?:has\s+)?(?:expired|lapsed|ended|been\s+suspended|been\s+frozen|on\s+hold|cancelled)\b"
        ],
        "explanation": "Feigns a routine security validation or KYC expiration to steal your identity documents or login credentials."
    },
    "Emotional Manipulation": {
        "severity": "medium",
        "weight": 18,
        "raw_patterns": [
            r"\b(?:grandson|relative|family\s+member)\s+(?:arrested|in\s+hospital|emergency|needs\s+bail)\b",
            r"\b(?:help\s+me|desperate|save\s+me|no\s+one\s+else\s+knows|keep\s+this\s+confidential)\b",
            r"\b(?:urgent\s+meeting\s+and\s+need\s+you\s+to|don't\s+tell\s+anyone)\b"
        ],
        "explanation": "Exploits psychological triggers such as family loyalty, sympathy, secrecy, or fear to lower your suspicion."
    }
}

# Pre-compile all regexes once for maximum performance (<1ms matching)
COMPILED_PATTERNS = {
    category: {
        "severity": data["severity"],
        "weight": data["weight"],
        "explanation": data["explanation"],
        "compiled": [re.compile(p, re.IGNORECASE) for p in data["raw_patterns"]]
    }
    for category, data in INDICATOR_DEFINITIONS.items()
}

def analyze_content(content: str, content_type: str = "message", sender: str = None, subject: str = None) -> Dict[str, Any]:
    """
    Perform deep, multi-layered social engineering analysis:
    1. Safe URL inspection without visiting
    2. Pre-compiled heuristic indicator pattern matching
    3. Scikit-learn TF-IDF NLP model classification
    4. Risk score calibration (0-100)
    5. Categorization: Low Risk, Suspicious, High Risk, Critical Risk
    6. Explainable AI breakdown and tailored recommendations
    """
    if not content or not content.strip():
        return {
            "classification": "Low Risk",
            "risk_score": 0,
            "confidence": 0.95,
            "indicators": [],
            "indicator_details": [],
            "explanation": "No content provided to analyze.",
            "recommendations": ["Submit suspicious text or email content for analysis."],
            "urls_analyzed": []
        }

    full_text = f"{sender or ''} {subject or ''} {content}".strip()

    # 1. URL Analysis (pure local parsing, 0ms network)
    url_results = analyze_urls_safely(full_text)
    detected_indicators = []
    explanation_parts = []
    recommendations_set = set()
    total_heuristic_weight = 0

    if url_results["suspicious_urls"]:
        detected_indicators.append({
            "indicator_name": "Suspicious Links",
            "severity": "high",
            "explanation": "Contains deceptive, shortened, or lookalike links often used in credential harvesting."
        })
        explanation_parts.append("The content contains suspicious URLs or domain spoofing patterns.")
        recommendations_set.add("Do not click unknown links or shortened URLs.")
        total_heuristic_weight += 25
    elif url_results["has_urls"]:
        detected_indicators.append({
            "indicator_name": "External Links Present",
            "severity": "low",
            "explanation": "The text contains web links that should be verified before visiting."
        })
        recommendations_set.add("Inspect links carefully before clicking to ensure they match official domains.")
        total_heuristic_weight += 5

    # 2. Pre-compiled Heuristic Patterns
    for ind_name, data in COMPILED_PATTERNS.items():
        matched = False
        for regex in data["compiled"]:
            if regex.search(full_text):
                matched = True
                break

        if matched:
            detected_indicators.append({
                "indicator_name": ind_name,
                "severity": data["severity"],
                "explanation": data["explanation"]
            })
            explanation_parts.append(data["explanation"])
            total_heuristic_weight += data["weight"]

            if "OTP" in ind_name or "Password" in ind_name:
                recommendations_set.add("Never disclose passwords, OTPs, or verification codes to anyone.")
            if "Urgency" in ind_name:
                recommendations_set.add("Take a step back. Scammers create urgency to rush your critical thinking.")
            if "Fear" in ind_name:
                recommendations_set.add("Hang up or disconnect. Contact official customer support through their verified website.")
            if "Reward" in ind_name:
                recommendations_set.add("Legitimate lotteries and contests do not require payment or banking details to claim prizes.")
            if "Authority" in ind_name:
                recommendations_set.add("Verify the sender's identity independently using an established public phone number.")
            if "Financial" in ind_name:
                recommendations_set.add("Do not transfer money or buy gift cards for unexpected callers or messages.")
            if "Payment" in ind_name:
                recommendations_set.add("Never update payment details through links in SMS or emails. Log in directly to the service's official website or app.")
            if "Account" in ind_name:
                recommendations_set.add("Navigate to the service directly by typing the official URL into your browser, not via message links.")

    # 3. Machine Learning Model Inference (in-memory vectorized prediction)
    ml_result = predict_ml(full_text)
    ml_risk = ml_result["ml_risk_score"]
    ml_label = ml_result["ml_label"]
    confidence = ml_result["ml_confidence"]

    # 4. Score Calibration (0 to 100)
    if total_heuristic_weight > 0:
        combined_score = int(round((ml_risk * 0.45) + (min(total_heuristic_weight * 1.15, 100) * 0.55)))
    else:
        combined_score = ml_risk

    risk_score = max(5, min(96, combined_score))

    # Classification Mapping
    if risk_score <= 30:
        classification = "Low Risk"
    elif risk_score <= 60:
        classification = "Suspicious"
    elif risk_score <= 80:
        classification = "High Risk"
    else:
        classification = "Critical Risk"

    if not recommendations_set:
        if classification in ["High Risk", "Critical Risk"]:
            recommendations_set.add("Treat this communication with extreme caution.")
            recommendations_set.add("Do not click links or provide personal information.")
            recommendations_set.add("Report and block the sender.")
        elif classification == "Suspicious":
            recommendations_set.add("Be cautious with any requested actions.")
            recommendations_set.add("Verify the sender before responding.")
            recommendations_set.add("Check for grammatical anomalies or odd phrasing.")
        else:
            recommendations_set.add("No immediate social engineering patterns detected.")
            recommendations_set.add("Always remain mindful when sharing sensitive data.")

    if not explanation_parts:
        if classification == "Low Risk":
            explanation = "This message appears to be standard communication without typical social engineering manipulation tactics, credential prompts, or threatening cues."
        else:
            explanation = "The wording exhibits subtle persuasion patterns or unusual phrasing typical of unverified promotional or alert notices."
    else:
        explanation = " ".join(explanation_parts[:3])

    indicator_names = [ind["indicator_name"] for ind in detected_indicators]
    recommendations_list = list(recommendations_set)

    return {
        "classification": classification,
        "risk_score": risk_score,
        "confidence": round(confidence, 2),
        "indicators": indicator_names,
        "indicator_details": detected_indicators,
        "explanation": explanation,
        "recommendations": recommendations_list,
        "ml_metadata": {
            "predicted_label": ml_label,
            "raw_ml_score": ml_risk,
            "probabilities": ml_result.get("probabilities", {})
        },
        "url_scan": url_results
    }
