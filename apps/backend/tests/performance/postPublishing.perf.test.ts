import request from 'supertest';
import express from 'express';
import postRoutes from '../../src/routes/postRoutes';
import { exportService } from '../../src/services/exportService';
import mongoose from 'mongoose';
import { Post } from '../../src/models/Post';

const app = express();
app.use(express.json());
app.use('/api/posts', postRoutes);

describe('Performance Tests: Post Publishing', () => {
  beforeAll(async () => {
    // connect to a test database if necessary
  });

  afterAll(async () => {
    // disconnect
  });

  it('HTML to PNG export should take less than 10s', async () => {
    const dummyHtmlSlides = Array(7).fill('<html><body style="background: white;"><h1>Perf Test Slide</h1></body></html>');
    
    const startTime = Date.now();
    await exportService.exportHtmlToImages('perf_test_id', dummyHtmlSlides);
    const endTime = Date.now();
    
    const durationMs = endTime - startTime;
    console.log(`Export took ${durationMs}ms`);
    expect(durationMs).toBeLessThan(10000);
  }, 15000);

  it('History retrieval should take less than 2s', async () => {
    // Populate DB with some dummy posts if possible
    
    const startTime = Date.now();
    const res = await request(app).get('/api/posts');
    const endTime = Date.now();
    
    const durationMs = endTime - startTime;
    console.log(`History retrieval took ${durationMs}ms`);
    expect(res.status).toBe(200);
    expect(durationMs).toBeLessThan(2000);
  });
});
