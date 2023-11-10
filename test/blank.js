import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('prevent empty aria-label', async (t) => {
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
