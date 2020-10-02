const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('a first few tests', (t) => {
  t.plan(3);
  const out = tex2svg('f(x) = y');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  t.equal(svg.getAttribute('role'), 'tree', 'Root gets role=tree');
  t.ok(svg.getAttribute('aria-owns').split(' ').length > 0 , 'Root gets non-emtpy aria-owns');
  t.ok(svg.getAttribute('aria-label'), 'Root gets non-emtpy aria-owns');
});
