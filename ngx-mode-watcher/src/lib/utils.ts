import { Mode, modes, ThemeColors } from './types';

export const noopStorage = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: (_key: string) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem: (_key: string, _value: string) => {},
};

/** Used to set the mode on initial page load to prevent FOUC */
export function setInitialMode(defaultMode: Mode, themeColors?: ThemeColors) {
  const rootEl = document.documentElement;
  const mode = localStorage.getItem('mode-watcher-mode') ?? defaultMode;
  const light =
    mode === 'light' ||
    (mode === 'system' &&
      window.matchMedia('(prefers-color-scheme: light)').matches);

  rootEl.classList[light ? 'remove' : 'add']('dark');
  rootEl.style.colorScheme = light ? 'light' : 'dark';

  if (themeColors) {
    const themeMetaEl = document.querySelector('meta[name="theme-color"]');
    if (themeMetaEl) {
      themeMetaEl.setAttribute(
        'content',
        mode === 'light' ? themeColors.light : themeColors.dark,
      );
    }
  }

  localStorage.setItem('mode-watcher-mode', mode);
}

export function isValidMode(value: unknown): value is Mode {
  if (typeof value !== 'string') return false;
  return modes.includes(value as Mode);
}
