from models import Embedding, Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from flask import Flask, request, jsonify
import os
import numpy as np

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

engine = create_engine('sqlite:///embeddings.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)


@app.route('/register', methods=['POST'])
def register():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    audio_file = request.files['audio']
    username = request.form['username']

    if is_username_reserved(username):
        return jsonify({'error': 'Username is reserved'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], audio_file.filename)
    audio_file.save(file_path)

    embedding = get_embedding(file_path)

    session = Session()
    new_embedding = Embedding(username=username, embedding=embedding)
    session.add(new_embedding)
    session.commit()
    session.close()

    return jsonify({'message': 'Audio uploaded successfully'})


def is_username_reserved(username):
    session = Session()
    existing_user = session.query(
        Embedding).filter_by(username=username).first()
    session.close()
    return existing_user is not None


def get_embedding(file_path):
    # Replace this with your actual embedding generation logic
    embedding_vector = np.random.rand(512)
    embedding_bytes = embedding_vector.tobytes()
    return embedding_bytes


if __name__ == '__main__':
    app.run()
