const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');

class Page {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    const customPage = new Page(page);

    return new Proxy(customPage, {
      get: (target, property) => {
        return customPage[property] || browser[property] || page[property]
       }
    });
  }

  constructor(page) {
    this.page = page
  }

  async login(user) {
    const { session, sig } = sessionFactory(user);
    await this.page.setCookie({ name: 'session', value: session });
    await this.page.setCookie({ name: 'session.sig', value: sig });
    await this.page.goto('http://localhost:3000/blogs');
    await this.page.waitFor('a[href="/auth/logout"]');
  }

  async getContentsOf(selector) {
    return await this.page.$eval(selector, el => el.innerHTML);
  }

  async request(path, method, body) {
    return this.page.evaluate(
      (path, method, body) => {
        var params = {
            method: method,
            credentials: 'same-origin',
            headers: {
              'Content-Type': 'application/json'
            },
        }
        if (body) {
          params.body = JSON.stringify(body)
        }

        return fetch(path, params).then(res => res.json());
      },
      path,
      method,
      body
    );
  }

  async get(path) {
    return this.request(path, 'GET');
  }
  
  async post(path, body) {
    return this.request(path, 'POST', body);
  }
}

module.exports = Page;
