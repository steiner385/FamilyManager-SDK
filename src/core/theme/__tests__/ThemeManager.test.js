import { ThemeManager } from '../ThemeManager';
describe('ThemeManager', () => {
    let manager;
    beforeEach(() => {
        // Reset singleton instance
        // @ts-ignore - accessing private property for testing
        ThemeManager.instance = null;
        manager = ThemeManager.getInstance();
    });
    it('maintains singleton instance', () => {
        const instance1 = ThemeManager.getInstance();
        const instance2 = ThemeManager.getInstance();
        expect(instance1).toBe(instance2);
    });
    it('sets and gets theme correctly', () => {
        const theme = {
            colors: {
                primary: '#000000',
                secondary: '#ffffff'
            },
            typography: {
                fontFamily: 'Arial'
            }
        };
        manager.setTheme(theme);
        expect(manager.getCurrentTheme()).toEqual(theme);
    });
    it('extends theme correctly', () => {
        const baseTheme = {
            colors: {
                primary: '#000000',
                secondary: '#ffffff'
            }
        };
        const extension = {
            colors: {
                primary: '#ff0000'
            }
        };
        manager.setTheme(baseTheme);
        manager.extendTheme(extension);
        const theme = manager.getCurrentTheme();
        expect(theme.colors.primary).toBe('#ff0000');
        expect(theme.colors.secondary).toBe('#ffffff');
    });
    it('throws error for invalid theme', () => {
        expect(() => manager.setTheme(null)).toThrow();
    });
});
//# sourceMappingURL=ThemeManager.test.js.map