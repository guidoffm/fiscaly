import { Fiscaly, TssState } from '../src/index'

const apiKey = process.env['API_KEY'] as string;
const apiSecret = process.env['API_SECRET'] as string;

const fiscaly = new Fiscaly();

it('check API_KEY is there', () => {
  expect(apiKey).toBeTruthy();
});

it('check API_SECRET is there', () => {
  expect(apiSecret).toBeTruthy();
});

jest.setTimeout(60000);

it('works', async () => {
  
  expect(fiscaly).toBeTruthy();

  await fiscaly.auth(apiKey, apiSecret);

  const createTssResponse = await fiscaly.createTss();

  const tssId = createTssResponse._id;
  const adminPuk = createTssResponse.admin_puk;
  await fiscaly.updateTss(tssId, TssState.UNINITIALIZED);
  const newAdminPin = '123456';
  await fiscaly.changeOrUnblockAdminPin(tssId, adminPuk, newAdminPin);
  await fiscaly.authenticateAdmin(tssId, newAdminPin);
  await fiscaly.updateTss(tssId, TssState.INITIALIZED);
  await fiscaly.updateTss(tssId, TssState.DISABLED);
  // await fiscaly.createClient(tssId);
});