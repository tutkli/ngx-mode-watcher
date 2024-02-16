/** The key used to store the mode in localStorage. */
export const localStorageKey = 'ngx-mode-watcher-mode';

/** The modes that are supported */
export const modes = ['dark', 'light', 'system'] as const;
export type Mode = (typeof modes)[number];

export type ThemeColors = { dark: string; light: string } | undefined;
