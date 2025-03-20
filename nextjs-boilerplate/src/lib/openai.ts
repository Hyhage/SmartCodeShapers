import OpenAI from 'openai';
import fs from 'fs';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcribe audio file to text using OpenAI's Whisper API
 * @param filePath Path to the audio file
 * @returns Transcribed text
 */
export async function transcribeAudio(filePath: string): Promise<string> {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // For demonstration purposes, return a mock transcription
    // In a real application, you would use the OpenAI API
    if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('Using mock transcription because no valid API key is provided');
      return "This is a mock transcription. To get real transcriptions, please provide a valid OpenAI API key in the .env.local file.";
    }

    // Create a readable stream from the file
    const fileStream = fs.createReadStream(filePath);

    // Call the OpenAI API to transcribe the audio
    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
    });

    return transcription.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    
    // If there's an API key error, provide a helpful message
    if (error instanceof Error && error.message.includes('API key')) {
      return "Error: Invalid or missing OpenAI API key. Please provide a valid API key in the .env.local file.";
    }
    
    throw error;
  }
}
