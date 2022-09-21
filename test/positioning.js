const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('aria positioning', async (t) => {
  t.plan(4);
  const out = await tex2svg('a+b = c');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  t.ok(svg.getAttribute('role') === 'tree' && !svg.getAttribute('aria-level'), 'no aria-level on tree root');
  t.equal(svg.querySelectorAll('[aria-level="1"]').length, 3, 'aria-level check');
  t.equal(svg.querySelectorAll('[aria-setsize="3"]').length, 6, 'elements with aria-setsize 3');
  t.equal(svg.querySelectorAll('[aria-posinset="1"]+[aria-posinset="2"]+[aria-posinset="3"]').length, 2, 'elements with aria-posinset 3, preceded by posinset 2 and 1');
});
