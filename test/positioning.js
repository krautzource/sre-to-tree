const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('aria positioning', async (t) => {
  t.plan(3);
  const out = await tex2svg('a+b = c');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  t.equal(svg.getAttribute('aria-level'), '1', 'aria-level of root');
  t.equal(svg.querySelectorAll('[aria-setsize="3"]').length, 6, 'elements with aria-setsize 3');
  t.equal(svg.querySelectorAll('[aria-posinset="1"]+[aria-posinset="2"]+[aria-posinset="3"]').length, 2, 'elements with aria-posinset 3, preceded by posinset 2 and 1');
});
