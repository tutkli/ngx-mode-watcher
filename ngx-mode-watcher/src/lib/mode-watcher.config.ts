import { Mode, ThemeColors } from './types';
import { InjectionToken } from '@angular/core';

export type ModeWatcherConfig = {
  track: boolean;
  defaultMode: Mode;
  themeColors: ThemeColors;
};

export const MODE_WATCHER_CONFIG = new InjectionToken<ModeWatcherConfig>(
  'MODE_WATCHER_CONFIG',
  {
    providedIn: 'root',
    factory: () => defaultConfig,
  },
);

export const defaultConfig: ModeWatcherConfig = {
  track: true,
  defaultMode: 'system',
  themeColors: undefined,
};

export function modeWatcherConfig(
  config: Partial<ModeWatcherConfig>,
): ModeWatcherConfig {
  return {
    ...defaultConfig,
    ...config,
  };
}
