import { isPlatformBrowser } from '@angular/common';
import {
  computed,
  DestroyRef,
  effect,
  inject,
  Injectable,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { MODE_WATCHER_CONFIG } from './mode-watcher.config';
import { localStorageKey, Mode, ThemeColors } from './types';
import { isValidMode, noopStorage } from './utils';

@Injectable({ providedIn: 'root' })
export class ModeWatcherService {
  private readonly config = inject(MODE_WATCHER_CONFIG);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  private readonly meta = inject(Meta);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly storage = this.isBrowser ? localStorage : noopStorage;

  /** Theme colors for light and dark modes. */
  private _themeColors = signal<ThemeColors>(this.config.themeColors);
  public themeColors = this._themeColors.asReadonly();

  /** Signal that represents the user's preferred mode (`"dark"`, `"light"` or `"system"`) */
  private _userPrefersMode = signal<Mode>(this.initUserPrefersMode());
  public userPrefersMode = this._userPrefersMode.asReadonly();

  /** Signal that represents the system's preferred mode (`"dark"`, `"light"` or `undefined`) */
  private _systemPrefersMode = signal<'dark' | 'light' | undefined>(undefined);
  public systemPrefersMode = this._systemPrefersMode.asReadonly();

  /** Signal that represents the current mode (`"dark"`, `"light"` or `undefined`) */
  public mode = computed(() => {
    if (!this.isBrowser) return undefined;
    return this._userPrefersMode() === 'system'
      ? this._systemPrefersMode()
      : this._userPrefersMode();
  });

  constructor() {
    if (this._themeColors()) {
      this.meta.addTag({
        name: 'theme-color',
        content: this._themeColors()!.dark,
      });
    }

    let mediaQueryState: MediaQueryList | undefined;
    if (this.isBrowser) {
      mediaQueryState = window.matchMedia('(prefers-color-scheme: light)');
      mediaQueryState.addEventListener('change', this.mediaQueryChangeHandler);
      this._systemPrefersMode.set(mediaQueryState.matches ? 'light' : 'dark');

      addEventListener('storage', this.storageHandler);
    }

    effect(() => {
      const htmlEl = document.documentElement;
      const themeColorEl = document.querySelector('meta[name="theme-color"]');
      const themeColors = this._themeColors();

      if (this.mode() === 'light') {
        htmlEl.classList.remove('dark');
        htmlEl.style.colorScheme = 'light';

        if (themeColorEl && themeColors) {
          themeColorEl.setAttribute('content', themeColors.light);
        }
      } else {
        htmlEl.classList.add('dark');
        htmlEl.style.colorScheme = 'dark';
        if (themeColorEl && themeColors) {
          themeColorEl.setAttribute('content', themeColors.dark);
        }
      }
    });

    this.destroyRef.onDestroy(() => {
      if (mediaQueryState)
        mediaQueryState.removeEventListener(
          'change',
          this.mediaQueryChangeHandler
        );
      removeEventListener('storage', this.storageHandler);
    });
  }

  /** Toggle between light and dark mode */
  public toggleMode() {
    this._userPrefersMode.set(this.mode() === 'dark' ? 'light' : 'dark');
  }

  /** Set the mode to light or dark */
  public setMode(mode: Mode) {
    this._userPrefersMode.set(mode);
  }

  /** Reset the mode to operating system preference */
  public resetMode() {
    this._userPrefersMode.set(this.config.defaultMode);
  }

  private initUserPrefersMode() {
    const initialValue = this.storage.getItem(localStorageKey);
    return isValidMode(initialValue) ? initialValue : this.config.defaultMode;
  }

  private storageHandler = (e: StorageEvent) => {
    if (e.key !== localStorageKey) return;
    const newValue = e.newValue;
    if (isValidMode(newValue)) {
      this._userPrefersMode.set(newValue);
    } else {
      this._userPrefersMode.set(this.config.defaultMode);
    }
  };

  private mediaQueryChangeHandler = (e: MediaQueryListEvent) => {
    if (!this.config.track) return;
    this._systemPrefersMode.set(e.matches ? 'light' : 'dark');
  };
}
