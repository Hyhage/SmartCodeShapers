'use client';

import { useState, useRef } from 'react';

// Define the interfaces for data structures
interface CandidateInfo {
  function: string;
  location: string;
}

interface JobSearchRequest {
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

interface JobSearchResponse {
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

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [candidateInfo, setCandidateInfo] = useState<CandidateInfo>({ function: '', location: '' });
  const [jobSearchRequest, setJobSearchRequest] = useState<JobSearchRequest | null>(null);
  const [jobSearchResponse, setJobSearchResponse] = useState<JobSearchResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
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
      setCandidateInfo(data.candidateInfo || { function: '', location: '' });
      setJobSearchRequest(data.jobSearchRequest || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setTranscription('');
    setCandidateInfo({ function: '', location: '' });
    setJobSearchRequest(null);
    setJobSearchResponse(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSearch = async () => {
    if (!jobSearchRequest) return;
    
    setIsSearching(true);
    setError('');
    
    try {
      const response = await fetch('/api/job-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobSearchRequest),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search for jobs');
      }
      
      setJobSearchResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error searching for jobs');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Candidate Job Matcher
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
            
            <h2 className="text-xl font-semibold mb-3 mt-6">Extracted Candidate Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Function</h3>
                <p>{candidateInfo.function || 'Not found'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                <p>{candidateInfo.location || 'Not found'}</p>
              </div>
            </div>
            
            {jobSearchRequest && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">API Request for Job Search</h2>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <pre className="whitespace-pre-wrap text-sm overflow-auto">
                    {JSON.stringify(jobSearchRequest, null, 2)}
                  </pre>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSearching ? 'Searching...' : 'Search for Jobs'}
                  </button>
                </div>
              </div>
            )}
            
            {jobSearchResponse && (
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-3">Job Search Results</h2>
                <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                  <p className="mb-2">
                    <span className="font-medium">Total Jobs Found:</span> {jobSearchResponse.data.totalCount}
                  </p>
                  
                  {jobSearchResponse.data.jobs.length > 0 ? (
                    <div className="space-y-4 mt-4">
                      {jobSearchResponse.data.jobs.slice(0, 5).map(job => (
                        <div key={job.id} className="p-3 bg-white rounded border border-gray-300">
                          <h3 className="font-semibold text-lg">{job.title}</h3>
                          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                            <p><span className="font-medium">Location:</span> {job.cityName}</p>
                            <p><span className="font-medium">Contract:</span> {job.contractType.name}</p>
                            {job.salary && (
                              <p><span className="font-medium">Salary:</span> €{job.salary.minimumValue} - €{job.salary.maximumValue} per {job.salary.unit.toLowerCase()}</p>
                            )}
                            <p><span className="font-medium">Regime:</span> {job.regime.name}</p>
                          </div>
                          <div className="mt-2">
                            <p className="font-medium text-sm">Job Description:</p>
                            <p className="text-sm mt-1 line-clamp-3">{job.jobDescription}</p>
                          </div>
                        </div>
                      ))}
                      
                      {jobSearchResponse.data.jobs.length > 5 && (
                        <p className="text-sm text-gray-600 mt-2">
                          Showing 5 of {jobSearchResponse.data.jobs.length} jobs. Full response available in the console.
                        </p>
                      )}
                    </div>
                  ) : (
                    <p>No jobs found matching the criteria.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 text-sm text-gray-500">
          <p>
            This application uses OpenAI's Whisper API for speech-to-text conversion and
            GPT to extract job function and location from candidate recordings.
          </p>
          <p className="mt-2">
            The extracted information is used to create a job search request for the AccentJobs API.
            The system automatically detects whether your audio is in Dutch or English.
          </p>
          <p className="mt-2">
            Note: You need to provide your own OpenAI API key in the .env.local file for this to work.
          </p>
        </div>
      </div>
    </div>
  );
}
