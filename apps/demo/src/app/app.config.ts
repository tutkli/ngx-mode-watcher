import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideModeWatcher } from 'ngx-mode-watcher';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideModeWatcher({
      themeColors: { dark: '#000', light: '#fff' },
    }),
  ],
};
