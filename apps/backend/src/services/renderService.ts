import puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import Handlebars from 'handlebars';
import { ISlide } from '../models/Post';

// Register Handlebars helper for equality
Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

export const exportSlidesToPng = async (slides: ISlide[], postId: string): Promise<string[]> => {
  console.log(`[RenderService] Rendering ${slides.length} slides for post ${postId}`);
  
  const templatePath = path.join(__dirname, '../templates/base.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(templateSource);

  // Ensure output directory exists
  const outDir = path.join(__dirname, '../../assets/generated', postId);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 1 });

  const generatedPaths: string[] = [];

  for (const slide of slides) {
    const html = template({
      title: slide.title,
      content: slide.content,
      templateType: slide.templateType,
      slideNumber: slide.slideNumber
    });

    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const imagePath = path.join(outDir, `slide_${slide.slideNumber}.png`);
    await page.screenshot({ path: imagePath, type: 'png' });
    generatedPaths.push(imagePath);
    
    console.log(`[RenderService] Exported ${imagePath}`);
  }

  await browser.close();
  return generatedPaths;
};
