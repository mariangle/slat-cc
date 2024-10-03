# Simplified Audio Visualizer

A simplified React component used in **slat.cc** that visualizes audio playback with a customizable shadow effect. It leverages the Web Audio API to analyze audio data and create a visual representation based on the audio's frequency data.

## Getting Started

To get a local copy up and running, follow these steps.

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/mariangle/slat-cc-implementations.git
   ```

2. Go to the project folder

   ```sh
   cd audio-visualizer
   ```

3. Install packages

   ```sh
   npm i
   ```

4. Start the development server
   ```sh
   npm run dev
   ```

### Audio Source

This component uses a local audio.mp3 file located in the public folder. You can easily replace the audio source with a URL. However, if the server hosting the audio file does not allow cross-origin requests, you may encounter CORS errors.

To handle this in the real usage scenario on slat.cc, an audio proxy is utilized. You can refer to the audio-forward-proxy-api example.

Once you set up the proxy, you can replace the audio source line in the component as follows:

```tsx
<audio
  ref={audioRef}
  src={`/api/audio-proxy?url=${encodeURIComponent(audioSrc)}`}
  crossOrigin="anonymous"
/>
```
