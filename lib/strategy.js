'use strict';

const util = require('util');
const axios = require('axios');
const Strategy = require('passport-strategy');
const AuthorizationError = require('passport-oauth2/lib/errors/authorizationerror');

/**
 * Constructor
 * @param {Object} options
 * @param {Function} verify
 */
function WechatMPStrategy(options = {}, verify) {
  if (!options.appId) {
    throw new TypeError('WechatMPStrategy requires a appId option');
  }
  if (!options.appSecret) {
    throw new TypeError('WechatMPStrategy requires a appSecret option');
  }
  if (!verify) {
    throw new TypeError('WechatMPStrategy requires a verify callback');
  }

  Strategy.call(this);

  this._verify = verify;
  this._appId = options.appId;
  this._appSecret = options.appSecret;
  this._name = options.name || 'wechat-mp';
  this._grant_type = 'authorization_code';
  this._authorizationURL =
    options.authorizationURL || 'https://api.weixin.qq.com/sns/jscode2session';
}

// Inherit from `passport.Strategy`.
util.inherits(WechatMPStrategy, Strategy);

WechatMPStrategy.prototype.authenticate = async function(req, options) {
  options = options || {};
  const self = this;

  if (req.query && req.query.error) {
    return req.query.error == 'access_denied'
      ? this.fail({ message: req.query.error_description })
      : this.error(
          new AuthorizationError(
            req.query.error_description,
            req.query.error,
            req.query.error_uri
          )
        );
  }

  if (!req.query || !req.query.code) {
    return this.error(
      new AuthorizationError(
        'WechatMPStrategy requires code parameter',
        'access_denied'
      )
    );
  }

  if (!req.session) {
    return this.error(
      new AuthorizationError(
        'WechatMPStrategy requires session support',
        'access_denied'
      )
    );
  }

  const code = req.query.code;
  let wechatSession;

  try {
    wechatSession = await this.code2Session(code, options);
  } catch (err) {
    return this.error(
      new AuthorizationError('Failed to obtain wechat session', err)
    );
  }

  if (wechatSession.errcode || wechatSession.errmsg) {
    return this.error(
      new AuthorizationError(wechatSession.errmsg, wechatSession.errcode)
    );
  }

  try {
    self._verify(req, wechatSession, (err, user, info) => {
      if (err) return self.error(err);
      if (!user) return self.fail(info);
      self.success(user, info);
    });
  } catch (err) {
    return self.error(err);
  }
};

// See https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/login/auth.code2Session.html
WechatMPStrategy.prototype.code2Session = async function(code, options) {
  return this._request({
    method: 'GET',
    baseURL: this._authorizationURL,
    params: {
      appid: this._appId,
      secret: this._appSecret,
      js_code: code,
      grant_type: this._grant_type
    }
  });
};

/**
 * @param {object} options { method, url, baseURL, data, headers, params }
 */
WechatMPStrategy.prototype._request = async options => {
  if (typeof options === 'string') options = { method: 'GET', uri: options };
  options.timeout = options.timeout || 10000; // 10s
  const body = await axios(options);
  return body.data;
};

module.exports = WechatMPStrategy;
