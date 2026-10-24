import re
import string

# URL extraction regex
URL_REGEX = re.compile(
    r'(?:https?:\/\/|ftp:\/\/|www\.)[^\s/$.?#].[^\s]*',
    re.IGNORECASE
)

# Email address extraction regex
EMAIL_REGEX = re.compile(
    r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+',
    re.IGNORECASE
)

# Phone number regex
PHONE_REGEX = re.compile(
    r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}',
    re.IGNORECASE
)

def extract_urls(text: str) -> list[str]:
    """Extract all URLs found in the text."""
    if not text:
        return []
    return URL_REGEX.findall(text)

def clean_text_for_nlp(text: str) -> str:
    """
    Clean text for TF-IDF and NLP processing:
    - Lowercase
    - Replace URLs with placeholder token
    - Replace emails and phone numbers with tokens
    - Normalize whitespace and punctuation
    """
    if not text:
        return ""
    
    # Lowercase
    cleaned = text.lower()
    
    # Replace URLs with special token
    cleaned = URL_REGEX.sub(" token_url ", cleaned)
    
    # Replace emails with special token
    cleaned = EMAIL_REGEX.sub(" token_email ", cleaned)
    
    # Replace phone numbers with token
    cleaned = PHONE_REGEX.sub(" token_phone ", cleaned)
    
    # Replace currencies with token
    cleaned = re.sub(r'[\$€£₹]\s*\d+(?:,\d{3})*(?:\.\d+)?', ' token_money ', cleaned)
    
    # Replace numbers with token
    cleaned = re.sub(r'\b\d+\b', ' token_num ', cleaned)
    
    # Remove punctuation except underscores to preserve tokens
    punct_to_remove = string.punctuation.replace('_', '')
    cleaned = re.sub(r'[' + re.escape(punct_to_remove) + ']', ' ', cleaned)
    
    # Strip multi-spaces
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    
    return cleaned
