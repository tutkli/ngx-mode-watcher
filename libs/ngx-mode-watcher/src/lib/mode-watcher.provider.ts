import {
  EnvironmentProviders,
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import {
  MODE_WATCHER_CONFIG,
  ModeWatcherConfig,
  modeWatcherConfig,
} from './mode-watcher.config';
import { ModeWatcherService } from './mode-watcher.service';
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
      setInitialMode(config.defaultMode, config.themeColors);
    }),
  ]);
}
