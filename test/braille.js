import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('aria-braillelabel', async (t) => {
  t.plan(2);
  const out = await tex2svg('f(x) = y');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  t.ok(svg.hasAttribute('aria-braillelabel'), 'Root has aria-braillelabel');
  t.ok(svg.querySelector('[aria-label]').hasAttribute('aria-braillelabel'), 'Descendant with aria-label also gets aria-braillelabel');
});
