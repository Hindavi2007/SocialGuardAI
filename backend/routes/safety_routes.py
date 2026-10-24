from flask import Blueprint, jsonify

safety_bp = Blueprint("safety", __name__, url_prefix="/api")

SAFETY_TIPS_DATA = [
    {
        "id": "message-safety",
        "category": "Message Safety",
        "icon": "MessageSquare",
        "title": "SMS & Chat App Defense",
        "tagline": "Smishing and chat scams are designed to trigger fast, emotional reactions.",
        "red_flags": [
            "Messages stating your bank account or debit card has been blocked today.",
            "SMS with unfamiliar short links claiming an undelivered parcel.",
            "Requests for urgent money transfers from unknown numbers claiming to be family.",
            "Surprise lottery win or government subsidy notifications."
        ],
        "defense_steps": [
            "Never reply directly with personal, banking, or contact details.",
            "Call the organization using the official number listed on their verified website.",
            "Block and report the sender number immediately in your messaging app.",
            "Do not click links inside unsolicited text messages."
        ]
    },
    {
        "id": "email-safety",
        "category": "Email Safety",
        "icon": "Mail",
        "title": "Phishing & Spoofing Protection",
        "tagline": "Attackers disguise emails to appear as reputable brands, colleagues, or vendors.",
        "red_flags": [
            "Sender display name matches an executive or bank, but the domain is @gmail.com or a misspelled address.",
            "Urgent demands to verify your login credentials within 24 hours.",
            "Unexpected attachments with extensions like .zip, .iso, .exe, or password-protected PDFs.",
            "Generic greetings like 'Dear Valued Customer' without your name."
        ],
        "defense_steps": [
            "Inspect the full email header and sender domain before clicking anything.",
            "Hover over links to verify the actual destination URL before clicking.",
            "Forward corporate phishing attempts to your organization's IT security team.",
            "Never open suspicious attachments from unverified senders."
        ]
    },
    {
        "id": "password-safety",
        "category": "Password Safety",
        "icon": "KeyRound",
        "title": "Credential Armor",
        "tagline": "Strong, unique passwords are your foundational line of digital defense.",
        "red_flags": [
            "Reusing the same master password across banking, social media, and email accounts.",
            "Using predictable sequences like 'Password123!', birthdays, or family names.",
            "Sharing passwords via plain text in Slack, email, or sticky notes."
        ],
        "defense_steps": [
            "Use a reputable password manager to generate 16+ character random passwords.",
            "Never reuse credentials between critical accounts (email, banking).",
            "Change passwords immediately if a service alerts you of a credential leak.",
            "Audit saved credentials periodically to eliminate stale or compromised logins."
        ]
    },
    {
        "id": "otp-safety",
        "category": "OTP Safety",
        "icon": "ShieldAlert",
        "title": "One-Time Password Confidentiality",
        "tagline": "An OTP is the final authorization step. Sharing it gives attackers direct access.",
        "red_flags": [
            "A caller claiming to be bank fraud support asking for the 6-digit SMS code to cancel a transaction.",
            "Receiving an OTP you did not request (indicates someone has your password).",
            "Buyer on an online marketplace asking you to verify your identity via OTP."
        ],
        "defense_steps": [
            "Remember: Legitimate banks, companies, and police will NEVER ask for your OTP.",
            "Read the entire SMS: OTP messages specify the transaction amount and merchant.",
            "If you receive an unexpected OTP, change your account password immediately.",
            "Switch from SMS OTP to Authenticator Apps (TOTP) or Hardware Security Keys (YubiKey) wherever possible."
        ]
    },
    {
        "id": "link-safety",
        "category": "Link Safety",
        "icon": "ExternalLink",
        "title": "Hyperlink Intelligence",
        "tagline": "Malicious links redirect to lookalike phishing pages designed to steal credentials.",
        "red_flags": [
            "Misspelled or typosquatted domains (e.g., paypa1.com, netfllix-billing.net).",
            "URL shorteners (bit.ly, tinyurl) hiding destination addresses in security alerts.",
            "URLs with direct IP addresses instead of recognized domain names.",
            "Links using suspicious TLDs (.xyz, .top, .pw, .click) for official communications."
        ],
        "defense_steps": [
            "Type known official web addresses directly into your browser bookmark bar.",
            "Inspect the domain name carefully from right to left before the first slash.",
            "Ensure the site uses valid HTTPS, but remember HTTPS alone does not guarantee a safe site.",
            "Scan suspicious URLs with SocialGuard AI before clicking."
        ]
    },
    {
        "id": "social-media-safety",
        "category": "Social Media Safety",
        "icon": "Users",
        "title": "Social Engineering on Networks",
        "tagline": "Fraudsters harvest public profile data to craft hyper-personalized spear-phishing attacks.",
        "red_flags": [
            "Cloned profiles of real friends sending messages asking for urgent financial help.",
            "Direct messages claiming your account violated copyright and will be suspended.",
            "Cryptocurrency investment schemes promising guaranteed daily returns.",
            "Job offers requiring you to pay an onboarding or equipment fee upfront."
        ],
        "defense_steps": [
            "Keep personal contact information, location, and travel plans private.",
            "Verify unusual requests from friends via a phone call or separate channel.",
            "Enable Two-Factor Authentication on all social media profiles.",
            "Beware of oversharing details used in security challenge questions (pets, school, mother's maiden name)."
        ]
    },
    {
        "id": "online-shopping-safety",
        "category": "Online Shopping Safety",
        "icon": "ShoppingBag",
        "title": "E-Commerce Fraud Prevention",
        "tagline": "Counterfeit stores use social media ads to capture credit cards and deliver nothing.",
        "red_flags": [
            "Prices that are impossibly low (e.g. 90% discount on luxury electronics).",
            "Websites with no physical business address, refund policy, or working phone number.",
            "Payment options restricted only to wire transfer, crypto, or gift cards.",
            "Web store registered only days or weeks ago."
        ],
        "defense_steps": [
            "Shop on well-established, reputable e-commerce platforms.",
            "Use virtual credit cards or PayPal to prevent exposing your primary debit card.",
            "Research unfamiliar stores on consumer review sites and check domain WHOIS age.",
            "Monitor your bank statements regularly for unauthorized charges."
        ]
    }
]

@safety_bp.route("/safety-tips", methods=["GET"])
def get_safety_tips():
    return jsonify({
        "categories": SAFETY_TIPS_DATA,
        "count": len(SAFETY_TIPS_DATA)
    }), 200
