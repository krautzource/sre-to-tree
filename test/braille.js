const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('aria-braillelabel', async (t) => {
  t.plan(2);
  const out = await tex2svg('f(x) = y');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  t.ok(svg.hasAttribute('aria-braillelabel'), 'Root has aria-braillelabel');
  t.ok(svg.querySelector('[aria-label]').hasAttribute('aria-braillelabel'), 'Descendant with aria-label also gets aria-braillelabel');
});
