import OpenAI from 'openai';
import fs from 'fs';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Interface for the extracted candidate information
 */
export interface CandidateInfo {
  function: string;
  location: string;
}

/**
 * Interface for the job search API request
 */
export interface JobSearchRequest {
  limit: number;
  queryTexts: string[];
  language: string;
  facets: Array<{
    key: string;
    selectedValues: string[];
  }>;
  location?: {
    locationCoordinates: Array<{
      cityName: string;
      latitude: string;
      longitude: string;
      name: string;
      zipCode: string;
    }>;
    radius: string;
  } | null;
  filters: any[];
}

/**
 * Transcribe audio file to text using OpenAI's Whisper API
 * @param filePath Path to the audio file
 * @returns Transcribed text and extracted candidate information
 */
export async function transcribeAudio(filePath: string): Promise<{ transcription: string; candidateInfo: CandidateInfo }> {
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // For demonstration purposes, return a mock transcription
    // In a real application, you would use the OpenAI API
    if (process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      console.log('Using mock transcription because no valid API key is provided');
      // Randomly return either English or Dutch mock transcription
      const isEnglish = Math.random() > 0.5;
      const mockTranscription = isEnglish
        ? "This is a mock transcription in English. To get real transcriptions, please provide a valid OpenAI API key in the .env.local file."
        : "Dit is een voorbeeld transcriptie in het Nederlands. Voor echte transcripties, voeg een geldige OpenAI API-sleutel toe in het .env.local bestand.";
      
      return {
        transcription: mockTranscription,
        candidateInfo: { function: "", location: "" }
      };
    }

    // Create a readable stream from the file
    const fileStream = fs.createReadStream(filePath);

    // Call the OpenAI API to transcribe the audio
    // Whisper API will auto-detect the language (works well with English and Dutch)
    const transcription = await openai.audio.transcriptions.create({
      file: fileStream,
      model: 'whisper-1',
      // No language parameter - Whisper will auto-detect
    });

    const transcriptionText = transcription.text;
    
    // Extract function and location from the transcription
    const candidateInfo = await extractCandidateInfo(transcriptionText);
    
    return {
      transcription: transcriptionText,
      candidateInfo
    };
  } catch (error) {
    console.error('Error transcribing audio:', error);
    
    // If there's an API key error, provide a helpful message
    if (error instanceof Error && error.message.includes('API key')) {
      return {
        transcription: "Error: Invalid or missing OpenAI API key. Please provide a valid API key in the .env.local file.",
        candidateInfo: { function: "", location: "" }
      };
    }
    
    throw error;
  }
}

/**
 * Extract function and location information from transcribed text
 * @param transcription The transcribed text to analyze
 * @returns Object containing function and location
 */
export async function extractCandidateInfo(transcription: string): Promise<CandidateInfo> {
  try {
    // Default empty values
    const defaultInfo: CandidateInfo = { function: "", location: "" };
    
    // If no transcription or API key is not valid, return empty values
    if (!transcription || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
      return defaultInfo;
    }
    
    // Use OpenAI to extract the information
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts job function and location information from candidate transcriptions. Return ONLY the extracted information in JSON format with 'function' and 'location' fields. If information is not found, return empty strings for those fields."
        },
        {
          role: "user",
          content: `Extract the job function and location from the following candidate transcription. Return only the JSON:\n\n${transcription}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    const content = response.choices[0]?.message?.content || '{"function":"","location":""}';
    const extractedInfo = JSON.parse(content) as CandidateInfo;
    
    return {
      function: extractedInfo.function || "",
      location: extractedInfo.location || ""
    };
  } catch (error) {
    console.error('Error extracting candidate info:', error);
    // Return empty values if extraction fails
    return { function: "", location: "" };
  }
}

/**
 * Transform the extracted candidate information into a job search API request
 * @param candidateInfo The extracted candidate information
 * @returns Job search API request object
 */
export function transformToJobSearchRequest(candidateInfo: CandidateInfo): JobSearchRequest {
  // Create a default request with empty values
  const request: JobSearchRequest = {
    limit: 30,
    queryTexts: [],
    language: "nl",
    facets: [
      { key: "FUNCTION_DOMAIN", selectedValues: [] },
      { key: "LOCATION", selectedValues: [] },
      { key: "OFFICE", selectedValues: [] },
      { key: "PROVINCE", selectedValues: [] }
    ],
    filters: []
  };

  // Add function to queryTexts if available
  if (candidateInfo.function && candidateInfo.function.trim() !== "") {
    request.queryTexts = [candidateInfo.function.trim()];
  }

  // Add location if available
  if (candidateInfo.location && candidateInfo.location.trim() !== "") {
    // For simplicity, we're using a hardcoded location structure
    // In a real application, you might want to use a geocoding service to get coordinates
    request.location = {
      locationCoordinates: [
        {
          cityName: candidateInfo.location.trim(),
          latitude: "51.04999923706055", // Default to Ghent coordinates
          longitude: "3.7167000770568848",
          name: candidateInfo.location.trim(),
          zipCode: "9000" // Default to Ghent zip code
        }
      ],
      radius: "30"
    };
  } else {
    request.location = null;
  }

  return request;
}
