const { createUsers, deleteAllUsers } = require('./factories/userFactory');
const Page = require('./helpers/page');
const { dbConnect, dbDisconnect } = require('./helpers/db');

let page, users;

beforeAll(async () => {
  await dbConnect();
});

afterAll(async () => {
  await dbDisconnect();
});

beforeEach(async () => {
  users = await createUsers();
  page = await Page.build();
  await page.goto('http://localhost:3000');
});

afterEach(async () => {
  await deleteAllUsers(users);
  await page.close();
});

test('The header has the correct text.', async () => {
  const text = await page.getContentsOf('a.brand-logo');

  expect(text).toEqual('Blogster')
});

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a');

  const url = await page.url();

  expect(url).toMatch(/accounts\.google\.com/);
});

test('Test login', async () => {
  await page.login(users[0]);

  const text = await page.getContentsOf('a[href="/auth/logout"]');
  expect(text).toEqual('Logout');
});
