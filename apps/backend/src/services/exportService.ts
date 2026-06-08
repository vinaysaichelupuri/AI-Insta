import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs/promises';

export class ExportService {
  private outputDir: string;

  constructor() {
    this.outputDir = path.join(process.cwd(), 'assets', 'exports');
    this.init();
  }

  private async init() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
    } catch (error) {
      console.error('Failed to create export directory:', error);
    }
  }

  /**
   * Export HTML strings to image files using Puppeteer
   * @param postId The ID of the post
   * @param htmlSlides Array of HTML strings for each slide
   * @returns Array of file paths where the images were saved
   */
  async exportHtmlToImages(postId: string, htmlSlides: string[]): Promise<string[]> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1080, height: 1350 });
      
      const exportedPaths: string[] = [];

      for (let i = 0; i < htmlSlides.length; i++) {
        const html = htmlSlides[i];
        const filename = `${postId}_slide_${i + 1}.png`;
        const filePath = path.join(this.outputDir, filename);

        await page.setContent(html, { waitUntil: 'networkidle0' });
        await page.screenshot({ path: filePath, type: 'png' });
        
        exportedPaths.push(filePath);
      }

      return exportedPaths;
    } catch (error) {
      console.error('Error exporting images:', error);
      throw new Error('Failed to export images');
    } finally {
      await browser.close();
    }
  }
}

export const exportService = new ExportService();
