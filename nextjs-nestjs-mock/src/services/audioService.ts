"use client";

// Job interface based on the provided structure
export interface Job {
  id: string;
  title: string;
  contentLanguage: string;
  cityName: string;
  lastModified: string;
  isSaved: boolean;
  functionDomainsLevel1: {
    id: number;
    name: string;
  }[];
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
}

// Mock job data
const mockJobs: Job[] = [
  {
    id: "b153afbb-9ce4-44a4-9bc6-612fdc3638b8",
    title: "Metser",
    contentLanguage: "nl",
    cityName: "Oostnieuwkerke",
    lastModified: "2024-11-16T10:00:00Z",
    isSaved: false,
    functionDomainsLevel1: [
      {
        id: 2,
        name: "Bouw",
      },
    ],
    reference: "378142",
    salary: {
      unit: "HOUR",
      minimumValue: 17.15,
      maximumValue: 25,
    },
    contractType: {
      id: 1,
      name: "Kans op vast",
    },
    jobDescription:
      "Wil jij deel uitmaken van een steengoed team en wil je jouw metseltalenten laten zien? Dan is deze vacature iets voor jou! Wij zoeken een metser die van aanpakken weet en graag zijn/haar handen vuil maakt. Als metser ben je verantwoordelijk voor het bouwen van de mooiste en meest solide muren in Oostnieuwkerke en omstreken. Jij hebt een oog voor detail en werkt altijd nauwkeurig, want je weet dat één scheve steen de hele muur kan verpesten. Maar wees gerust, we zoeken niet naar een grijze muis die alleen maar stenen op elkaar kan stapelen. Onze ideale kandidaat is creatief en denkt buiten de baksteen. Heb je ooit gedroomd van het bouwen van een geheime doorgang of een eigenzinnige tuinmuur met een ingebouwde barbecue? Dan is dit je kans om je fantasie de vrije loop te laten! We bieden je niet alleen een uitdagende en afwisselende baan, maar ook een gezellig team dat net zo dol is op moppen vertellen als op stenen stapelen. Je werkt niet alleen met je handen, maar ook met je hart. Dus ben jij een Metser met een gezonde dosis humor en ben je niet bang om je handen vuil te maken? Solliciteer dan nu en wie weet bouwen we samen de mooiste muren in Oostnieuwkerke en omstreken! ",
    regime: {
      id: 1,
      name: "Voltijds",
      halfTimeMinWorkingHours: null,
      halfTimeMaxWorkingHours: null,
    },
  },
  {
    id: "c254bfcc-0df5-55b5-0cd7-723gdc4749c9",
    title: "Software Developer",
    contentLanguage: "nl",
    cityName: "Gent",
    lastModified: "2024-11-15T14:30:00Z",
    isSaved: false,
    functionDomainsLevel1: [
      {
        id: 5,
        name: "IT",
      },
    ],
    reference: "378143",
    salary: {
      unit: "MONTH",
      minimumValue: 3200,
      maximumValue: 4500,
    },
    contractType: {
      id: 2,
      name: "Vast",
    },
    jobDescription:
      "Als Software Developer ben je verantwoordelijk voor het ontwikkelen en onderhouden van onze web applicaties. Je werkt in een agile team en bent betrokken bij het hele ontwikkelproces, van concept tot implementatie.",
    regime: {
      id: 1,
      name: "Voltijds",
      halfTimeMinWorkingHours: null,
      halfTimeMaxWorkingHours: null,
    },
  },
  {
    id: "d365cgdd-1eg6-66c6-1de8-834hec5850d0",
    title: "Marketing Specialist",
    contentLanguage: "en",
    cityName: "Brussel",
    lastModified: "2024-11-14T09:15:00Z",
    isSaved: true,
    functionDomainsLevel1: [
      {
        id: 8,
        name: "Marketing",
      },
    ],
    reference: "378144",
    salary: {
      unit: "MONTH",
      minimumValue: 2800,
      maximumValue: 3600,
    },
    contractType: {
      id: 3,
      name: "Tijdelijk",
    },
    jobDescription:
      "We are looking for a Marketing Specialist to join our international team in Brussels. You will be responsible for developing and implementing marketing strategies to promote our products and services.",
    regime: {
      id: 2,
      name: "Deeltijds",
      halfTimeMinWorkingHours: 24,
      halfTimeMaxWorkingHours: 32,
    },
  },
  {
    id: "e476dhee-2fh7-77d7-2ef9-945ifd6961e1",
    title: "Verpleegkundige",
    contentLanguage: "nl",
    cityName: "Antwerpen",
    lastModified: "2024-11-13T16:45:00Z",
    isSaved: false,
    functionDomainsLevel1: [
      {
        id: 12,
        name: "Gezondheidszorg",
      },
    ],
    reference: "378145",
    contractType: {
      id: 2,
      name: "Vast",
    },
    jobDescription:
      "Als verpleegkundige ben je verantwoordelijk voor de verzorging van patiënten in ons ziekenhuis. Je werkt in een multidisciplinair team en biedt hoogwaardige zorg aan patiënten met diverse medische behoeften.",
    regime: {
      id: 3,
      name: "Ploegensysteem",
      halfTimeMinWorkingHours: null,
      halfTimeMaxWorkingHours: null,
    },
  },
  {
    id: "f587eiff-3gi8-88e8-3fg0-056jge7072f2",
    title: "Administratief Medewerker",
    contentLanguage: "nl",
    cityName: "Leuven",
    lastModified: "2024-11-12T11:20:00Z",
    isSaved: false,
    functionDomainsLevel1: [
      {
        id: 15,
        name: "Administratie",
      },
    ],
    reference: "378146",
    salary: {
      unit: "MONTH",
      minimumValue: 2400,
      maximumValue: 2800,
    },
    contractType: {
      id: 2,
      name: "Vast",
    },
    jobDescription:
      "Als Administratief Medewerker ben je verantwoordelijk voor diverse administratieve taken binnen ons kantoor. Je zorgt voor een efficiënte afhandeling van de dagelijkse administratie en ondersteunt het team waar nodig.",
    regime: {
      id: 1,
      name: "Voltijds",
      halfTimeMinWorkingHours: null,
      halfTimeMaxWorkingHours: null,
    },
  },
];

/**
 * Function to send audio data to the transcription server
 * @param audioBlob - The audio blob to send
 * @param metadata - Optional metadata about the audio
 * @returns Promise that resolves with response from the server or rejects with an error
 */
export const sendAudioToServer = async (
  audioBlob: Blob,
  metadata: {
    fileName?: string;
    duration?: number;
    format?: string;
    size?: number;
  } = {}
): Promise<{ success: boolean; message: string; id?: string }> => {
  try {
    // Create a FormData object to send the audio file
    const formData = new FormData();
    formData.append("audio", audioBlob, metadata.fileName || "audio.mp3");

    // Add metadata as additional form fields if needed
    if (metadata.duration)
      formData.append("duration", metadata.duration.toString());
    if (metadata.format) formData.append("format", metadata.format);
    if (metadata.size) formData.append("size", metadata.size.toString());

    console.log("Sending audio to transcription server:", {
      blobSize: `${(audioBlob.size / 1024).toFixed(2)} KB`,
      blobType: audioBlob.type,
      metadata,
    });

    // Send the audio to the real API endpoint
    const response = await fetch(
      "https://e693-194-78-234-130.ngrok-free.app/transcribe",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(
        `Server error: ${response.status} ${response.statusText}`
      );
    }

    const result = await response.json();
    return {
      success: true,
      message: "Audio successfully processed and stored",
      id: result.id || `audio_${Date.now()}`,
    };
  } catch (error) {
    console.error("Error sending audio to server:", error);
    throw error;
  }
};

/**
 * Mock function to get job matches based on audio analysis
 * @returns Promise that resolves with an array of job matches (already sorted with best matches first)
 */
export const getJobMatchesFromAudio = async (): Promise<Job[]> => {
  // Simulate processing time (3-5 seconds)
  const processingTime = 3000 + Math.random() * 2000;
  await new Promise((resolve) => setTimeout(resolve, processingTime));

  // Return a copy of the mock jobs (already sorted with best matches first)
  return [...mockJobs];
};

/**
 * Extracts audio from a video blob and converts it to MP3 format
 * @param videoBlob - The video blob containing audio
 * @returns Promise that resolves with an MP3 audio blob
 */
export const extractAudioFromVideo = async (videoBlob: Blob): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    // Create audio context
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    const audioContext = new AudioContextClass();

    // Create media element source
    const audioElement = new Audio();
    audioElement.src = URL.createObjectURL(videoBlob);

    // Create media recorder to capture the audio
    const audioDestination = audioContext.createMediaStreamDestination();
    const audioSource = audioContext.createMediaElementSource(audioElement);
    audioSource.connect(audioDestination);
    audioSource.connect(audioContext.destination);

    const mediaRecorder = new MediaRecorder(audioDestination.stream);
    const audioChunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
      resolve(audioBlob);
    };

    // Start recording and playing
    mediaRecorder.start();
    audioElement.play();

    // Stop when audio ends
    audioElement.onended = () => {
      mediaRecorder.stop();
      audioElement.src = "";
    };

    // Handle errors
    audioElement.onerror = (error) => {
      reject(new Error(`Error processing audio: ${error}`));
    };
  });
};
