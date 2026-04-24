import contractService from './contract.service';
import api from './api.service';

jest.mock('./api.service', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    getBlob: jest.fn(),
  },
}));

describe('contractService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── Analiz ───────────────────────────────────────────────────────────────

  test('analyzeText — doğru endpoint ve body ile çağrılır', async () => {
    api.post.mockResolvedValueOnce({ contractType: 'kira_sozlesmesi' });

    await contractService.analyzeText('kira sözleşmesi metni');

    expect(api.post).toHaveBeenCalledWith('/api/analysis/analyze', { text: 'kira sözleşmesi metni' });
  });

  // ── CRUD ─────────────────────────────────────────────────────────────────

  test('create — POST /api/contracts ile çağrılır', async () => {
    const data = { title: 'Test Sözleşmesi', type: 'kira_sozlesmesi' };
    api.post.mockResolvedValueOnce({ id: 1 });

    await contractService.create(data);

    expect(api.post).toHaveBeenCalledWith('/api/contracts', data);
  });

  test('getAll — GET /api/contracts ile çağrılır', async () => {
    api.get.mockResolvedValueOnce([]);

    await contractService.getAll({ page: 0 });

    expect(api.get).toHaveBeenCalledWith('/api/contracts', { page: 0 });
  });

  test('getById — doğru id ile GET çağrılır', async () => {
    api.get.mockResolvedValueOnce({ id: 42 });

    await contractService.getById(42);

    expect(api.get).toHaveBeenCalledWith('/api/contracts/42');
  });

  test('update — doğru id ve body ile PUT çağrılır', async () => {
    const data = { title: 'Güncellendi' };
    api.put.mockResolvedValueOnce({ id: 5 });

    await contractService.update(5, data);

    expect(api.put).toHaveBeenCalledWith('/api/contracts/5', data);
  });

  test('delete — doğru id ile DELETE çağrılır', async () => {
    api.delete.mockResolvedValueOnce({});

    await contractService.delete(7);

    expect(api.delete).toHaveBeenCalledWith('/api/contracts/7');
  });

  // ── İş akışı ─────────────────────────────────────────────────────────────

  test('finalize — POST /api/contracts/{id}/finalize çağrılır', async () => {
    api.post.mockResolvedValueOnce({ status: 'PENDING' });

    await contractService.finalize(3);

    expect(api.post).toHaveBeenCalledWith('/api/contracts/3/finalize');
  });

  test('approve — POST /api/contracts/{id}/approve çağrılır', async () => {
    api.post.mockResolvedValueOnce({ status: 'APPROVED' });

    await contractService.approve(10);

    expect(api.post).toHaveBeenCalledWith('/api/contracts/10/approve');
  });

  test('reject — POST /api/contracts/{id}/reject çağrılır', async () => {
    api.post.mockResolvedValueOnce({ status: 'REJECTED' });

    await contractService.reject(10);

    expect(api.post).toHaveBeenCalledWith('/api/contracts/10/reject');
  });

  test('getPendingApprovals — GET /api/contracts/pending-approval çağrılır', async () => {
    api.get.mockResolvedValueOnce([]);

    await contractService.getPendingApprovals();

    expect(api.get).toHaveBeenCalledWith('/api/contracts/pending-approval');
  });

  test('getStats — GET /api/contracts/stats çağrılır', async () => {
    api.get.mockResolvedValueOnce({ total: 5 });

    await contractService.getStats();

    expect(api.get).toHaveBeenCalledWith('/api/contracts/stats');
  });

  // ── PDF ──────────────────────────────────────────────────────────────────

  test('downloadPdf — getBlob ile çağrılır (binary response)', async () => {
    api.getBlob.mockResolvedValueOnce(new Blob());

    await contractService.downloadPdf(99);

    expect(api.getBlob).toHaveBeenCalledWith('/api/contracts/99/pdf');
  });

  test('getPdfConfirm — GET /api/contracts/{id}/pdf-confirm çağrılır', async () => {
    api.get.mockResolvedValueOnce({ warnings: [] });

    await contractService.getPdfConfirm(15);

    expect(api.get).toHaveBeenCalledWith('/api/contracts/15/pdf-confirm');
  });
});
