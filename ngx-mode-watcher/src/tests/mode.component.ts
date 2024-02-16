import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModeWatcherService } from 'ngx-mode-watcher';

@Component({
  selector: 'mw-mode',
  standalone: true,
  template: `
    <span data-testid="mode">{{ modeWatcher.mode() }}</span>
    <button
      type="button"
      (click)="modeWatcher.toggleMode()"
      data-testid="toggle">
      Toggle
    </button>
    <button
      type="button"
      (click)="modeWatcher.setMode('light')"
      data-testid="light">
      Light
    </button>
    <button
      type="button"
      (click)="modeWatcher.setMode('dark')"
      data-testid="dark">
      Dark
    </button>
    <button type="button" (click)="modeWatcher.resetMode()" data-testid="reset">
      Reset
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModeComponent {
  protected readonly modeWatcher = inject(ModeWatcherService);
}
