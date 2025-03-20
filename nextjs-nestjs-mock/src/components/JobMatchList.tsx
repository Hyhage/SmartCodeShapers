"use client";

import { Job } from "@/services/audioService";
import React, { useEffect, useRef, useState } from "react";
import ReactConfetti from "react-confetti";

interface JobMatchListProps {
  jobs: Job[];
  isLoading?: boolean;
}

const JobMatchList: React.FC<JobMatchListProps> = ({
  jobs,
  isLoading = false,
}) => {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [confettiDimensions, setConfettiDimensions] = useState({
    width: 0,
    height: 0,
  });
  const firstJobRef = useRef<HTMLDivElement>(null);

  // Show confetti when jobs are loaded
  useEffect(() => {
    if (!isLoading && jobs.length > 0) {
      setShowConfetti(true);

      // Get the dimensions of the first job card for confetti
      if (firstJobRef.current) {
        const { width, height } = firstJobRef.current.getBoundingClientRect();
        setConfettiDimensions({ width, height });
      }

      // Hide confetti after 5 seconds
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, jobs]);
  if (isLoading) {
    return (
      <div className="w-full py-12 flex flex-col items-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="w-4 h-4 rounded-full bg-accent-primary animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-accent-primary animate-pulse delay-150"></div>
          <div className="w-4 h-4 rounded-full bg-accent-primary animate-pulse delay-300"></div>
        </div>
        <p className="text-lg font-medium">
          Analyzing your audio and finding matching jobs...
        </p>
        <p className="text-sm opacity-70 mt-2">This may take a few moments</p>
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="w-full py-8 text-center">
        <p className="text-lg">No job matches found.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6 gradient-text inline-block">
        Your Job Matches
      </h3>
      <div className="space-y-6">
        {jobs.map((job, index) => (
          <div
            key={job.id}
            ref={index === 0 ? firstJobRef : null}
            className="glass-effect p-6 rounded-xl relative overflow-hidden cursor-pointer"
            onClick={() => {
              // Open job details in a new tab
              window.open(`https://accentjobs.be/nl/${job.id}`, "_blank");
            }}
          >
            {/* Confetti for the first job */}
            {index === 0 && showConfetti && (
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: -1 }}
              >
                <ReactConfetti
                  width={confettiDimensions.width}
                  height={confettiDimensions.height}
                  recycle={false}
                  numberOfPieces={200}
                  gravity={0.15}
                  colors={[
                    "#FF5722",
                    "#FF9E80",
                    "#0EA5E9",
                    "#38BDF8",
                    "#4CAF50",
                  ]}
                />
              </div>
            )}
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-semibold">{job.title}</h4>
                  {job.isSaved && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-accent-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-sm">
                  <span>{job.cityName}</span>
                  <span>•</span>
                  <span>{job.reference}</span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {job.functionDomainsLevel1.map((domain) => (
                    <span
                      key={domain.id}
                      className="px-2 py-1 text-xs rounded-full bg-accent-primary bg-opacity-10 text-accent-primary"
                    >
                      {domain.name}
                    </span>
                  ))}
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                    {job.regime.name}
                  </span>
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
                    {job.contractType.name}
                  </span>
                </div>

                <p className="mt-4 text-sm line-clamp-3">
                  {job.jobDescription}
                </p>
              </div>

              <div className="flex flex-col gap-3 min-w-[140px]">
                {job.salary && (
                  <div className="text-center p-3 rounded-lg bg-accent-light">
                    <p className="text-sm font-medium">Salary</p>
                    <p className="font-semibold">
                      {formatSalary(
                        job.salary.minimumValue,
                        job.salary.maximumValue,
                        job.salary.unit
                      )}
                    </p>
                  </div>
                )}

                <button
                  className="accent-btn w-full py-2"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    window.open(`https://accentjobs.be/nl/${job.id}`, "_blank");
                  }}
                >
                  Apply Now
                </button>

                <button
                  className="glass-effect w-full py-2 text-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the parent onClick
                    window.open(`https://accentjobs.be/nl/${job.id}`, "_blank");
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function to format salary
const formatSalary = (min: number, max: number, unit: string): string => {
  const formatValue = (val: number) =>
    val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val.toString();

  const unitDisplay = unit === "HOUR" ? "per hour" : "per month";

  if (min === max) {
    return `€${formatValue(min)} ${unitDisplay}`;
  }

  return `€${formatValue(min)} - €${formatValue(max)} ${unitDisplay}`;
};

export default JobMatchList;
