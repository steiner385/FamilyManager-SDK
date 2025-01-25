import { axe, toHaveNoViolations } from 'jest-axe'
import { renderWithProviders } from './componentTester'

expect.extend(toHaveNoViolations)

export async function testAccessibility(
  ui: React.ReactElement,
  options?: Parameters<typeof renderWithProviders>[1]
) {
  const { container } = renderWithProviders(ui, options)
  const results = await axe(container)
  
  expect(results).toHaveNoViolations()
}
