import { NextRequest, NextResponse } from 'next/server';
import { saveFile, deleteFile } from '@/lib/formidable';
import { transcribeAudio, CandidateInfo, transformToJobSearchRequest, JobSearchRequest } from '@/lib/openai';
import { searchJobs } from '@/lib/jobSearch';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

// Configure the API route
export const runtime = 'nodejs';

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, { headers: corsHeaders });
}

/**
 * POST handler for the transcribe API endpoint
 * Accepts an MP3 file and returns the transcribed text
 */
export async function POST(req: NextRequest) {
  let filePath: string | null = null;
  
  try {
    let file: File | null = null;
    
    // Check if the request is a raw blob or FormData
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData request
      const formData = await req.formData();
      
      // Try to get the file with different field names
      file = formData.get('file') as File || formData.get('audio') as File || null;
    } else {
      // Handle raw blob request
      const blob = await req.blob();
      file = new File([blob], 'audio.mp3', { type: contentType });
    }
    
    if (!file) {
      return NextResponse.json(
        { 
          success: false,
          message: 'No audio file provided',
          error: 'No audio file provided'
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if the file is an audio file
    if (!file.type.includes('audio/')) {
      return NextResponse.json(
        { 
          success: false,
          message: 'File must be an audio file',
          error: 'File must be an audio file'
        },
        { status: 400, headers: corsHeaders }
      );
    }

    // Save the file to disk
    filePath = await saveFile(file);

    // Transcribe the audio and extract candidate info
    const result = await transcribeAudio(filePath);

    // Clean up: delete the file after transcription
    if (filePath) {
      await deleteFile(filePath);
    }

    // Transform candidate info to job search request
    const jobSearchRequest = transformToJobSearchRequest(result.candidateInfo);
    
    // Perform job search
    let jobSearchResponse = null;
    try {
      jobSearchResponse = await searchJobs(jobSearchRequest);
    } catch (searchError) {
      console.error('Error searching for jobs:', searchError);
      // Continue even if job search fails
    }

    // Return the transcription, candidate info, job search request, and job search response
    // Also include the fields expected by the frontend
    return NextResponse.json({
      success: true,
      message: "Audio successfully processed and stored",
      id: `audio_${Date.now()}`,
      transcription: result.transcription,
      candidateInfo: result.candidateInfo,
      jobSearchRequest,
      jobSearchResponse
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error processing audio:', error);
    
    // Clean up in case of error
    if (filePath) {
      await deleteFile(filePath);
    }
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Error processing audio file',
        error: 'Error processing audio file'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
