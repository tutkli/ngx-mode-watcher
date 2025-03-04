/** The key used to store the mode in localStorage. */
export const MODE_WATCHER_MODE_KEY = 'ngx-mode-watcher-mode';
export const MODE_WATCHER_THEME_KEY = 'ngx-mode-watcher-theme';

/** The modes that are supported */
export const modes = ['dark', 'light', 'system'] as const;
export type Mode = (typeof modes)[number];

export type ThemeColors = { dark: string; light: string } | undefined;

export type ModeWatcherConfig = {
  /**
   * Whether to automatically track operating system preferences
   * and update the mode accordingly.
   *
   * @defaultValue `true`
   */
  track: boolean;

  /**
   * The default mode to use instead of the user's preference.
   *
   * @defaultValue `"system"`
   */
  defaultMode: Mode;

  /**
   * The default theme to use, which will be applied to the root `html` element
   * and can be managed with the `setTheme` function.
   *
   * @example
   * ```html
   * <html data-theme="your-custom-theme"></html>
   * ```
   *
   * @defaultValue `undefined`
   */
  defaultTheme: string | undefined;

  /**
   * Theme colors for light and dark modes.
   *
   * @defaultValue `undefined`
   */
  themeColors: ThemeColors;

  /**
   * The classname to add to the root `html` element when the mode is dark.
   *
   * @defaultValue `["dark"]`
   */
  darkClassNames: string[];

  /**
   * The classname to add to the root `html` element when the mode is light.
   *
   * @defaultValue `[]`
   */
  lightClassNames: string[];

  /**
   * the local storage key to use for storing the mode.
   *
   * @defaultValue `'ngx-mode-watcher-mode'`
   */
  modeStorageKey: string;

  /**
   * The local storage key to use for storing the theme.
   *
   * @defaultValue `'ngx-mode-watcher-theme'`
   */
  themeStorageKey: string;
};

export type SetInitialModeArgs = {
  defaultMode?: Mode;
  themeColors?: ThemeColors;
  darkClassNames?: string[];
  lightClassNames?: string[];
  defaultTheme?: string;
  modeStorageKey?: string;
  themeStorageKey?: string;
};
