import os
import sys
from pathlib import Path
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split

# Ensure backend root is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(BASE_DIR.parent))

from backend.ml.preprocess import clean_text_for_nlp

def train():
    dataset_path = BASE_DIR / "ml" / "dataset.csv"
    model_path = BASE_DIR / "ml" / "model.pkl"
    vectorizer_path = BASE_DIR / "ml" / "vectorizer.pkl"

    print(f"[*] Loading training dataset from {dataset_path}...")
    if not dataset_path.exists():
        raise FileNotFoundError(f"Dataset not found at {dataset_path}")

    df = pd.read_csv(dataset_path)
    print(f"[*] Dataset shape: {df.shape}")
    print(df['label'].value_counts())

    # Preprocess text
    print("[*] Preprocessing text data...")
    cleaned_texts = [clean_text_for_nlp(text) for text in df['text']]

    # Split train/test
    X_train, X_test, y_train, y_test = train_test_split(
        cleaned_texts, df['label'], test_size=0.2, random_state=42, stratify=df['label']
    )

    # Fit TF-IDF Vectorizer
    print("[*] Vectorizing with TF-IDF (1-2 ngrams)...")
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=2000,
        sublinear_tf=True
    )
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)

    # Train Logistic Regression
    print("[*] Training Logistic Regression classifier...")
    model = LogisticRegression(
        C=2.0,
        max_iter=1000,
        class_weight='balanced',
        random_state=42
    )
    model.fit(X_train_vec, y_train)

    # Evaluate
    y_pred = model.predict(X_test_vec)
    acc = accuracy_score(y_test, y_pred)
    print(f"[+] Test Accuracy: {acc:.2%}")
    print("\nClassification Report:\n", classification_report(y_test, y_pred))

    # Refit on all data for optimal production inference
    print("[*] Retraining on complete dataset for production artifact...")
    X_all_vec = vectorizer.fit_transform(cleaned_texts)
    model.fit(X_all_vec, df['label'])

    # Save artifacts
    joblib.dump(model, model_path)
    joblib.dump(vectorizer, vectorizer_path)
    print(f"[OK] Model saved to {model_path}")
    print(f"[OK] Vectorizer saved to {vectorizer_path}")

if __name__ == "__main__":
    train()
