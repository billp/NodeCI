const Page = require('./helpers/page');
const { createUsers, deleteAllUsers } = require('./factories/userFactory');
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

describe('When logged in', async () => {
  beforeEach(async () => {
    await page.login(users[0]);
    await page.click('a.btn-floating');
  });

  test('When logged in, can see blog create form', async () => {
    const label = await page.getContentsOf('form label');
    expect(label).toEqual('Blog Title');
  });

  describe('And using valid inputs', async () => {
    beforeEach(async () => {
      await page.type('.title input', 'My Title');
      await page.type('.content input', 'My Content');
      await page.click('form button');
    });

    test('Submitting takes user to review screen', async() => {
      const text = await page.getContentsOf('h5');

      expect(text).toEqual('Please confirm your entries');
    });

    test('Submitting then saving adds blog to index page', async () => {
      await page.click('button.green');
      await page.waitFor('.card');

      const title = await page.getContentsOf('.card-title');
      const content = await page.getContentsOf('p');

      expect(title).toEqual(title);
      expect(content).toEqual(content);
    });
  });

  describe('And using invalid inputs', async () => {
    test('the form shows an error message', async () => {
      await page.click('form button');
      const titleError = await page.getContentsOf('.title .red-text');
      const contentError = await page.getContentsOf('.content .red-text');

      expect(titleError).toEqual('You must provide a value');
      expect(contentError).toEqual('You must provide a value');
    });
  });
});

describe('User is not logged in', async () => {
  test('User cannot create blog post', async () => {
    const result = await page.post('/api/blogs', { title: 'My Title', content: 'My Content' })

    expect(result).toEqual({ error: 'You must log in!'});
  });

  test('User cannot get a list of posts', async () => {
    const result = await page.get('/api/blogs');

    expect(result).toEqual({ error: 'You must log in!'});
  });
});
