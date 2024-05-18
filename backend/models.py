from sqlalchemy import Column, Integer, String, LargeBinary, BLOB
from sqlalchemy.ext.declarative import declarative_base
import numpy as np
from io import BytesIO


Base = declarative_base()

class Embedding(Base):
    __tablename__ = 'embeddings'

    id = Column(Integer, primary_key=True)
    username = Column(String, nullable=False)
    embedding = Column(BLOB, nullable=False)

    def __init__(self, username, embedding):
        self.username = username
        self.embedding = embedding.tobytes()

    def __repr__(self):
        return f"Embedding(username='{self.username}')"

# class Embedding(Base):
#     __tablename__ = 'embeddings'

#     id = Column(Integer, primary_key=True)
#     username = Column(String, nullable=False)
#     embedding = Column(LargeBinary, nullable=False)

#     def __init__(self, username, embedding):
#         self.username = username
#         self.embedding = self._serialize_embedding(embedding)

#     def __repr__(self):
#         return f"Embedding(username='{self.username}')"

#     @staticmethod
#     def _serialize_embedding(embedding):
#         return np.save(BytesIO(), embedding)

#     @staticmethod
#     def _deserialize_embedding(embedding_binary):
#         return np.load(BytesIO(embedding_binary))

#     def get_embedding(self):
#         return self._deserialize_embedding(self.embedding)
    
#     def __repr__(self):
#         return f"Embedding(username='{self.username}')"