import {
  APP_INITIALIZER,
  EnvironmentProviders,
  makeEnvironmentProviders,
} from '@angular/core';
import {
  MODE_WATCHER_CONFIG,
  ModeWatcherConfig,
  modeWatcherConfig,
} from './mode-watcher.config';
import { ModeWatcherService } from './mode-watcher.service';
import { setInitialMode } from './utils';

function initializeModeWatcher(
  _modeWatcherService: ModeWatcherService,
  config: ModeWatcherConfig
) {
  return () =>
    new Promise<void>(resolve => {
      setInitialMode(config.defaultMode, config.themeColors);
      resolve();
    });
}

export function provideModeWatcher(
  config: Partial<ModeWatcherConfig> = {}
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: MODE_WATCHER_CONFIG,
      useValue: modeWatcherConfig(config),
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeModeWatcher,
      multi: true,
      deps: [ModeWatcherService, MODE_WATCHER_CONFIG],
    },
  ]);
}
