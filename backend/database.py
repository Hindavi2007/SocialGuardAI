import logging
import socket
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, scoped_session, sessionmaker
from backend.config import Config

logger = logging.getLogger(__name__)

Base = declarative_base()

def is_tcp_port_open(host: str, port: int, timeout: float = 0.2) -> bool:
    """Fast non-blocking check to see if a port is open before attempting driver connection."""
    try:
        with socket.create_connection((host, int(port)), timeout=timeout):
            return True
    except (OSError, socket.timeout):
        return False

def get_engine():
    """Determine database engine based on configuration and availability without blocking."""
    if Config.DATABASE_URI:
        target_uri = Config.DATABASE_URI
        logger.info(f"[SocialGuard DB] Using custom DATABASE_URI: {target_uri}")
        return create_engine(target_uri, pool_pre_ping=True)

    if Config.DB_TYPE == "mysql":
        logger.info(f"[SocialGuard DB] Connecting to MySQL at {Config.MYSQL_HOST}:{Config.MYSQL_PORT}...")
        return create_engine(Config.MYSQL_URL, pool_pre_ping=True, pool_recycle=3600)
    
    if Config.DB_TYPE == "sqlite":
        logger.info(f"[SocialGuard DB] Using SQLite database at {Config.SQLITE_URL}")
        return create_engine(Config.SQLITE_URL, connect_args={"check_same_thread": False})
    
    # Auto mode: probe port first (0.2s max), fallback immediately if MySQL is not running
    if is_tcp_port_open(Config.MYSQL_HOST, Config.MYSQL_PORT, timeout=0.2):
        try:
            mysql_engine = create_engine(Config.MYSQL_URL, pool_pre_ping=True, connect_args={"connect_timeout": 2})
            with mysql_engine.connect() as conn:
                pass
            logger.info("[SocialGuard DB] Successfully connected to MySQL database!")
            return mysql_engine
        except Exception as e:
            logger.warning(f"[SocialGuard DB] MySQL connect failed ({e}). Falling back to SQLite.")
    else:
        logger.info(f"[SocialGuard DB] MySQL not detected on port {Config.MYSQL_PORT}. Using local SQLite: {Config.SQLITE_URL}")

    return create_engine(Config.SQLITE_URL, connect_args={"check_same_thread": False})

engine = get_engine()
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
Base.query = db_session.query_property()

def init_db():
    """Import models and create all tables if they do not exist."""
    import backend.models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    logger.info("[SocialGuard DB] Database tables initialized successfully.")
