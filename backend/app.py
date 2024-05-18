from models import Embedding, Base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
from flask import Flask, request, jsonify
import os
import numpy as np
from generate_embedding import Model
from convert_audio import webm_to_wav
from sklearn.metrics.pairwise import cosine_similarity
from io import BytesIO


app = Flask(__name__)
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

engine = create_engine('sqlite:///embeddings.db')
Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)

spk_emb_model = Model()

num_eval = 10

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

    embedding = spk_emb_model.get_embedding(wav_file_path, num_eval=num_eval)

    if embedding is None:
        print("error: audio is too short/empty")
        return jsonify({'error': 'Audio is too short/empty'})
    
    serialized_emb = serialize_array(embedding)


    session = Session()
    new_embedding = Embedding(username=username, embedding=serialized_emb)
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

    embedding = spk_emb_model.get_embedding(wav_file_path, num_eval=num_eval)
    
    if embedding is None:
        print("error: audio is too short/empty")
        return jsonify({'error': 'Audio is too short/empty'})
    print(f"Embedding shape: {embedding.shape} {embedding}")

    session = Session()
    all_embeddings = session.query(Embedding).all()
    print(f"{len(all_embeddings)=}")

    similarities = []
    for stored_embedding in all_embeddings:
        username = stored_embedding.username
        embedding_binary = stored_embedding.embedding
        embedding_array = deserialize_array(embedding_binary)
        # embedding_array = np.frombuffer(embedding_binary, dtype=np.float32).reshape(num_eval, -1)
        print(f"{username=}")
        similarity = cosine_similarity(embedding_array, embedding).mean()
        print(f"{similarity=}")
        similarities.append((stored_embedding.username, similarity))

    session.close()

    # Sort the similarities in descending order
    similarities.sort(key=lambda x: x[1], reverse=True)

    # Return the top match
    top_match = similarities[0]
    print(f"{top_match=}")

    for username, score in similarities:
        print(f"username: {username} score: {score}")
    
    username, score = top_match

    if score >= 0.22:
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

def serialize_array(array):
    with BytesIO() as output:
        np.save(output, array)
        return output.getvalue()
    
def deserialize_array(binary_data):
    with BytesIO(binary_data) as input_data:
        return np.load(input_data)

if __name__ == '__main__':
    
    app.run(debug=True)
