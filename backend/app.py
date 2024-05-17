from models import Embedding, Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from flask import Flask, request, jsonify
import os
import numpy as np
from generate_embedding import Model
from convert_audio import webm_to_wav
from verifyvoice import Similarity

app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

engine = create_engine('sqlite:///embeddings.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

spk_emb_model = Model()

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

    embedding = spk_emb_model.get_embedding(wav_file_path)

    session = Session()
    new_embedding = Embedding(username=username, embedding=embedding)
    session.add(new_embedding)
    session.commit()
    session.close()

    return jsonify({'message': 'Audio uploaded successfully'})


@app.route('/verify', methods=['POST'])
def verify():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400

    audio_file = request.files['audio']
    # username = request.form['username']

    # if is_username_reserved(username):
    #     return jsonify({'error': 'Username is reserved'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], audio_file.filename)
    audio_file.save(file_path)

    # convert to wav
    wav_file_path = os.path.join(app.config['UPLOAD_FOLDER'], "recorded_audio_wav.wav")
    webm_to_wav(webm_file_path=file_path, save_wav_file_name=wav_file_path)

    embedding = spk_emb_model.get_embedding(wav_file_path)

    session = Session()
    all_embeddings = session.query(Embedding).all()
    print(f"{len(all_embeddings)=}")

    similarities = []
    for stored_embedding in all_embeddings:
        username = stored_embedding.username
        embedding_binary = stored_embedding.embedding
        embedding_array = np.frombuffer(embedding_binary, dtype=np.float32).reshape(1, 256)
        print(f"{username=} : {embedding_array.shape=} {embedding.shape=}")
        similarity = Similarity.cosine(embedding_array, embedding)
        
        similarities.append((stored_embedding.username, similarity))

    session.close()

    # Sort the similarities in descending order
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Return the top match
    top_match = similarities[0]
    print(f"{top_match=}")
    
    username, score = top_match
    print(f"M {username} {score}")

    if score >= 0.6:
        print(f"Match Found")
        return jsonify({'message': 'Match Found',
                        'username': username,
                        'score': str(score)
                        })
    else:
        print(f"Match Not Found {top_match}")
        return jsonify({'error': 'Match Not Found'})



def is_username_reserved(username):
    session = Session()
    existing_user = session.query(
    Embedding).filter_by(username=username).first()
    session.close()
    return existing_user is not None



if __name__ == '__main__':
    
    app.run(debug=True)
