# Audio Fetcher Proxy API

The **Audio Fetcher Proxy API** is designed to serve as a forward proxy for fetching audio files from external URLs. This API allows clients to bypass CORS restrictions and directly retrieve audio content.

## Features

- **Forward Proxy**: Fetches audio files from any external URL, enabling seamless access without CORS issues.
- **Dynamic Content-Type**: Returns the correct content type of the fetched audio.
- **Error Handling**: Provides clear error messages for missing parameters and failed fetch requests.
- **CORS Support**: Automatically sets `Access-Control-Allow-Origin` to allow cross-origin requests.

## Installation

1. **Create a Next.js Project**:

   ```bash
   npx create-next-app@latest your-project-name
   cd your-project-name
   ```

2. **Add the API Route**: Copy paste the file at `app/api/audio-proxy/route.ts`.

## Usage

Send a GET request to the API with the url parameter:

```bash
GET /api/audio-proxy?url=https://example.com/path/to/audio.mp3
```
