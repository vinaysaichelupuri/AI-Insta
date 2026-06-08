import { test, expect } from '@playwright/test';

test.describe('Instagram Publishing', () => {
  test('should trigger publish after approval', async ({ page }) => {
    await page.goto('/preview/test_post_id');
    const approveBtn = page.getByRole('button', { name: /Approve/i });
    await approveBtn.click();
    
    // Check if success message or redirect occurs
    const successMsg = page.getByText(/successfully/i);
    await expect(successMsg).toBeVisible({ timeout: 10000 });
  });
});
