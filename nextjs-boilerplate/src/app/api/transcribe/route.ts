import { NextRequest, NextResponse } from 'next/server';
import { saveFile, deleteFile } from '@/lib/formidable';
import { transcribeAudio } from '@/lib/openai';

// Configure the API route
export const runtime = 'nodejs';

/**
 * POST handler for the transcribe API endpoint
 * Accepts an MP3 file and returns the transcribed text
 */
export async function POST(req: NextRequest) {
  let filePath: string | null = null;
  
  try {
    // Get the form data from the request
    const formData = await req.formData();
    
    // Get the file from the form data
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check if the file is an audio file
    if (!file.type.includes('audio/')) {
      return NextResponse.json(
        { error: 'File must be an audio file' },
        { status: 400 }
      );
    }

    // Save the file to disk
    filePath = await saveFile(file);

    // Transcribe the audio
    const transcription = await transcribeAudio(filePath);

    // Clean up: delete the file after transcription
    if (filePath) {
      await deleteFile(filePath);
    }

    // Return the transcription
    return NextResponse.json({ transcription });
  } catch (error) {
    console.error('Error processing audio:', error);
    
    // Clean up in case of error
    if (filePath) {
      await deleteFile(filePath);
    }
    
    return NextResponse.json(
      { error: 'Error processing audio file' },
      { status: 500 }
    );
  }
}
