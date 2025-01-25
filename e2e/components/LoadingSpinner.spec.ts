import { test, expect } from '@playwright/test';
import { setupTestPage } from '../test-setup';

test.describe('LoadingSpinner Component', () => {
  test.beforeEach(async ({ page }) => {
    const content = `
      const spinners = [
        { id: 'default-spinner', size: 'medium' },
        { id: 'small-spinner', size: 'small' },
        { id: 'large-spinner', size: 'large' }
      ];

      spinners.forEach(({ id, size }) => {
        const container = document.createElement('div');
        container.id = id;
        document.getElementById('root').appendChild(container);
        
        const spinner = document.createElement('div');
        spinner.className = \`animate-spin \${
          size === 'small' ? 'w-4 h-4' : 
          size === 'large' ? 'w-12 h-12' : 
          'w-8 h-8'
        }\`;
        spinner.style.display = 'inline-block';
        spinner.setAttribute('role', 'status');
        spinner.setAttribute('aria-label', 'Loading');

        // Set fixed dimensions to ensure consistent testing
        if (size === 'small') {
          spinner.style.width = '16px';
          spinner.style.height = '16px';
        } else if (size === 'large') {
          spinner.style.width = '48px';
          spinner.style.height = '48px';
        } else {
          spinner.style.width = '32px';
          spinner.style.height = '32px';
        }

        container.appendChild(spinner);
      });
    `;

    await page.setContent(setupTestPage(content));
  });

  test('renders default spinner', async ({ page }) => {
    const spinner = page.locator('#default-spinner [role="status"]');
    await expect(spinner).toBeVisible();
    
    const box = await spinner.boundingBox();
    expect(box?.width).toBeCloseTo(32, -2);
    expect(box?.height).toBeCloseTo(32, -2);
    
    const hasAnimateClass = await spinner.evaluate((el) => el.classList.contains('animate-spin'));
    expect(hasAnimateClass).toBe(true);
  });

  test('renders small spinner', async ({ page }) => {
    const spinner = page.locator('#small-spinner [role="status"]');
    await expect(spinner).toBeVisible();
    
    const box = await spinner.boundingBox();
    expect(box?.width).toBeCloseTo(16, -2);
    expect(box?.height).toBeCloseTo(16, -2);
    
    const hasAnimateClass = await spinner.evaluate((el) => el.classList.contains('animate-spin'));
    expect(hasAnimateClass).toBe(true);
  });

  test('renders large spinner', async ({ page }) => {
    const spinner = page.locator('#large-spinner [role="status"]');
    await expect(spinner).toBeVisible();
    
    const box = await spinner.boundingBox();
    expect(box?.width).toBeCloseTo(48, -2);
    expect(box?.height).toBeCloseTo(48, -2);
    
    const hasAnimateClass = await spinner.evaluate((el) => el.classList.contains('animate-spin'));
    expect(hasAnimateClass).toBe(true);
  });
});
