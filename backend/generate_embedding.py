from verifyvoice import ModelLoader

class Model():
    def __init__(self, model_name="WavLM", attention_heads=8):
        self.model = ModelLoader(model_name="WavLM", attention_heads=attention_heads)
        

    def get_embedding(self, audio_path, evalmode=True, vad=True, num_eval=10):
        emb = self.model.get_embedding(audio_path, evamode=evalmode, vad=vad, num_eval=num_eval)
        print(f"embedding generated for audio : {audio_path}")
        return emb
