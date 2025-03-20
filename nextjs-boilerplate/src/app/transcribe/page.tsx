'use client';

import { useState, useRef } from 'react';

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select an audio file');
      return;
    }

    // Check if file is an audio file
    if (!file.type.includes('audio/')) {
      setError('File must be an audio file');
      return;
    }

    setIsLoading(true);
    setError('');
    setTranscription('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to transcribe audio');
      }

      setTranscription(data.transcription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTranscription('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Speech to Text Converter
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="audio-file" className="block text-sm font-medium">
              Upload Audio File (MP3)
            </label>
            <input
              ref={fileInputRef}
              id="audio-file"
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="text-sm text-gray-500 mt-1">
                Selected file: {file.name}
              </p>
            )}
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={!file || isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
        )}

        {transcription && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Transcription Result</h2>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              <p className="whitespace-pre-wrap">{transcription}</p>
            </div>
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>
            Note: This application uses OpenAI's Whisper API for speech-to-text
            conversion. You need to provide your own OpenAI API key in the
            .env.local file.
          </p>
        </div>
      </div>
    </div>
  );
}
