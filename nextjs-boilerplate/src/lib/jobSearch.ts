import { JobSearchRequest } from './openai';

/**
 * Interface for the job search API response
 */
export interface JobSearchResponse {
  data: {
    totalCount: number;
    continuationToken: string;
    jobs: Array<{
      id: string;
      title: string;
      contentLanguage: string;
      cityName: string;
      lastModified: string;
      isSaved: boolean;
      functionDomainsLevel1: Array<{
        id: number;
        name: string;
      }>;
      reference: string;
      salary?: {
        unit: string;
        minimumValue: number;
        maximumValue: number;
      };
      contractType: {
        id: number;
        name: string;
      };
      jobDescription: string;
      regime: {
        id: number;
        name: string;
        halfTimeMinWorkingHours: number | null;
        halfTimeMaxWorkingHours: number | null;
      };
    }>;
    facets: Array<{
      key: string;
      facetResults: Array<{
        id: string | number;
        name: string;
        count: number;
      }>;
    }>;
  };
  statusCode: number;
  ticketId: string | null;
  messages: any | null;
}

/**
 * Search for jobs using the AccentJobs API
 * @param request The job search request object
 * @returns The job search response
 */
export async function searchJobs(request: JobSearchRequest): Promise<JobSearchResponse> {
  try {
    const response = await fetch('https://accentjobs.be/api/accj/job/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Job search failed with status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching for jobs:', error);
    throw error;
  }
}
