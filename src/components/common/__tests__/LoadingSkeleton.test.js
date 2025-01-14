import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '../../../testing/simple-test-utils';
import { LoadingSkeleton } from '../LoadingSkeleton';
describe('LoadingSkeleton', () => {
    it('renders with default props', () => {
        render(_jsx(LoadingSkeleton, {}));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toBeInTheDocument();
        expect(skeleton).toHaveClass('w-full', 'h-4', 'rounded');
        expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
    });
    it('applies different variants correctly', () => {
        const { rerender } = render(_jsx(LoadingSkeleton, { variant: "text" }));
        expect(screen.getByRole('status')).not.toHaveClass('rounded-full');
        rerender(_jsx(LoadingSkeleton, { variant: "circle" }));
        expect(screen.getByRole('status')).toHaveClass('rounded-full');
        rerender(_jsx(LoadingSkeleton, { variant: "rectangle" }));
        expect(screen.getByRole('status')).toHaveClass('rounded');
    });
    it('applies custom width and height', () => {
        render(_jsx(LoadingSkeleton, { width: "w-32", height: "h-8" }));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toHaveClass('w-32', 'h-8');
    });
    it('renders multiple skeletons with correct spacing', () => {
        render(_jsx(LoadingSkeleton, { count: 3 }));
        const skeletons = screen.getAllByRole('status');
        expect(skeletons).toHaveLength(3);
        expect(skeletons[0]).toHaveClass('mb-4');
        expect(skeletons[1]).toHaveClass('mb-4');
        expect(skeletons[2]).not.toHaveClass('mb-4');
    });
    it('applies custom className', () => {
        render(_jsx(LoadingSkeleton, { className: "bg-blue-200" }));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toHaveClass('bg-blue-200');
    });
    it('maintains base classes with custom className', () => {
        render(_jsx(LoadingSkeleton, { className: "bg-blue-200" }));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toHaveClass('animate-pulse', 'bg-gray-200', 'bg-blue-200');
    });
    it('has proper accessibility attributes', () => {
        render(_jsx(LoadingSkeleton, {}));
        const skeleton = screen.getByRole('status');
        expect(skeleton).toHaveAttribute('role', 'status');
        expect(skeleton).toHaveAttribute('aria-label', 'Loading...');
        const screenReaderText = screen.getByText('Loading...');
        expect(screenReaderText).toHaveClass('sr-only');
    });
});
//# sourceMappingURL=LoadingSkeleton.test.js.map