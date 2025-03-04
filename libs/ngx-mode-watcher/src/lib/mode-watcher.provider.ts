import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { MODE_WATCHER_CONFIG, modeWatcherConfig } from './mode-watcher.config';
import { ModeWatcherService } from './mode-watcher.service';
import { ModeWatcherConfig } from './types';
import { setInitialMode } from './utils';

export function provideModeWatcher(
  config: Partial<ModeWatcherConfig> = {}
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MODE_WATCHER_CONFIG,
      useValue: modeWatcherConfig(config),
    },
    provideAppInitializer(() => {
      inject(ModeWatcherService);
      const config = inject(MODE_WATCHER_CONFIG);
      setInitialMode({
        defaultMode: config.defaultMode,
        themeColors: config.themeColors,
        darkClassNames: config.darkClassNames,
        lightClassNames: config.lightClassNames,
        defaultTheme: config.defaultTheme,
        modeStorageKey: config.modeStorageKey,
        themeStorageKey: config.themeStorageKey,
      });
    }),
  ]);
}
