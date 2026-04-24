import authService from './auth.service';
import api from './api.service';

jest.mock('./api.service', () => ({
  __esModule: true,
  default: { post: jest.fn() },
}));

const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.test';
const MOCK_USER = { id: 1, username: 'ahmet', email: 'ahmet@test.com' };

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  // ── login ─────────────────────────────────────────────────────────────────

  test('login — başarılıysa token ve user localStorage\'a kaydedilir', async () => {
    api.post.mockResolvedValueOnce({ accessToken: MOCK_TOKEN, userInfo: MOCK_USER });

    await authService.login('ahmet', 'sifre123');

    expect(localStorage.getItem('authToken')).toBe(MOCK_TOKEN);
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(MOCK_USER);
  });

  test('login — accessToken yoksa localStorage\'a yazılmaz', async () => {
    api.post.mockResolvedValueOnce({ message: 'Başarısız' });

    await authService.login('ahmet', 'yanlis');

    expect(localStorage.getItem('authToken')).toBeNull();
  });

  test('login — API hatası fırlatılırsa hata yayılır', async () => {
    api.post.mockRejectedValueOnce(new Error('401 Unauthorized'));

    await expect(authService.login('ahmet', 'yanlis')).rejects.toThrow();
  });

  // ── register ──────────────────────────────────────────────────────────────

  test('register — accessToken gelince token kaydedilir', async () => {
    api.post.mockResolvedValueOnce({ accessToken: MOCK_TOKEN, userInfo: MOCK_USER });

    await authService.register({
      username: 'ahmet', email: 'ahmet@test.com', password: 'P@ss1234',
    });

    expect(api.post).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({
      username: 'ahmet',
      email: 'ahmet@test.com',
    }));
    expect(localStorage.getItem('authToken')).toBe(MOCK_TOKEN);
  });

  test('register — firstName/lastName yoksa boş string gönderilir', async () => {
    api.post.mockResolvedValueOnce({});

    await authService.register({ username: 'x', email: 'x@x.com', password: '123' });

    const body = api.post.mock.calls[0][1];
    expect(body.firstName).toBe('');
    expect(body.lastName).toBe('');
  });

  // ── logout ────────────────────────────────────────────────────────────────

  test('logout — localStorage temizlenir', () => {
    localStorage.setItem('authToken', MOCK_TOKEN);
    localStorage.setItem('user', JSON.stringify(MOCK_USER));

    authService.logout();

    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  // ── isAuthenticated ───────────────────────────────────────────────────────

  test('isAuthenticated — token varsa true döner', () => {
    localStorage.setItem('authToken', MOCK_TOKEN);
    expect(authService.isAuthenticated()).toBe(true);
  });

  test('isAuthenticated — token yoksa false döner', () => {
    expect(authService.isAuthenticated()).toBe(false);
  });

  // ── getCurrentUser ────────────────────────────────────────────────────────

  test('getCurrentUser — kaydedilmiş kullanıcıyı döner', () => {
    localStorage.setItem('user', JSON.stringify(MOCK_USER));
    expect(authService.getCurrentUser()).toEqual(MOCK_USER);
  });

  test('getCurrentUser — user yoksa null döner', () => {
    expect(authService.getCurrentUser()).toBeNull();
  });

  test('getCurrentUser — bozuk JSON\'da null döner (crash yok)', () => {
    localStorage.setItem('user', '{bozuk json}}}');
    expect(authService.getCurrentUser()).toBeNull();
  });

  // ── getToken ──────────────────────────────────────────────────────────────

  test('getToken — saklı token\'ı döner', () => {
    localStorage.setItem('authToken', MOCK_TOKEN);
    expect(authService.getToken()).toBe(MOCK_TOKEN);
  });
});
