import { SimplifiedAudioVisualizer } from "@/components/audio-visualizer";

export default function Home() {
  return (
    <div className="min-h-screen grid place-content-center">
      <SimplifiedAudioVisualizer
        audioSrc="/audio.mp3"
        shadowColor="#00FF00"
        shadowOpacity={0.5}
      />
    </div>
  );
}
