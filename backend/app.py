from models import Embedding, Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from flask import Flask, request, jsonify
import os
import numpy as np
from generate_embedding import get_embedding
from convert_audio import webm_to_wav


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

    # convert to wav
    wav_file_path = os.path.join(app.config['UPLOAD_FOLDER'], "recorded_audio_wav.wav")
    webm_to_wav(webm_file_path=file_path, save_wav_file_name=wav_file_path)

    embedding = get_embedding(wav_file_path)

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



if __name__ == '__main__':
    app.run(debug=True)
