"use client";

import { useRef, useEffect, useState } from "react";

/**
 * Converts a hex color code to an RGB object.
 * @param hex - The hex color code, which can be in the format #RRGGBB or #RGB.
 * @returns An object containing the RGB values (r, g, b).
 */
export const hexToRgb = (hex: string) => {
  // Remove the hash at the start if it's there
  hex = hex.replace(/^#/, "");

  let r: number, g: number, b: number;

  if (hex.length === 3) {
    // If the hex code is in the format #RGB, expand it to #RRGGBB
    r = parseInt(hex.charAt(0) + hex.charAt(0), 16);
    g = parseInt(hex.charAt(1) + hex.charAt(1), 16);
    b = parseInt(hex.charAt(2) + hex.charAt(2), 16);
  } else if (hex.length === 6) {
    // If the hex code is in the format #RRGGBB
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else {
    throw new Error("Invalid hex color format");
  }

  return { r, g, b };
};

interface Props {
  audioSrc: string; // Source of the audio
  shadowColor: string; // Shadow color for visualizer
  shadowOpacity: number; // Shadow opacity
}

export const SimplifiedAudioVisualizer = ({
  audioSrc,
  shadowColor,
  shadowOpacity,
}: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { r, g, b } = hexToRgb(shadowColor);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch((e) => console.error("Error playing media:", e));
        // Resume audio context if suspended
        if (audioContextRef.current?.state === "suspended") {
          audioContextRef.current.resume();
        }
      }
      setIsPlaying((prev) => !prev);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.crossOrigin = "anonymous";

      // Create AudioContext and AnalyserNode only once
      if (!audioContextRef.current) {
        const context = new (window.AudioContext || window.AudioContext)();
        audioContextRef.current = context;

        const analyser = context.createAnalyser();
        analyserRef.current = analyser;

        // Create MediaElementSourceNode
        const src = context.createMediaElementSource(audio);
        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.fftSize = 2048;
        analyser.smoothingTimeConstant = 0.75;

        // Start rendering frames
        const renderFrame = () => {
          const blurredDiv = document.querySelector(
            ".audio-visualizer-shadow"
          ) as HTMLElement | null;
          if (analyser && blurredDiv) {
            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);
            analyser.getByteFrequencyData(dataArray);

            // Calculate overall volume and shadow intensity
            const totalVolume =
              dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
            const shadowIntensity = (totalVolume / 255) * 400 * 0.6; // Adjusted intensity calculation

            // Adjust shadow styling
            const spread = shadowIntensity * 0.35;
            const blurRadius = Math.max(0, shadowIntensity * 0.5);
            blurredDiv.style.boxShadow = `0px 0px ${blurRadius}px ${spread}px rgba(${r}, ${g}, ${b}, ${shadowOpacity})`;

            requestAnimationFrame(renderFrame);
          }
        };

        renderFrame();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioRef]);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={togglePlay}
        className="bg-black text-white px-2 py-1.5 rounded-full"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <audio ref={audioRef} src={audioSrc} crossOrigin="anonymous" />
      <div className="audio-visualizer-shadow shadow-sm bg-green-500 h-52 w-40 rounded-lg"></div>
    </div>
  );
};
