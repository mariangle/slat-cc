import urlMetadata from "url-metadata";

function isValidURL(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

interface FavIcon {
  rel: string;
  type?: string;
  href: string;
  sizes: string;
}

interface MetadataResponse {
  requestUrl: string;
  url: string;
  title: string;
  image: string;
  favicons: FavIcon[];
  "og:title": string;
  "og:image": string;
  "og:image:type": string;
  "og:image:width": string;
  "og:image:height": string;
  "twitter:image": string;
  "twitter:image:alt": string;
}

function getLargestFavicon(favicons: FavIcon[]) {
  if (favicons.length === 0) return;

  const sortedFavicons = favicons.sort((a, b) => {
    const [aWidth, aHeight] = a.sizes.split("x").map(Number);
    const [bWidth, bHeight] = b.sizes.split("x").map(Number);

    return bWidth * bHeight - aWidth * aHeight;
  });

  return sortedFavicons[0].href;
}

export async function scrapeMetadata(url: string) {
  if (!isValidURL(url)) return;

  try {
    const res = await urlMetadata(url);

    const metadata = res as MetadataResponse;

    const title =
      metadata["og:title"] || metadata["twitter:title"] || metadata.title;
    const image =
      metadata["og:image"] ||
      metadata["twitter:image"] ||
      getLargestFavicon(metadata.favicons) ||
      metadata.image;

    return {
      title: title,
      image: image,
    };
  } catch (e) {
    console.error(e);
  }
}
