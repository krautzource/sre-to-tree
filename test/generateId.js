const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');
const crypto = require('crypto');

test('generateid()', (t) => {
  t.plan(1);
  const out = tex2svg('x');
  const svg = out.firstElementChild;
  const hash = crypto.createHash('md5').update(svg.outerHTML).digest('hex');
  sre2tree(svg);
  t.ok(svg.querySelector(`[id^="sretree-${hash}-"]`), 'generateID ID preserved');
});
