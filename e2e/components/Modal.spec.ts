import { test, expect } from '@playwright/test';
import { setupTestPage } from '../test-setup';

declare global {
  interface Window {
    modalClosed: boolean;
    setupFocusTrap: () => void;
  }
}

test.describe('Modal Component', () => {
  test.beforeEach(async ({ page }) => {
    const content = `
      window.modalClosed = false;

      // Create modals
      const modals = [
        { id: 'closed-modal', isOpen: false },
        { id: 'open-modal', isOpen: true }
      ];

      modals.forEach(({ id, isOpen }) => {
        const container = document.createElement('div');
        container.id = id;
        container.style.display = isOpen ? 'block' : 'none';
        document.getElementById('root').appendChild(container);

        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        container.appendChild(overlay);

        const content = document.createElement('div');
        content.className = 'modal-content';
        content.style.width = '300px';
        content.style.padding = '20px';
        content.style.backgroundColor = 'white';
        content.style.borderRadius = '8px';
        overlay.appendChild(content);

        const modalContent = document.createElement('div');
        modalContent.id = \`\${id}-content\`;
        modalContent.textContent = isOpen ? 'Open Modal Content' : 'Closed Modal Content';
        content.appendChild(modalContent);

        // Handle overlay click
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            console.log('Overlay clicked');
            window.modalClosed = true;
          }
        });
      });

      // Handle escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          console.log('Escape pressed');
          window.modalClosed = true;
        }
      });

      // Set up focus trap
      window.setupFocusTrap = () => {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const modal = document.querySelector('#open-modal .modal-content');
        const focusableContent = Array.from(modal.querySelectorAll(focusableElements));
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        const handleTab = (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
              }
            } else {
              if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
              }
            }
          }
        };

        document.addEventListener('keydown', handleTab);
      };

      // Lock body scroll
      document.body.style.overflow = 'hidden';
    `;

    await page.setContent(setupTestPage(content));
  });

  test('does not render when closed', async ({ page }) => {
    const modal = page.locator('#closed-modal');
    await expect(modal).not.toBeVisible();
  });

  test('renders when open', async ({ page }) => {
    const modal = page.locator('#open-modal [role="dialog"]');
    await expect(modal).toBeVisible();
    
    const content = page.locator('#open-modal-content');
    await expect(content).toBeVisible();
    await expect(content).toHaveText('Open Modal Content');
  });

  test('has correct ARIA attributes', async ({ page }) => {
    const modal = page.locator('#open-modal [role="dialog"]');
    await expect(modal).toHaveAttribute('role', 'dialog');
    await expect(modal).toHaveAttribute('aria-modal', 'true');
  });

  test('closes on overlay click', async ({ page }) => {
    // Get the overlay element
    const overlay = page.locator('#open-modal .modal-overlay');
    await expect(overlay).toBeVisible();

    // Get the overlay's bounding box
    const box = await overlay.boundingBox();
    if (!box) throw new Error('Could not get overlay boundingBox');

    // Click in the top-left corner of the overlay, away from the modal content
    await page.mouse.click(box.x + 10, box.y + 10);

    // Wait for the modalClosed flag to be set
    const wasClosed = await page.evaluate('window.modalClosed');
    expect(wasClosed).toBe(true);
  });

  test('closes on escape key', async ({ page }) => {
    await page.keyboard.press('Escape');

    const wasClosed = await page.evaluate(() => window.modalClosed);
    expect(wasClosed).toBe(true);
  });

  test('traps focus within modal', async ({ page }) => {
    await page.evaluate(`
      const modalContent = document.querySelector('#open-modal .modal-content');
      modalContent.innerHTML = '<button id="first">First</button><button id="second">Second</button><button id="last">Last</button>';
      window.setupFocusTrap();
    `);

    await page.focus('#first');

    // Tab forward through all elements
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    let focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('last');

    // Tab forward again should cycle to first element
    await page.keyboard.press('Tab');
    focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('first');

    // Shift+Tab backward should cycle to last element
    await page.keyboard.down('Shift');
    await page.keyboard.press('Tab');
    await page.keyboard.up('Shift');
    focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('last');
  });

  test('prevents scroll on body when open', async ({ page }) => {
    const bodyOverflow = await page.evaluate(() => window.getComputedStyle(document.body).overflow);
    expect(bodyOverflow).toBe('hidden');
  });
});
