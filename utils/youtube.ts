// YouTube API utility functions
console.log(process.env,'process.env');
const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY || ''; // You'll need to add this to your environment variables
const YOUTUBE_API_KEY_DEV = process.env.YOUTUBE_API_KEY_DEV || ''; // You'll need to add this to your environment variables
console.log(YOUTUBE_API_KEY , 'YOUTUBE_API_KEY');
console.log(YOUTUBE_API_KEY_DEV , 'YOUTUBE_API_KEY_DEV');
interface YouTubeVideoDetails {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
}

/**
 * Extract YouTube video ID from URL
 */
export function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Fetch video details from YouTube API
 */
export async function getYouTubeVideoDetails(videoUrl: string): Promise<YouTubeVideoDetails | null> {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId || !YOUTUBE_API_KEY) {
    console.error('Invalid video ID or missing API key');
    return null;
  }
  
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet`
    );
    
    const data = await response.json();
    
    if (!data.items || data.items.length === 0) {
      console.error('No video details found');
      return null;
    }
    
    const videoDetails = data.items[0].snippet;
    
    return {
      id: videoId,
      title: videoDetails.title,
      description: videoDetails.description,
      thumbnail: videoDetails.thumbnails.maxres?.url || videoDetails.thumbnails.maxres?.url ,
      channelTitle: videoDetails.channelTitle,
      publishedAt: videoDetails.publishedAt
    };
  } catch (error) {
    console.error('Error fetching YouTube video details:', error);
    return null;
  }
}

/**
 * Fetch multiple YouTube video details at once
 */
export async function getMultipleYouTubeVideoDetails(videoUrls: string[]): Promise<(YouTubeVideoDetails | null)[]> {
  const promises = videoUrls.map(url => getYouTubeVideoDetails(url));
  return Promise.all(promises);
}

/**
 * Get best available thumbnail for a YouTube video
 */
export function getYouTubeThumbnail(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'maxres'): string {
  const qualities = {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  };
  
  return qualities[quality];
} 