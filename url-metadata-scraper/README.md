# URL Metadata Scraper
This module provides a simple utility to validate URLs and scrape metadata, such as titles and images, from web pages. It utilizes the url-metadata library to fetch Open Graph (OG) and Twitter metadata, along with favicon information, to provide a structured response for given URLs.

## Features

- **URL Validation**: Verifies if a string is a properly formatted URL using the `URL` constructor.
- **Metadata Scraping**: Extracts metadata (title and image) from a URL, prioritizing OG and Twitter tags, and falling back to the largest favicon.
- **Favicon Handling**: Finds and selects the largest favicon available if no other image metadata is found.

## Installation

Install the required dependency:

```bash
npm install url-metadata
```

### Example Usage

```
import { scrapeMetadata } from './your-file';

const url = 'https://example.com';
scrapeMetadata(url).then((data) => {
  console.log(data); // { title: 'Example Title', image: 'https://example.com/image.jpg' }
});
```
