const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('a first test', (t) => {
  t.plan(1);
  const out = tex2svg('f(x) = y');
  sre2tree(out);
  console.log(out.outerHTML);

  t.equal(out.getAttribute('role'), 'tree', 'Root gets role=tree');
});
