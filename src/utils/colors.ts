export function generateColorPalette(baseColor: string): Record<string, string> {
  // Convert hex to RGB
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Generate shades and tints
  const palette: Record<string, string> = {
    50: adjustColor(r, g, b, 0.9),
    100: adjustColor(r, g, b, 0.8),
    200: adjustColor(r, g, b, 0.6),
    300: adjustColor(r, g, b, 0.4),
    400: adjustColor(r, g, b, 0.2),
    500: baseColor,
    600: adjustColor(r, g, b, -0.2),
    700: adjustColor(r, g, b, -0.4),
    800: adjustColor(r, g, b, -0.6),
    900: adjustColor(r, g, b, -0.8),
  };

  return palette;
}

function adjustColor(r: number, g: number, b: number, amount: number): string {
  const adjust = (value: number): number => {
    if (amount > 0) {
      return Math.round(value + (255 - value) * amount);
    }
    return Math.round(value * (1 + amount));
  };

  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);

  const toHex = (n: number): string => {
    const hex = Math.max(0, Math.min(255, n)).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

export function isValidHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

export function getContrastColor(hexColor: string): string {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}
