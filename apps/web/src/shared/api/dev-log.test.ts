import { logContractViolation } from '@/shared/api/dev-log';

describe('logContractViolation', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('en producción no loguea', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const log = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    logContractViolation({ method: 'GET', endpoint: 'x', issues: [] });
    expect(log).not.toHaveBeenCalled();
  });
});
