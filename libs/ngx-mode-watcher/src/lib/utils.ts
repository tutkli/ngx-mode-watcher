import {
  Mode,
  MODE_WATCHER_MODE_KEY,
  MODE_WATCHER_THEME_KEY,
  modes,
  SetInitialModeArgs,
} from './types';

export const noopStorage = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem: (_key: string) => null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setItem: (_key: string, _value: string) => {},
};

/**
 * Sanitizes an array of classnames by removing any empty strings.
 */
export function sanitizeClassNames(classNames: string[]): string[] {
  return classNames.filter(className => className.length > 0);
}

/** Used to set the mode in the initial page load to prevent FOUC */
export function setInitialMode({
  defaultMode = 'system',
  themeColors,
  darkClassNames = ['dark'],
  lightClassNames = [],
  defaultTheme = '',
  modeStorageKey = MODE_WATCHER_MODE_KEY,
  themeStorageKey = MODE_WATCHER_THEME_KEY,
}: SetInitialModeArgs) {
  const rootEl = document.documentElement;
  const mode = localStorage.getItem(modeStorageKey) ?? defaultMode;
  const theme = localStorage.getItem(themeStorageKey) ?? defaultTheme;
  const light =
    mode === 'light' ||
    (mode === 'system' &&
      window.matchMedia('(prefers-color-scheme: light)').matches);

  if (light) {
    if (darkClassNames.length) rootEl.classList.remove(...darkClassNames);
    if (lightClassNames.length) rootEl.classList.add(...lightClassNames);
  } else {
    if (lightClassNames.length) rootEl.classList.remove(...lightClassNames);
    if (darkClassNames.length) rootEl.classList.add(...darkClassNames);
  }
  rootEl.style.colorScheme = light ? 'light' : 'dark';

  if (themeColors) {
    const themeMetaEl = document.querySelector('meta[name="theme-color"]');
    if (themeMetaEl) {
      themeMetaEl.setAttribute(
        'content',
        mode === 'light' ? themeColors.light : themeColors.dark
      );
    }
  }

  if (theme) {
    rootEl.setAttribute('data-theme', theme);
    localStorage.setItem(themeStorageKey, theme);
  }

  localStorage.setItem(modeStorageKey, mode);
}

export function isValidMode(value: unknown): value is Mode {
  if (typeof value !== 'string') return false;
  return modes.includes(value as Mode);
}
