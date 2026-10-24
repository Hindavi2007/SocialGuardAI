import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR.parent / ".env")

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "socialguard-super-secure-secret-key-2026")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "socialguard-jwt-secure-token-key-2026")
    JWT_ACCESS_TOKEN_EXPIRES_HOURS = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES_HOURS", "24"))
    
    # Database configuration
    # Can use MySQL: mysql+pymysql://<user>:<password>@<host>:<port>/<dbname>
    # Or fallback SQLite
    MYSQL_USER = os.getenv("DB_USER", "root")
    MYSQL_PASSWORD = os.getenv("DB_PASSWORD", "")
    MYSQL_HOST = os.getenv("DB_HOST", "localhost")
    MYSQL_PORT = os.getenv("DB_PORT", "3306")
    MYSQL_DB = os.getenv("DB_NAME", "socialguard_db")
    
    MYSQL_URL = f"mysql+pymysql://{MYSQL_USER}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DB}?charset=utf8mb4"
    SQLITE_URL = f"sqlite:///{BASE_DIR / 'socialguard.db'}"
    
    # Set DB_TYPE: 'mysql' or 'sqlite' or 'auto' (tries mysql, falls back to sqlite)
    DB_TYPE = os.getenv("DB_TYPE", "auto")
    DATABASE_URI = os.getenv("DATABASE_URL", None)

    # ML Paths
    ML_MODEL_PATH = BASE_DIR / "ml" / "model.pkl"
    ML_VECTORIZER_PATH = BASE_DIR / "ml" / "vectorizer.pkl"
    ML_DATASET_PATH = BASE_DIR / "ml" / "dataset.csv"
