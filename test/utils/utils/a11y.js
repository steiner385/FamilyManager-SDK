import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
export async function checkA11y(container) {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
}
//# sourceMappingURL=a11y.js.map