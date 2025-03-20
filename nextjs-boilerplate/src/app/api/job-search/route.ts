import { NextRequest, NextResponse } from 'next/server';
import { JobSearchRequest } from '@/lib/openai';
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
 * POST handler for the job search API endpoint
 * Accepts a job search request and returns the search results
 */
export async function POST(req: NextRequest) {
  try {
    // Get the request body
    const jobSearchRequest: JobSearchRequest = await req.json();
    
    // Call the job search API
    const jobSearchResponse = await searchJobs(jobSearchRequest);
    
    // Return the response
    return NextResponse.json({
      success: true,
      message: "Job search completed successfully",
      id: `search_${Date.now()}`,
      jobSearchResponse
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error searching for jobs:', error);
    
    return NextResponse.json(
      { 
        success: false,
        message: 'Error searching for jobs',
        error: 'Error searching for jobs'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
