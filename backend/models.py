from sqlalchemy import Column, Integer, String, LargeBinary
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Embedding(Base):
    __tablename__ = 'embeddings'

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    embedding = Column(LargeBinary, nullable=False)

    def __init__(self, username, embedding):
        self.username = username
        self.embedding = embedding

    def __repr__(self):
        return f"Embedding(username='{self.username}')"
