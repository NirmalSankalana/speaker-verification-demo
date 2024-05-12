from sqlalchemy import create_engine

from sqlalchemy.orm import sessionmaker

# SQLALCHEMY_DATABASE_URL = "postgresql://<username>:<password>@<ip-address/hostname>/<database_name>"
SQLALCHEMY_DATABASE_URL = f"sqlite+pysqlite:///test.db"

# The engine represents the database connection. It manages the connection pool and communicates with the database server.
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}, echo=True
)

# The sessionmaker() function is used to create a session factory.
# The session factory generates individual session objects that provide a context for database operations.
# In the example, SessionLocal is created by calling sessionmaker() and passing the engine as the bind parameter.

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# Dependency


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
