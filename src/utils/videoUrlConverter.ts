export interface VideoUrlInfo {
  embedUrl: string;
  platform: 'youtube' | 'vimeo' | 'dailymotion' | 'unknown' | 'error';
}

/**
 * Converts video URLs from multiple platforms to their embed format
 * Supports YouTube, Vimeo, Dailymotion, and can be extended for more platforms
 * @param url - The original video URL
 * @returns Object containing the embed URL and platform information
 */
export const convertToEmbedUrl = (url: string): VideoUrlInfo => {
  try {
    const originalUrl = url.toLowerCase();
    
    // YouTube URL conversion
    if (originalUrl.includes('youtube.com') || originalUrl.includes('youtu.be')) {
      let videoId = '';
      
      // Handle youtube.com/watch?v=ID format
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (youtubeMatch) {
        videoId = youtubeMatch[1];
      }
      
      // Handle youtube.com/embed/ID format (already embed)
      const embedMatch = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) {
        return { embedUrl: url, platform: 'youtube' };
      }
      
      if (videoId) {
        return { 
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
          platform: 'youtube'
        };
      }
    }
    
    // Vimeo URL conversion
    if (originalUrl.includes('vimeo.com')) {
      const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
      
      if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        const hash = vimeoMatch[2];
        
        let embedUrl = `https://player.vimeo.com/video/${videoId}`;
        if (hash) {
          embedUrl += `?h=${hash}`;
        }
        
        return { embedUrl, platform: 'vimeo' };
      }
      
      // If it's already a Vimeo embed URL, return as is
      if (url.includes('player.vimeo.com')) {
        return { embedUrl: url, platform: 'vimeo' };
      }
    }
    
    // Dailymotion URL conversion
    if (originalUrl.includes('dailymotion.com')) {
      const dailymotionMatch = url.match(/dailymotion\.com\/video\/([a-zA-Z0-9]+)/);
      if (dailymotionMatch) {
        const videoId = dailymotionMatch[1];
        return {
          embedUrl: `https://www.dailymotion.com/embed/video/${videoId}`,
          platform: 'dailymotion'
        };
      }
    }
    
    // Generic embed detection (if URL already contains embed indicators)
    if (originalUrl.includes('embed') || originalUrl.includes('player')) {
      return { embedUrl: url, platform: 'unknown' };
    }
    
    // Return original URL if we can't identify the platform
    console.warn('Unknown video platform for URL:', url);
    return { embedUrl: url, platform: 'unknown' };
    
  } catch (error) {
    console.error('Error converting video URL:', error);
    return { embedUrl: url, platform: 'error' };
  }
};

/**
 * Get iframe permissions based on video platform
 * @param platform - The video platform
 * @returns String of iframe allow permissions
 */
export const getIframePermissions = (platform: VideoUrlInfo['platform']): string => {
  const basePermissions = "autoplay; fullscreen; picture-in-picture";
  
  switch (platform) {
    case 'youtube':
      return `${basePermissions}; accelerometer; gyroscope; encrypted-media`;
    case 'vimeo':
      return basePermissions;
    case 'dailymotion':
      return `${basePermissions}; accelerometer; gyroscope`;
    default:
      return basePermissions;
  }
}; 