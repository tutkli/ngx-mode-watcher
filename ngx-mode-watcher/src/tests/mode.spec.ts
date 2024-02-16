import { render } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import {
  MODE_WATCHER_CONFIG,
  ModeWatcherConfig,
  modeWatcherConfig,
} from 'ngx-mode-watcher';
import { mediaQueryState } from '../test-setup';
import { ModeComponent } from './mode.component';

describe('NgxModeWatcher', () => {
  it('should render mode correctly', async () => {
    await renderModeComponent();
    const rootEl = document.documentElement;
    const classes = getClasses(rootEl);
    expect(classes).toContain('dark');
  });

  it('should toggle the mode', async () => {
    const { getByTestId } = await renderModeComponent({
      themeColors: { dark: 'black', light: 'white' },
    });
    const rootEl = document.documentElement;

    const classes = getClasses(rootEl);
    const colorScheme = getColorScheme(rootEl);
    const themeColor = getThemeColor(rootEl);
    expect(classes).toContain('dark');
    expect(colorScheme).toBe('dark');
    expect(themeColor).toBe('black');

    const toggle = getByTestId('toggle');
    await userEvent.click(toggle);
    const classes2 = getClasses(rootEl);
    const colorScheme2 = getColorScheme(rootEl);
    const themeColor2 = getThemeColor(rootEl);
    expect(classes2).not.toContain('dark');
    expect(colorScheme2).toBe('light');
    expect(themeColor2).toBe('white');

    await userEvent.click(toggle);
    const classes3 = getClasses(rootEl);
    const colorScheme3 = getColorScheme(rootEl);
    const themeColor3 = getThemeColor(rootEl);
    expect(classes3).toContain('dark');
    expect(colorScheme3).toBe('dark');
    expect(themeColor3).toBe('black');
  });

  it('should allow the user to set the mode', async () => {
    const { getByTestId } = await renderModeComponent({
      themeColors: { dark: 'black', light: 'white' },
    });
    const rootEl = document.documentElement;

    const classes = getClasses(rootEl);
    const colorScheme = getColorScheme(rootEl);
    const themeColor = getThemeColor(rootEl);
    expect(classes).toContain('dark');
    expect(colorScheme).toBe('dark');
    expect(themeColor).toBe('black');

    const light = getByTestId('light');
    await userEvent.click(light);
    const classes2 = getClasses(rootEl);
    const colorScheme2 = getColorScheme(rootEl);
    const themeColor2 = getThemeColor(rootEl);
    expect(classes2).not.toContain('dark');
    expect(colorScheme2).toBe('light');
    expect(themeColor2).toBe('white');

    const dark = getByTestId('dark');
    await userEvent.click(dark);
    const classes3 = getClasses(rootEl);
    const colorScheme3 = getColorScheme(rootEl);
    const themeColor3 = getThemeColor(rootEl);
    expect(classes3).toContain('dark');
    expect(colorScheme3).toBe('dark');
    expect(themeColor3).toBe('black');
  });

  it('should keep the mode signal in sync with current mode', async () => {
    const { getByTestId } = await renderModeComponent({
      themeColors: { dark: 'black', light: 'white' },
    });
    const rootEl = document.documentElement;
    const light = getByTestId('light');
    const dark = getByTestId('dark');
    const mode = getByTestId('mode');

    const classes = getClasses(rootEl);
    const colorScheme = getColorScheme(rootEl);
    const themeColor = getThemeColor(rootEl);
    expect(classes).toContain('dark');
    expect(colorScheme).toBe('dark');
    expect(themeColor).toBe('black');
    expect(mode.textContent).toBe('dark');

    await userEvent.click(light);
    const classes2 = getClasses(rootEl);
    const colorScheme2 = getColorScheme(rootEl);
    const themeColor2 = getThemeColor(rootEl);
    expect(classes2).not.toContain('dark');
    expect(colorScheme2).toBe('light');
    expect(themeColor2).toBe('white');
    expect(mode.textContent).toBe('light');

    await userEvent.click(dark);
    const classes3 = getClasses(rootEl);
    const colorScheme3 = getColorScheme(rootEl);
    const themeColor3 = getThemeColor(rootEl);
    expect(classes3).toContain('dark');
    expect(colorScheme3).toBe('dark');
    expect(themeColor3).toBe('black');
    expect(mode.textContent).toBe('dark');
  });

  it('should reset the mode to system preferences', async () => {
    const { getByTestId } = await renderModeComponent({
      themeColors: { dark: 'black', light: 'white' },
    });
    const rootEl = document.documentElement;
    const light = getByTestId('light');
    const reset = getByTestId('reset');
    const mode = getByTestId('mode');

    const classes = getClasses(rootEl);
    const colorScheme = getColorScheme(rootEl);
    const themeColor = getThemeColor(rootEl);
    expect(classes).toContain('dark');
    expect(colorScheme).toBe('dark');
    expect(themeColor).toBe('black');
    expect(mode.textContent).toBe('dark');

    await userEvent.click(light);
    const classes2 = getClasses(rootEl);
    const colorScheme2 = getColorScheme(rootEl);
    const themeColor2 = getThemeColor(rootEl);
    expect(classes2).not.toContain('dark');
    expect(colorScheme2).toBe('light');
    expect(themeColor2).toBe('white');
    expect(mode.textContent).toBe('light');

    await userEvent.click(reset);
    const classes3 = getClasses(rootEl);
    const colorScheme3 = getColorScheme(rootEl);
    const themeColor3 = getThemeColor(rootEl);
    expect(classes3).toContain('dark');
    expect(colorScheme3).toBe('dark');
    expect(themeColor3).toBe('black');
    expect(mode.textContent).toBe('dark');
  });

  it('tracks changes to system preferences', async () => {
    const { getByTestId, detectChanges } = await renderModeComponent({
      themeColors: { dark: 'black', light: 'white' },
    });

    const rootEl = document.documentElement;
    const mode = getByTestId('mode');

    const classes = getClasses(rootEl);
    const colorScheme = getColorScheme(rootEl);
    const themeColor = getThemeColor(rootEl);
    expect(classes).toContain('dark');
    expect(colorScheme).toBe('dark');
    expect(themeColor).toBe('black');
    expect(mode.textContent).toBe('dark');

    mediaQueryState.matches = true;
    const changeEvent = new Event('change');
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes2 = getClasses(rootEl);
    const colorScheme2 = getColorScheme(rootEl);
    const themeColor2 = getThemeColor(rootEl);
    expect(classes2).not.toContain('dark');
    expect(colorScheme2).toBe('light');
    expect(themeColor2).toBe('white');
    expect(mode.textContent).toBe('light');

    mediaQueryState.matches = false;
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes3 = getClasses(rootEl);
    const colorScheme3 = getColorScheme(rootEl);
    const themeColor3 = getThemeColor(rootEl);
    expect(classes3).toContain('dark');
    expect(colorScheme3).toBe('dark');
    expect(themeColor3).toBe('black');
    expect(mode.textContent).toBe('dark');
  });

  it('should stop tracking changes to system preferences when user sets a mode', async () => {
    const { getByTestId, detectChanges } = await renderModeComponent({
      themeColors: { dark: 'black', light: 'white' },
    });
    const rootEl = document.documentElement;
    const light = getByTestId('light');
    const reset = getByTestId('reset');
    const mode = getByTestId('mode');

    const classes = getClasses(rootEl);
    const colorScheme = getColorScheme(rootEl);
    const themeColor = getThemeColor(rootEl);
    expect(classes).toContain('dark');
    expect(colorScheme).toBe('dark');
    expect(themeColor).toBe('black');
    expect(mode.textContent).toBe('dark');

    mediaQueryState.matches = true;
    const changeEvent = new Event('change');
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes2 = getClasses(rootEl);
    const colorScheme2 = getColorScheme(rootEl);
    const themeColor2 = getThemeColor(rootEl);
    expect(classes2).not.toContain('dark');
    expect(colorScheme2).toBe('light');
    expect(themeColor2).toBe('white');
    expect(mode.textContent).toBe('light');

    mediaQueryState.matches = false;
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes3 = getClasses(rootEl);
    const colorScheme3 = getColorScheme(rootEl);
    const themeColor3 = getThemeColor(rootEl);
    expect(classes3).toContain('dark');
    expect(colorScheme3).toBe('dark');
    expect(themeColor3).toBe('black');
    expect(mode.textContent).toBe('dark');

    await userEvent.click(light);
    const classes4 = getClasses(rootEl);
    const colorScheme4 = getColorScheme(rootEl);
    const themeColor4 = getThemeColor(rootEl);
    expect(classes4).not.toContain('dark');
    expect(colorScheme4).toBe('light');
    expect(themeColor4).toBe('white');
    expect(mode.textContent).toBe('light');

    mediaQueryState.matches = true;
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes5 = getClasses(rootEl);
    const colorScheme5 = getColorScheme(rootEl);
    const themeColor5 = getThemeColor(rootEl);
    expect(classes5).not.toContain('dark');
    expect(colorScheme5).toBe('light');
    expect(themeColor5).toBe('white');
    expect(mode.textContent).toBe('light');

    mediaQueryState.matches = false;
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes6 = getClasses(rootEl);
    const colorScheme6 = getColorScheme(rootEl);
    const themeColor6 = getThemeColor(rootEl);
    expect(classes6).not.toContain('dark');
    expect(colorScheme6).toBe('light');
    expect(themeColor6).toBe('white');
    expect(mode.textContent).toBe('light');

    await userEvent.click(reset);
    const classes7 = getClasses(rootEl);
    const colorScheme7 = getColorScheme(rootEl);
    const themeColor7 = getThemeColor(rootEl);
    expect(classes7).toContain('dark');
    expect(colorScheme7).toBe('dark');
    expect(themeColor7).toBe('black');
    expect(mode.textContent).toBe('dark');
  });

  it('should not track changes to system preferences when track config is set to false', async () => {
    const { getByTestId, detectChanges } = await renderModeComponent({
      track: false,
      themeColors: { dark: 'black', light: 'white' },
    });

    const rootEl = document.documentElement;
    const mode = getByTestId('mode');
    const classes = getClasses(rootEl);
    const colorScheme = getColorScheme(rootEl);
    const themeColor = getThemeColor(rootEl);
    expect(classes).toContain('dark');
    expect(colorScheme).toBe('dark');
    expect(themeColor).toBe('black');
    expect(mode.textContent).toBe('dark');

    mediaQueryState.matches = true;
    const changeEvent = new Event('change');
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes2 = getClasses(rootEl);
    const colorScheme2 = getColorScheme(rootEl);
    const themeColor2 = getThemeColor(rootEl);
    expect(classes2).toContain('dark');
    expect(colorScheme2).toBe('dark');
    expect(themeColor2).toBe('black');
    expect(mode.textContent).toBe('dark');

    mediaQueryState.matches = false;
    window
      .matchMedia('(prefers-color-scheme: light)')
      .dispatchEvent(changeEvent);
    detectChanges();
    const classes3 = getClasses(rootEl);
    const colorScheme3 = getColorScheme(rootEl);
    const themeColor3 = getThemeColor(rootEl);
    expect(classes3).toContain('dark');
    expect(colorScheme3).toBe('dark');
    expect(themeColor3).toBe('black');
    expect(mode.textContent).toBe('dark');
  });
});

function renderModeComponent(config: Partial<ModeWatcherConfig> = {}) {
  return render(ModeComponent, {
    autoDetectChanges: true,
    providers: [
      {
        provide: MODE_WATCHER_CONFIG,
        useValue: modeWatcherConfig(config),
      },
    ],
  });
}

function getClasses(element: HTMLElement | null): string[] {
  if (element === null) {
    return [];
  }
  return element.className.split(' ').filter(c => c.length > 0);
}

function getColorScheme(element: HTMLElement | null) {
  if (element === null) {
    return '';
  }
  return element.style.colorScheme;
}

function getThemeColor(element: HTMLElement | null) {
  if (element === null) {
    return '';
  }

  const themeMetaEl = element.querySelector('meta[name="theme-color"]');
  if (themeMetaEl === null) {
    return '';
  }

  const content = themeMetaEl.getAttribute('content');
  if (content === null) {
    return '';
  }

  return content;
}
