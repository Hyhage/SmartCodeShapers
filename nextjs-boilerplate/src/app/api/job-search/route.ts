import { NextRequest, NextResponse } from 'next/server';
import { JobSearchRequest } from '@/lib/openai';
import { searchJobs } from '@/lib/jobSearch';

// Configure the API route
export const runtime = 'nodejs';

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
    return NextResponse.json(jobSearchResponse);
  } catch (error) {
    console.error('Error searching for jobs:', error);
    
    return NextResponse.json(
      { error: 'Error searching for jobs' },
      { status: 500 }
    );
  }
}
