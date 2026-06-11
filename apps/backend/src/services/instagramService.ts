import axios from 'axios';

export class InstagramService {
  private readonly baseUrl = `https://graph.instagram.com/${process.env.META_GRAPH_VERSION || 'v19.0'}`;

  constructor(
    private readonly accessToken: string,
    private readonly accountId: string
  ) {}

  /**
   * Publish a carousel post to Instagram
   * @param imageUrls Array of publicly accessible image URLs
   * @param caption The post caption
   */
  async publishCarousel(imageUrls: string[], caption: string): Promise<string> {
    try {
      if (!this.accessToken || !this.accountId) {
        throw new Error('Instagram credentials not configured');
      }

      // 1. Create media containers for each image
      const containerIds: string[] = [];
      for (const url of imageUrls) {
        const createMediaUrl = `${this.baseUrl}/${this.accountId}/media`;
        const mediaRes = await axios.post(createMediaUrl, {
          image_url: url,
          is_carousel_item: true,
          access_token: this.accessToken,
        });
        containerIds.push(mediaRes.data.id);
      }

      // 2. Create the carousel container
      const createCarouselUrl = `${this.baseUrl}/${this.accountId}/media`;
      const carouselRes = await axios.post(createCarouselUrl, {
        media_type: 'CAROUSEL',
        children: containerIds,
        caption: caption,
        access_token: this.accessToken,
      });
      const carouselContainerId = carouselRes.data.id;

      // 3. Publish the carousel container
      const publishUrl = `${this.baseUrl}/${this.accountId}/media_publish`;
      const publishRes = await axios.post(publishUrl, {
        creation_id: carouselContainerId,
        access_token: this.accessToken,
      });

      return publishRes.data.id;
    } catch (error) {
      console.error('Error publishing to Instagram:', error);
      throw new Error('Failed to publish to Instagram');
    }
  }
}
