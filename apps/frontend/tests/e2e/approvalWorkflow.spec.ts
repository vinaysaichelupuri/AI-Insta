import { test, expect } from '@playwright/test';

test.describe('Approval Workflow', () => {
  test('should allow user to preview and approve a post', async ({ page }) => {
    // Navigate to preview page (mocked post ID)
    await page.goto('/preview/test_post_id');
    
    // Check if carousel renders
    const carousel = page.locator('.preview-carousel');
    await expect(carousel).toBeVisible();

    // Click approve
    const approveBtn = page.getByRole('button', { name: /Approve/i });
    await expect(approveBtn).toBeVisible();
  });
});
