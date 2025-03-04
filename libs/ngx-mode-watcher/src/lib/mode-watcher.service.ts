import { isPlatformBrowser } from '@angular/common'
import {
	computed,
	DestroyRef,
	effect,
	inject,
	Injectable,
	PLATFORM_ID,
	signal,
} from '@angular/core'
import { Meta } from '@angular/platform-browser'
import { MODE_WATCHER_CONFIG } from './mode-watcher.config'
import { Mode, ThemeColors } from './types'
import { isValidMode, noopStorage, sanitizeClassNames } from './utils'

@Injectable({ providedIn: 'root' })
export class ModeWatcherService {
	private readonly config = inject(MODE_WATCHER_CONFIG)
	private readonly platformId = inject(PLATFORM_ID)
	private readonly destroyRef = inject(DestroyRef)
	private readonly meta = inject(Meta)
	private readonly isBrowser = isPlatformBrowser(this.platformId)
	private readonly storage = this.isBrowser ? localStorage : noopStorage

	/** Theme colors for light and dark modes. */
	private readonly _themeColors = signal<ThemeColors>(this.config.themeColors)
	public readonly themeColors = this._themeColors.asReadonly()

	/**
	 * Signal that represents the theme in use, which will be applied to the root `html` element
	 * with the data-theme attribute
	 */
	private readonly _theme = signal(this.initTheme())
	public readonly theme = this._theme.asReadonly()

	/** Signal that represents the user's preferred mode (`"dark"`, `"light"` or `"system"`) */
	private readonly _userPrefersMode = signal<Mode>(this.initUserPrefersMode())
	public readonly userPrefersMode = this._userPrefersMode.asReadonly()

	/** Signal that represents the system's preferred mode (`"dark"`, `"light"` or `undefined`) */
	private readonly _systemPrefersMode = signal<'dark' | 'light' | undefined>(undefined)
	public readonly systemPrefersMode = this._systemPrefersMode.asReadonly()

	/** Signal that represents the current mode (`"dark"`, `"light"` or `undefined`) */
	public readonly mode = computed(() => {
		if (!this.isBrowser) return undefined
		return this._userPrefersMode() === 'system'
			? this._systemPrefersMode()
			: this._userPrefersMode()
	})

	constructor() {
		const themeColors = this._themeColors()
		if (themeColors && this.isBrowser) {
			this.meta.addTag({
				name: 'theme-color',
				content: themeColors.dark,
			})
		}

		let mediaQueryState: MediaQueryList | undefined
		if (this.isBrowser) {
			mediaQueryState = window.matchMedia('(prefers-color-scheme: light)')
			mediaQueryState.addEventListener('change', this.mediaQueryChangeHandler)
			this._systemPrefersMode.set(mediaQueryState.matches ? 'light' : 'dark')

			addEventListener('storage', this.modeStorageHandler)
			addEventListener('storage', this.themeStorageHandler)
		}

		effect(() => {
			this.storage.setItem(this.config.modeStorageKey, this._userPrefersMode())
		})

		effect(() => {
			const theme = this.theme()
			if (theme !== null && theme !== undefined) {
				this.storage.setItem(this.config.themeStorageKey, theme)
			}
		})

		effect(() => {
			const htmlEl = document.documentElement
			const themeColorEl = document.querySelector('meta[name="theme-color"]')
			const themeColors = this._themeColors()

			const mode = this.mode()
			const sanitizedDarkClassNames = sanitizeClassNames(this.config.darkClassNames)
			const sanitizedLightClassNames = sanitizeClassNames(this.config.lightClassNames)

			if (mode === 'light') {
				if (sanitizedDarkClassNames.length) htmlEl.classList.remove(...sanitizedDarkClassNames)
				if (sanitizedLightClassNames.length) htmlEl.classList.add(...sanitizedLightClassNames)
				htmlEl.style.colorScheme = 'light'

				if (themeColorEl && themeColors) {
					themeColorEl.setAttribute('content', themeColors.light)
				}
			} else {
				if (sanitizedLightClassNames.length) htmlEl.classList.remove(...sanitizedLightClassNames)
				if (sanitizedDarkClassNames.length) htmlEl.classList.add(...sanitizedDarkClassNames)
				htmlEl.style.colorScheme = 'dark'
				if (themeColorEl && themeColors) {
					themeColorEl.setAttribute('content', themeColors.dark)
				}
			}
		})

		effect(() => {
			const htmlEl = document.documentElement
			const theme = this.theme()
			if (theme) htmlEl.setAttribute('data-theme', theme)
		})

		this.destroyRef.onDestroy(() => {
			if (mediaQueryState)
				mediaQueryState.removeEventListener('change', this.mediaQueryChangeHandler)
			removeEventListener('storage', this.modeStorageHandler)
			removeEventListener('storage', this.themeStorageHandler)
		})
	}

	/** Toggle between light and dark mode */
	public toggleMode() {
		this._userPrefersMode.set(this.mode() === 'dark' ? 'light' : 'dark')
	}

	/** Set the mode to light or dark */
	public setMode(mode: Mode) {
		this._userPrefersMode.set(mode)
	}

	/** Reset the mode to operating system preference */
	public resetMode() {
		this._userPrefersMode.set(this.config.defaultMode)
	}

	/** Set the theme to a custom value */
	public setTheme(theme: string) {
		this._theme.set(theme)
	}

	private initUserPrefersMode() {
		const initialValue = this.storage.getItem(this.config.modeStorageKey)
		return isValidMode(initialValue) ? initialValue : this.config.defaultMode
	}

	private initTheme() {
		const initialValue = this.storage.getItem(this.config.themeStorageKey)
		return initialValue ?? this.config.defaultTheme
	}

	private modeStorageHandler = (e: StorageEvent) => {
		if (e.key !== this.config.modeStorageKey) return
		const newValue = e.newValue
		if (isValidMode(newValue)) {
			this._userPrefersMode.set(newValue)
		} else {
			this._userPrefersMode.set(this.config.defaultMode)
		}
	}

	private themeStorageHandler = (e: StorageEvent) => {
		if (e.key !== this.config.themeStorageKey) return
		const newValue = e.newValue
		if (newValue) {
			this._theme.set(newValue)
		} else {
			this._theme.set('')
		}
	}

	private mediaQueryChangeHandler = (e: MediaQueryListEvent) => {
		if (!this.config.track) return
		this._systemPrefersMode.set(e.matches ? 'light' : 'dark')
	}
}
