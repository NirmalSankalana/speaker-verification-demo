import React, { useRef, useState } from 'react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const mediaStream = useRef(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
        const audioURL = URL.createObjectURL(recordedBlob);
        setRecordedAudioURL(audioURL);
        onRecordingComplete(recordedBlob);
        chunks.current = [];
        setIsRecording(false);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div>
      <button onClick={toggleRecording}>{isRecording ? 'Stop Recording' : 'Start Recording'}</button>
      {recordedAudioURL && (
        <div>
          <audio controls src={recordedAudioURL}></audio>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
