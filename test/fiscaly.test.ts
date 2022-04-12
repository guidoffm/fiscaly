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

// it('works', async () => {
  
//   expect(fiscaly).toBeTruthy();

//   await fiscaly.auth(apiKey, apiSecret);

//   const createTssResponse = await fiscaly.createTss();

//   const tssId = createTssResponse._id;
//   const adminPuk = createTssResponse.admin_puk;
//   await fiscaly.updateTss(tssId, TssState.UNINITIALIZED);
//   const newAdminPin = '123456';
//   await fiscaly.changeOrUnblockAdminPin(tssId, adminPuk, newAdminPin);
//   await fiscaly.authenticateAdmin(tssId, newAdminPin);
//   await fiscaly.updateTss(tssId, TssState.INITIALIZED);
//   await fiscaly.updateTss(tssId, TssState.DISABLED);
//   // await fiscaly.createClient(tssId);
// });

// it('listTss and retrieveTss', async () => {
//   expect(fiscaly).toBeTruthy();

//   await fiscaly.auth(apiKey, apiSecret);

//   const list = await fiscaly.listTss();
//   // console.log(list);
//   expect (Array.isArray(list.data));

//   for(let i=0; i<list.count; i++){
//     const item = list.data[i];
//     const res = await fiscaly.retrieveTss(item._id);
//     // console.log(res);
//     expect(res.state).toBeTruthy();
//   };
// });

it('Get active Tss and list transactions', async () => {
  expect(fiscaly).toBeTruthy();

  await fiscaly.auth(apiKey, apiSecret);

  const list = await fiscaly.listTss();
  // console.log(list);
  expect (Array.isArray(list.data));

  const initializedTss = list.data.filter(x => x.state === TssState.INITIALIZED);
  for(let i=0; i<initializedTss.length; i++){
    const item = initializedTss[i];
    const res = await fiscaly.retrieveTss(item._id);
    console.log(res);
    const transactions = await fiscaly.listTransactionsOfTss(item._id, undefined);
    console.log(transactions);
    expect(res.state).toBeTruthy();
  };
});