import { axe, toHaveNoViolations } from 'jest-axe';
import { renderWithProviders } from './componentTester';
expect.extend(toHaveNoViolations);
export async function testAccessibility(ui, options) {
    const { container } = renderWithProviders(ui, options);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
}
//# sourceMappingURL=a11y.js.map