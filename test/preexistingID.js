const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('pre-existing IDs', (t) => {
  t.plan(2);
  const out = tex2svg('\\cssId{myid}{f(x)} = y');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  t.ok(svg.querySelector('#myid'), 'pre-existing ID preserved');
  t.ok(
    svg.getAttribute('aria-owns').startsWith('myid'),
    'pre-existing ID in aria-owns'
  );
});
