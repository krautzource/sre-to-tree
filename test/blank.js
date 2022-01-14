const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('prevent empty aria-label', async (t) => {
  t.plan(2);
  const out = await tex2svg('a \\quad b');
  const svg = out.firstElementChild;
  sre2tree(svg);
  t.notOk(svg.querySelector('[aria-label=""]'), 'aria-label is not empty');
  const out2 = await tex2svg('\\int a');
  const svg2 = out2.firstElementChild;
  sre2tree(svg2);
  t.notOk(svg2.querySelector('[aria-label=""]'), 'aria-label is not empty');
});
