import { test, expect } from '@playwright/test';
import { setupTestPage } from '../test-setup';

test.describe('LoadingSkeleton Component', () => {
  test.beforeEach(async ({ page }) => {
    const content = `
      const skeletons = [
        { id: 'default-skeleton', variant: 'default' },
        { id: 'text-skeleton', variant: 'text' },
        { id: 'circle-skeleton', variant: 'circle' },
        { id: 'custom-skeleton', width: '200px', height: '100px' }
      ];

      skeletons.forEach(({ id, variant, width, height }) => {
        const container = document.createElement('div');
        container.id = id;
        container.style.display = 'block';
        document.getElementById('root').appendChild(container);
        
        const skeleton = document.createElement('div');
        skeleton.className = \`animate-pulse bg-gray-200 \${
          variant === 'circle' ? 'rounded-full' : 
          variant === 'text' ? 'rounded' : 
          'rounded-md'
        }\`;
        skeleton.style.display = 'block';
        
        // Set default dimensions if not specified
        if (width && height) {
          skeleton.style.width = width;
          skeleton.style.height = height;
        } else if (variant === 'circle') {
          skeleton.style.width = '40px';
          skeleton.style.height = '40px';
        } else {
          skeleton.style.width = '100%';
          skeleton.style.height = '20px';
        }

        skeleton.setAttribute('role', 'status');
        skeleton.setAttribute('aria-label', 'Loading...');
        container.appendChild(skeleton);
      });
    `;

    await page.setContent(setupTestPage(content));
  });

  test('renders default skeleton', async ({ page }) => {
    const skeleton = page.locator('#default-skeleton [role="status"]');
    await expect(skeleton).toBeVisible();
    
    const hasAnimateClass = await skeleton.evaluate((el) => el.classList.contains('animate-pulse'));
    expect(hasAnimateClass).toBe(true);
    
    const hasRoundedClass = await skeleton.evaluate((el) => el.classList.contains('rounded-md'));
    expect(hasRoundedClass).toBe(true);
  });

  test('renders text variant', async ({ page }) => {
    const skeleton = page.locator('#text-skeleton [role="status"]');
    await expect(skeleton).toBeVisible();
    
    const hasRoundedClass = await skeleton.evaluate((el) => el.classList.contains('rounded'));
    expect(hasRoundedClass).toBe(true);
  });

  test('renders circle variant', async ({ page }) => {
    const skeleton = page.locator('#circle-skeleton [role="status"]');
    await expect(skeleton).toBeVisible();
    
    const hasRoundedFullClass = await skeleton.evaluate((el) => el.classList.contains('rounded-full'));
    expect(hasRoundedFullClass).toBe(true);
    
    const box = await skeleton.boundingBox();
    expect(box?.width).toBe(40);
    expect(box?.height).toBe(40);
  });

  test('renders with custom dimensions', async ({ page }) => {
    const skeleton = page.locator('#custom-skeleton [role="status"]');
    await expect(skeleton).toBeVisible();
    
    const box = await skeleton.boundingBox();
    expect(box?.width).toBe(200);
    expect(box?.height).toBe(100);
  });

  test('has correct ARIA attributes', async ({ page }) => {
    const skeleton = page.locator('#default-skeleton [role="status"]');
    await expect(skeleton).toHaveAttribute('role', 'status');
    await expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
  });
});
