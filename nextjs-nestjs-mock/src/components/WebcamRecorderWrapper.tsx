"use client";

import dynamic from "next/dynamic";

// Import WebcamRecorder with dynamic import to avoid SSR issues
const WebcamRecorder = dynamic(() => import("./WebcamRecorder"), {
  ssr: false,
});

export default function WebcamRecorderWrapper() {
  return <WebcamRecorder />;
}
