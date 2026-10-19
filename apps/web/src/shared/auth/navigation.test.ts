import { navigateTo, setAuthNavigator } from '@/shared/auth';

describe('navigateTo', () => {
  afterEach(() => {
    setAuthNavigator(null);
    vi.restoreAllMocks();
  });

  it('usa el navegador registrado (router de Next)', () => {
    const navigator = vi.fn();
    setAuthNavigator(navigator);
    navigateTo('/login');
    expect(navigator).toHaveBeenCalledWith('/login');
  });

  it('sin navegador registrado cae a window.location.assign', () => {
    const assign = vi.fn();
    vi.spyOn(window, 'location', 'get').mockReturnValue({
      ...window.location,
      assign,
    });
    navigateTo('/login');
    expect(assign).toHaveBeenCalledWith('/login');
  });
});
