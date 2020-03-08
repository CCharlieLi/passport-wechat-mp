const strategy = require('..');

describe('passport-wechat-mp', () => {
  it('should export Strategy constructor directly from package', function() {
    expect(typeof strategy).toBe('object');
    expect(typeof strategy.Strategy).toBe('function');
  });

  it('should fetch lib version', () => {
    expect(strategy.version).toBe('1.0.0');
  });
});
