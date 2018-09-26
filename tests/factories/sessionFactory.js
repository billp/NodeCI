const Buffer = require('safe-buffer').Buffer;
const keys = require('../../config/keys');
const Keygrip = require('keygrip');
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const cookie = {
    passport: {
      user: user._id.toString()
    }
  }

  const session = Buffer.from(JSON.stringify(cookie)).toString('base64');
  const sig = keygrip.sign('session=' + session);

  return { session, sig }
}
