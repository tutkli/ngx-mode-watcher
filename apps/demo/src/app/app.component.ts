import { isPlatformBrowser } from '@angular/common';
import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { ModeWatcherService } from 'ngx-mode-watcher';

@Component({
  selector: 'ngx-mode-watcher-root',
  standalone: true,
  template: `
    <div class="container py-12 space-y-4 p-4">
      <p>User prefers mode: {{ modeWatcher.userPrefersMode() }}</p>
      <p>System prefers mode: {{ modeWatcher.systemPrefersMode() }}</p>
      <p>Current mode: {{ modeWatcher.mode() }}</p>

      @if (htmlElement() !== undefined) {
      <pre>{{ htmlElement() }}</pre>
      } @if (themeColorElement() !== undefined) {
      <pre>{{ themeColorElement() }}</pre>
      }

      <div class="flex space-x-2">
        <button (click)="modeWatcher.toggleMode()">Toggle</button>
        <button (click)="modeWatcher.setMode('light')">Light Mode</button>
        <button (click)="modeWatcher.setMode('dark')">Dark Mode</button>
        <button (click)="modeWatcher.resetMode()">Reset</button>
      </div>
    </div>
  `,
  styles: `
    button {
      @apply bg-blue-500 transition-colors text-white px-2 py-1 rounded-md duration-500;
    }
  `,
})
export class AppComponent {
  private readonly platformId = inject(PLATFORM_ID);
  protected readonly modeWatcher = inject(ModeWatcherService);

  htmlElement = computed(() => {
    this.modeWatcher.mode();
    if (isPlatformBrowser(this.platformId)) {
      const htmlElement = document.documentElement;
      if (htmlElement) {
        return htmlElement.outerHTML.replace(
          htmlElement.innerHTML + '</html>',
          ''
        );
      }
    }
    return undefined;
  });

  themeColorElement = computed(() => {
    this.modeWatcher.mode();
    if (isPlatformBrowser(this.platformId)) {
      const themeColorElement = document.querySelector(
        'meta[name="theme-color"]'
      );
      if (themeColorElement) {
        return themeColorElement.outerHTML;
      }
    }
    return undefined;
  });
}
