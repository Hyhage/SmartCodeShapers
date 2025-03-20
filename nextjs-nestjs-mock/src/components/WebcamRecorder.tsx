"use client";

import {
  Job,
  extractAudioFromVideo,
  getJobMatchesFromAudio,
  sendAudioToServer,
} from "@/services/audioService";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import RecordRTC from "recordrtc";
import JobMatchList from "./JobMatchList";

const WebcamRecorder: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [recordingTime, setRecordingTime] = useState<number>(0);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [processingAudio, setProcessingAudio] = useState<boolean>(false);
  const [audioSent, setAudioSent] = useState<boolean>(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [jobMatches, setJobMatches] = useState<Job[]>([]);
  const [loadingJobMatches, setLoadingJobMatches] = useState<boolean>(false);
  const [showJobMatches, setShowJobMatches] = useState<boolean>(false);

  // Handle recording timer
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setRecordingTime(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [recording]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const startCountdown = useCallback(() => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownInterval);
          startRecording();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const startRecording = useCallback(() => {
    if (webcamRef.current && webcamRef.current.video) {
      const stream = webcamRef.current.video.srcObject as MediaStream;
      const recorder = new RecordRTC(stream, {
        type: "video",
        mimeType: "video/webm",
        frameRate: 30,
        disableLogs: true,
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setRecording(true);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current?.getBlob();
        if (blob) {
          const videoURL = URL.createObjectURL(blob);
          setRecordedVideo(videoURL);
          setRecordedBlob(blob);
        }
        recorderRef.current = null;
        setRecording(false);
      });
    }
  }, []);

  const downloadVideo = useCallback(() => {
    if (recordedVideo) {
      const a = document.createElement("a");
      a.href = recordedVideo;
      a.download = `accent-video-application-${new Date().toISOString()}.webm`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [recordedVideo]);

  const handleUserMedia = useCallback(() => {
    setCameraReady(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 p-8">
      {!recordedVideo ? (
        <div className="w-full">
          <div className="relative w-full max-w-3xl mx-auto overflow-hidden rounded-2xl">
            <Webcam
              audio={true}
              ref={webcamRef}
              width={1280}
              height={720}
              videoConstraints={{
                width: 1280,
                height: 720,
                facingMode: "user",
              }}
              onUserMedia={handleUserMedia}
              className="w-full rounded-2xl shadow-lg"
            />

            {/* Overlay elements */}
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
                <div className="w-24 h-24 rounded-full bg-white bg-opacity-70 backdrop-blur-md flex items-center justify-center">
                  <span className="text-5xl font-bold text-black">
                    {countdown}
                  </span>
                </div>
              </div>
            )}

            {recording && (
              <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
                <div className="flex items-center gap-2 bg-black bg-opacity-50 backdrop-blur-md px-4 py-2 rounded-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-white font-medium">
                    {formatTime(recordingTime)}
                  </span>
                </div>
                <button
                  onClick={stopRecording}
                  className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition font-medium flex items-center gap-2 backdrop-blur-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Stop
                </button>
              </div>
            )}
          </div>

          {!recording && cameraReady && (
            <div className="flex justify-center mt-8">
              <button
                onClick={startCountdown}
                className="accent-btn px-8 py-4 text-lg flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Start Recording
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm opacity-70 max-w-lg mx-auto">
              Position yourself in the center of the frame and ensure you have
              good lighting. Your video will be stored locally on your device.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto">
          <div className="glass-effect p-8 rounded-2xl">
            <h3 className="text-2xl font-bold mb-6 gradient-text inline-block">
              Your Video Application
            </h3>

            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <video
                src={recordedVideo}
                controls
                width={1280}
                height={720}
                className="w-full rounded-xl"
              />
              <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={async () => {
                  if (!recordedBlob) return;

                  try {
                    setProcessingAudio(true);
                    setAudioError(null);
                    setShowJobMatches(false);

                    // Extract audio from video
                    const audioBlob = await extractAudioFromVideo(recordedBlob);

                    // Send audio to mock server
                    const result = await sendAudioToServer(audioBlob, {
                      fileName: `audio_${new Date().toISOString()}.mp3`,
                      format: "mp3",
                      size: audioBlob.size,
                    });

                    setAudioSent(true);
                    console.log("Audio sent successfully:", result);

                    // Create download link for the audio
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(audioBlob);
                    a.download = `accent-audio-${new Date().toISOString()}.mp3`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);

                    // Start loading job matches
                    setLoadingJobMatches(true);
                    setShowJobMatches(true);

                    // Get job matches based on audio analysis
                    const matches = await getJobMatchesFromAudio();
                    setJobMatches(matches);
                    setLoadingJobMatches(false);
                  } catch (error) {
                    console.error("Error processing audio:", error);
                    setAudioError(
                      error instanceof Error ? error.message : "Unknown error"
                    );
                    setLoadingJobMatches(false);
                  } finally {
                    setProcessingAudio(false);
                  }
                }}
                className="accent-btn px-6 py-3 flex items-center gap-2"
                disabled={processingAudio || loadingJobMatches}
              >
                {processingAudio ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing Audio...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Extract & Find Jobs
                  </>
                )}
              </button>
              <button
                onClick={downloadVideo}
                className="glass-effect px-6 py-3 flex items-center gap-2 hover:bg-opacity-80 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Download Video
              </button>
              <button
                onClick={() => {
                  setRecordedVideo(null);
                  setRecordedBlob(null);
                  setAudioSent(false);
                  setAudioError(null);
                }}
                className="glass-effect px-6 py-3 flex items-center gap-2 hover:bg-opacity-80 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clipRule="evenodd"
                  />
                </svg>
                Record Again
              </button>
            </div>

            {audioSent && !showJobMatches && (
              <div className="mt-4 p-3 bg-green-500 bg-opacity-20 rounded-lg text-green-700 text-sm">
                Audio successfully extracted and sent to server. Check console
                for details.
              </div>
            )}

            {audioError && (
              <div className="mt-4 p-3 bg-red-500 bg-opacity-20 rounded-lg text-red-700 text-sm">
                Error: {audioError}
              </div>
            )}

            {showJobMatches && (
              <div className="mt-8 border-t border-gray-200 border-opacity-20 pt-8">
                <JobMatchList jobs={jobMatches} isLoading={loadingJobMatches} />
              </div>
            )}

            <div className="mt-6 flex flex-col md:flex-row gap-6 justify-center">
              <div className="glass-effect p-4 rounded-xl flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-accent-tertiary bg-opacity-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: "var(--accent-tertiary)" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Save Locally</h4>
                  <p className="text-xs opacity-70">Download to your device</p>
                </div>
              </div>

              <div className="glass-effect p-4 rounded-xl flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-accent-primary bg-opacity-20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium">Private & Secure</h4>
                  <p className="text-xs opacity-70">
                    Stored only on your device
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WebcamRecorder;
