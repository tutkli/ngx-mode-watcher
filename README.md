# Mode Watcher

Simple utilities to manage light & dark mode in your Angular app.

## Installation

Make sure you are using Angular 16 or greater.

```bash
npm install ngx-mode-watcher
```

## Usage

Add `provideModeWatcher()` to your app config `app.config.ts` file.

```ts
import {provideModeWatcher} from "ngx-mode-watcher";

export const appConfig: ApplicationConfig = {
    providers: [
        // ...
        provideModeWatcher()
    ]
};
```

The provider will automatically detect the user's preferences and apply/remove the `"dark"` class, along with the corresponding `color-scheme` style attribute to the `html` element.

`ModeWatcher` will automatically track operating system preferences and apply these if no user preference is set. If you wish to disable this behavior, set the `track` config to `false`:

```ts
provideModeWatcher({
    track: false
})
```

`ModeWatcher` can also be configured with a default mode instead of automatically detecting the user's preference.

To set a default mode, use the `defaultMode` config:

```ts
provideModeWatcher({
    defaultMode: 'dark'
})
```

`ModeWatcher` can manage the `theme-color` meta tag for you.

To enable this, set the `themeColor` config to your preferred colors:

```ts
provideModeWatcher({
    themeColor: { dark: "black", light: "white" }
})
```

## ModeWatcherService

To manage the mode of your application, you can inject the `ModeWatcherService`.

```ts
import {ModeWatcherService} from "./mode-watcher.service";

@Component({
//...
})
export class MyComp {
    private readonly modeWatcher = inject(ModeWatcherService);
}
```

### API

#### toggleMode

A function that toggles the current mode.

```angular2html
modeWatcher = inject(ModeWatcherService);

<button (click)="modeWatcher.toggleMode()">Toggle Mode</button>
```

#### setMode

A function that sets the current mode. It accepts a string with the value `"light"`, `"dark"` or `"system"`.

```angular2html
modeWatcher = inject(ModeWatcherService);

<button (click)="modeWatcher.setMode('light')">Set Light Mode</button>
<button (click)="modeWatcher.setMode('dark')">Set Dark Mode</button>
```

#### resetMode

A function that resets the mode to system preferences.

```angular2html
modeWatcher = inject(ModeWatcherService);

<button (click)="modeWatcher.resetMode()">System</button>
```

#### mode

A signal that contains the current mode. It can be `"light"` or `"dark"` or `undefined` if evaluated on the server.

```angular2html
modeWatcher = inject(ModeWatcherService);
handleModeChange() {
    if (modeWatcher.mode() === 'light') {
        modeWatcher.setMode('dark');
    } else {
        modeWatcher.setMode('light');
    }
}

<button (click)="handleModeChange()">{{ modeWatcher.mode() }}</button>
```

#### userPrefersMode

A signal that represents the user's mode preference. It can be `"light"`, `"dark"` or `"system"`.

#### systemPrefersMode

A signal that represents the operating system's mode preference. It can be `"light"`, `"dark"` or `undefined` if evaluated on the server. Will automatically track changes to the operating system's mode preference unless this is disabled with the `track` config which takes a boolean.

## Inspiration & credits

This project is an Angular port of [svecosystem's mode-watcher](https://github.com/svecosystem/mode-watcher).
