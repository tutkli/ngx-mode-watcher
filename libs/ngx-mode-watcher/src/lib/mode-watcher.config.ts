import { InjectionToken } from '@angular/core';
import {
  MODE_WATCHER_MODE_KEY,
  MODE_WATCHER_THEME_KEY,
  ModeWatcherConfig,
} from './types';

export const defaultConfig: ModeWatcherConfig = {
  track: true,
  defaultMode: 'system',
  defaultTheme: undefined,
  themeColors: undefined,
  darkClassNames: ['dark'],
  lightClassNames: [],
  modeStorageKey: MODE_WATCHER_MODE_KEY,
  themeStorageKey: MODE_WATCHER_THEME_KEY,
};

export const MODE_WATCHER_CONFIG = new InjectionToken<ModeWatcherConfig>(
  'MODE_WATCHER_CONFIG',
  {
    providedIn: 'root',
    factory: () => defaultConfig,
  }
);

export function modeWatcherConfig(
  config: Partial<ModeWatcherConfig>
): ModeWatcherConfig {
  return {
    ...defaultConfig,
    ...config,
  };
}
