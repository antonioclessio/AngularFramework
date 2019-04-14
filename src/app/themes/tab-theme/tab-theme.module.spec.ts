import { TabThemeModule } from './tab-theme.module';

describe('TabThemeModule', () => {
  let tabThemeModule: TabThemeModule;

  beforeEach(() => {
    tabThemeModule = new TabThemeModule();
  });

  it('should create an instance', () => {
    expect(TabThemeModule).toBeTruthy();
  });
});
