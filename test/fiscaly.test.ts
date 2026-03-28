import { Fiscaly, TssState, TransactionStateEnum } from '../src/index'

describe('Fiscaly', () => {

  let fiscaly: Fiscaly;

  beforeEach(() => {
    fiscaly = new Fiscaly('https://api.test.fiskaly.com/api/v2');
  });

  it('should create an instance with default base URL', () => {
    const f = new Fiscaly();
    expect(f.baseUrl).toBe('https://kassensichv-middleware.fiskaly.com/api/v2');
  });

  it('should create an instance with custom base URL', () => {
    expect(fiscaly.baseUrl).toBe('https://api.test.fiskaly.com/api/v2');
  });

  it('should authenticate and store auth data', async () => {
    const mockAuthData = {
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      access_token_expires_at: 9999999999
    };

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockAuthData)
    });

    await fiscaly.auth('test-key', 'test-secret');

    expect(fetch).toHaveBeenCalledWith(
      'https://api.test.fiskaly.com/api/v2/auth',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ api_key: 'test-key', api_secret: 'test-secret' })
      })
    );
  });

  describe('authenticated requests', () => {
    beforeEach(async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ access_token: 'test-token' })
      });
      await fiscaly.auth('key', 'secret');
    });

    it('should list TSS', async () => {
      const mockResponse = { count: 1, data: [{ _id: 'tss-1', state: 'INITIALIZED' }] };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fiscaly.listTss();
      expect(result.data).toHaveLength(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.fiskaly.com/api/v2/tss',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({ Authorization: 'Bearer test-token' })
        })
      );
    });

    it('should retrieve a specific TSS', async () => {
      const mockTss = { _id: 'tss-1', state: 'INITIALIZED' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTss)
      });

      const result = await fiscaly.retrieveTss('tss-1');
      expect(result.state).toBe('INITIALIZED');
    });

    it('should create a TSS', async () => {
      const mockResponse = { _id: 'new-tss', admin_puk: '12345' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fiscaly.createTss();
      expect(result._id).toBe('new-tss');
      expect(result.admin_puk).toBe('12345');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tss/'),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should update TSS state', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({})
      });

      await fiscaly.updateTss('tss-1', TssState.INITIALIZED);
      expect(fetch).toHaveBeenCalledWith(
        'https://api.test.fiskaly.com/api/v2/tss/tss-1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ state: 'INITIALIZED' })
        })
      );
    });

    it('should create a client', async () => {
      const mockClient = { _id: 'client-1', state: 'REGISTERED' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockClient)
      });

      const result = await fiscaly.createClient('tss-1');
      expect(result._id).toBe('client-1');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/tss/tss-1/client/'),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('should start a transaction', async () => {
      const mockTx = { _id: 'tx-1', number: 1, state: 'ACTIVE' };
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockTx)
      });

      const result = await fiscaly.startUpdateOrFinishTransaction(
        'tss-1', 'client-1', 'tx-1', 1, TransactionStateEnum.ACTIVE, undefined, undefined
      );
      expect(result.number).toBe(1);
      expect(result.state).toBe('ACTIVE');
    });

    it('should list transactions with pagination', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          count: 2,
          data: [{ _id: 'tx-1' }, { _id: 'tx-2' }],
          _env: 'test',
          _type: 'TRANSACTION',
          _version: '2'
        })
      });

      const result = await fiscaly.listTransactionsOfTss('tss-1', [TransactionStateEnum.ACTIVE]);
      expect(result.data).toHaveLength(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('states[0]=ACTIVE'),
        expect.anything()
      );
    });

    it('should throw on HTTP error', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      });

      await expect(fiscaly.listTss()).rejects.toThrow('HTTP 401: Unauthorized');
    });
  });
});
