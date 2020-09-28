const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('a first few tests', (t) => {
  t.plan(3);
  const out = tex2svg('f(x) = y');
  sre2tree(out);

  t.equal(out.getAttribute('role'), 'tree', 'Root gets role=tree');
  t.ok(out.getAttribute('aria-owns').split(' ').length > 0 , 'Root gets non-emtpy aria-owns');
  t.ok(out.getAttribute('aria-label'), 'Root gets non-emtpy aria-owns');
});
