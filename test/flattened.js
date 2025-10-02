import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('flat expressions', async (t) => {
  t.plan(3);
  const out = await tex2svg('x');
  const svg = out.firstElementChild;
  sre2tree(svg);
  t.equal(svg.getAttribute('aria-label'), 'x', 'Expressions without tree are flattened on the svg')
  t.equal(svg.getAttribute('role'), 'img', 'Expressions without tree are flattened on the svg')
  t.notOk(svg.querySelector('[aria-label]'), 'Flat expressions have no nested aria-label');
});
