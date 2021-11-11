const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('a first few tests', (t) => {
  t.plan(6);
  const out = tex2svg('f(x) = y');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  t.equal(svg.getAttribute('role'), 'tree', 'Root gets role=tree');
  t.ok(svg.getAttribute('data-owns').split(' ').length > 0 , 'Root gets non-emtpy data-owns');
  t.ok(svg.querySelectorAll('[data-owns-id]').length > 0, 'Some data-owns-id');
  t.deepEqual(svg.querySelectorAll('data-semantic-id'), svg.querySelectorAll('data-owns-id') , 'Root gets non-emtpy data-owns');
  t.ok(svg.getAttribute('aria-label'), 'Root gets non-emtpy data-owns');
  t.deepEqual(svg.querySelectorAll('[role="treeitem"]'), svg.querySelectorAll('[aria-hidden="true"]') , 'All treeitems are aria-hidden');
});
