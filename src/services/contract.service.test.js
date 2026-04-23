import contractService from './contract.service';
import api from './api.service';

jest.mock('./api.service', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe('contractService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('analyzeText calls real analysis endpoint', async () => {
    api.post.mockResolvedValueOnce({ ok: true });

    await contractService.analyzeText('ornek metin');

    expect(api.post).toHaveBeenCalledWith('/api/analysis/analyze', { text: 'ornek metin' });
  });
});
