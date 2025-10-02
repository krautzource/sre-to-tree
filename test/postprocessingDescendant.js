import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('postprocessingDescendant()', async (t) => {
  t.plan(3);
  const out = await tex2svg('f(x) = y \\img[][10px][10px][{alt}]{nonexisting.svg}');
  const svg = out.firstElementChild;
  sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

  // testing clean up with the only use case observed in the wild: image elements
  t.equal(svg.querySelector('image').getAttribute('role'), 'presentation', 'Image element gets role=presentation');
  t.notOk(svg.querySelector('image').hasAttribute('aria-label'), 'Image element has aria-label removed');
  t.notOk(svg.querySelector('image').hasAttribute('aria-braillelabel'), 'Image element has aria-braillelabel removed');
});
