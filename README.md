# passport-wechat-mp

[![Build Status](https://travis-ci.com/CCharlieLi/passport-wechat-mp.svg?branch=master)](https://travis-ci.com/CCharlieLi/passport-wechat-mp)

Wechat Mini Program authentication strategy for [Passport](http://passportjs.org/).

## Install

```bash
$ npm install passport-wechat-mp
# yarn add passport-wechat-mp
```
## Usage

#### Configure Strategy

```js
const WechatMPStrategy = require('passport-wechat-mp').Strategy;

passport.use(
  'wechat-mp',
  new WechatMPStrategy(
    {
      appId: app.get('wechatMPAppId'),
      appSecret: app.get('wechatMPSecret')
    },
    async (req, profile, done) => {
      // profile
      // {
      //   openid,
      //   unionid,
      //   session_key
      // }
      User.findOrCreate({ exampleId: profile.openid }, (err, user) => {
        return cb(err, user);
      });
    }
  )
)
```

Strategy constructor options:
- `appId`: String, required, wechat miniprogram appid.
- `appSecret`: String, required, wechat miniprogram app secret.
- `name`: String, optional, strategy name. Default as `wechat-mp`.
- `authorizationURL`: String, optional, url to fetch wechat session key by code, check [wechat doc](https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html) for more details. Default as `https://api.weixin.qq.com/sns/jscode2session`.


#### Authenticate Requests

```js
const passport = require('passport');

app.get('/mp/login', passport.authenticate('wechat-mp', {
  successRedirect: '/api/memberships/profile/me',
  failureRedirect: '/error'
}));
```

## Test

```bash
$ npm test
# yarn test
```

## TODO

- [ ] Strategy unit test

## License

[The MIT License](http://opensource.org/licenses/MIT)
