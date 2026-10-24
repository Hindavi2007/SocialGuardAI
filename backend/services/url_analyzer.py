import re
from urllib.parse import urlparse
from backend.ml.preprocess import extract_urls

# Common URL shorteners known to mask destinations
SHORTENER_DOMAINS = {
    "bit.ly", "tinyurl.com", "t.co", "is.gd", "buff.ly", "ow.ly",
    "rb.gy", "cutt.ly", "shorturl.at", "rebrand.ly", "tiny.cc"
}

# TLDs frequently abused in rapid phishing campaigns
SUSPICIOUS_TLDS = {
    "xyz", "top", "pw", "online", "click", "cam", "loan", "work",
    "icu", "buzz", "gq", "cf", "ml", "ga", "tk", "rest", "support",
    "live", "website", "vip", "monster", "cfd"
}

# Well-known brands frequently targeted for spoofing
SPOOF_TARGET_BRANDS = [
    "paypal", "apple", "microsoft", "google", "netflix", "amazon",
    "facebook", "instagram", "whatsapp", "chase", "bankofamerica",
    "wellsfargo", "sbi", "hdfc", "icici", "binance", "coinbase"
]

IP_ADDRESS_REGEX = re.compile(r'^(?:\d{1,3}\.){3}\d{1,3}$')

def analyze_urls_safely(text: str) -> dict:
    """
    Safely inspect URLs in text without performing any external network requests.
    Identifies obfuscated hosts, IP domains, shorteners, suspicious TLDs, and brand typosquatting.
    """
    urls = extract_urls(text)
    if not urls:
        return {
            "has_urls": False,
            "urls": [],
            "suspicious_urls": [],
            "risk_flags": []
        }

    suspicious_urls = []
    risk_flags = []

    for raw_url in urls:
        # Prepend scheme if missing for proper urllib parsing
        parsed_target = raw_url
        if not raw_url.startswith(("http://", "https://", "ftp://")):
            parsed_target = "http://" + raw_url

        try:
            parsed = urlparse(parsed_target)
            hostname = (parsed.hostname or "").lower()

            reasons = []

            # 1. Direct IP Address Host
            if IP_ADDRESS_REGEX.match(hostname):
                reasons.append(f"Uses direct IP address instead of registered domain ({hostname})")

            # 2. URL Shortener
            if hostname in SHORTENER_DOMAINS:
                reasons.append(f"Uses link shortener ({hostname}) to conceal actual destination")

            # 3. Suspicious or Abused TLD
            tld = hostname.split(".")[-1] if "." in hostname else ""
            if tld in SUSPICIOUS_TLDS:
                reasons.append(f"Uses high-risk TLD commonly associated with throwaway phishing domains (.{tld})")

            # 4. Brand Impersonation / Typosquatting
            for brand in SPOOF_TARGET_BRANDS:
                if brand in hostname:
                    # Check if it's the legitimate apex domain or spoof
                    # e.g., 'paypal.com' is safe, 'paypal-verify-alert.com' is spoof
                    is_legit = hostname == f"{brand}.com" or hostname.endswith(f".{brand}.com")
                    if not is_legit:
                        reasons.append(f"Possible brand impersonation of '{brand}' in domain name ({hostname})")

            # 5. Punycode / IDN Homograph attack
            if "xn--" in hostname:
                reasons.append("Contains Punycode (xn--), potential homograph domain spoofing")

            # 6. Excessive Subdomain Stacking (e.g. bank.com.account.update.xyz)
            subdomain_parts = hostname.split(".")
            if len(subdomain_parts) >= 4 and not IP_ADDRESS_REGEX.match(hostname):
                reasons.append("Excessive subdomain nesting often used to deceive mobile display bars")

            # 7. Sensitive keywords in path/query (verify, login, otp, password, banking)
            full_path = (parsed.path + " " + parsed.query).lower()
            credential_keywords = ["verify", "login", "signin", "password", "update-bank", "kyc", "otp", "pin"]
            matched_keywords = [kw for kw in credential_keywords if kw in full_path]
            if matched_keywords:
                reasons.append(f"Path contains credential collection keywords ({', '.join(matched_keywords)})")

            if reasons:
                suspicious_urls.append({
                    "url": raw_url,
                    "reasons": reasons
                })
                risk_flags.extend(reasons)

        except Exception:
            # Malformed URL
            risk_flags.append(f"Malformed or obfuscated URL: {raw_url[:30]}...")

    return {
        "has_urls": True,
        "urls": urls,
        "suspicious_urls": suspicious_urls,
        "risk_flags": list(set(risk_flags))
    }
