from verifyvoice import ModelLoader


def get_embedding(audio_path, attention_heads=8):
    model = ModelLoader(model_name="WavLM", attention_heads=8)
    emb = model.get_embedding(audio_path)
    print(f"embedding generated for audio : {audio_path} shape {emb.shape}")
    return emb
