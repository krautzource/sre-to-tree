import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('anchors', async (t) => {
  t.plan(5);
  const out = await tex2svg('a  = \\href{//example.com}{link}');
  const svg = out.firstElementChild;
  sre2tree(svg);
  const theLink = svg.querySelector('a[href]');
  t.equal(theLink.getAttribute('role'), 'treeitem' , 'Anchor gets role from "real" SRE node');
  t.equal(theLink.getAttribute('data-owns-id'), '9', 'Anchor gets data-owns-id from "real" SRE node');
  t.notOk(theLink.querySelector('[data-owns-id="9"]'), 'Anchor descendents do not have the same data-owns-id, i.e., removed from "real" SRE node.')
  t.equal(theLink.getAttribute('data-owns'), '2 6 3 7 4 8 5', 'Anchor gets data-owns from "real" SRE node');
  t.equal(theLink.getAttribute('aria-label'), 'l i n k link', 'Anchor gets aria-label from "real" SRE node');
});
