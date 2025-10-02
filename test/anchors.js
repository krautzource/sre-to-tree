import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('anchors', async (t) => {
  t.plan(14);
  // SRE info for "inner" links is moved to <a> element
  let out = await tex2svg('a  = \\href{//example.com}{link}');
  let svg = out.firstElementChild;
  sre2tree(svg);
  let theLink = svg.querySelector('a[href]');
  t.equal(theLink.getAttribute('role'), 'treeitem' , 'Anchor gets role from "real" SRE node');
  t.equal(theLink.getAttribute('data-owns-id'), '9', 'Anchor gets data-owns-id from "real" SRE node');
  t.notOk(theLink.querySelector('[data-owns-id="9"]'), 'Anchor descendents do not have the same data-owns-id, i.e., removed from "real" SRE node.')
  t.equal(theLink.getAttribute('data-owns'), '2 6 3 7 4 8 5', 'Anchor gets data-owns from "real" SRE node');
  t.equal(theLink.getAttribute('aria-label'), 'l i n k link', 'Anchor gets aria-label from "real" SRE node');

  // "Outer"/"wrapping" links are "flattened" (not trees)
  out = await tex2svg('\\href{a}{b, c}');
  svg = out.firstElementChild;
  sre2tree(svg);
  theLink = svg.querySelector('a[href]');
  t.equal(theLink.hasAttribute('role'), false , '"Wrapping Anchor" does not get role from "real" SRE node');
  t.equal(theLink.hasAttribute('data-owns-id'), false, '"Wrapping Anchor" does not get data-owns-id from "real" SRE node');
  t.notOk(theLink.querySelector(':not([role="presentation"])'), '"Wrapping Anchor" descendents are presentational.')
  t.equal(theLink.getAttribute('aria-label'), 'b comma c', '"Wrapping Anchor" gets aria-label from "real" SRE node'); //NOTE: as opposed to inner links, no added text "link" is needed here.


  // "flat" ( no semantic children) with "wrapping" link gets "wrapping link" treatment, not "flat" treatment
  out = await tex2svg('\\href{a}{b}');
  svg = out.firstElementChild;
  sre2tree(svg);
  
  theLink = svg.querySelector('a[href]');
  t.equal(svg.getAttribute('role'), 'presentation', '"Wrapping Anchor" with "flat" expression: svg is presentation');
  t.equal(theLink.hasAttribute('role'), false , '"Wrapping Anchor" with "flat" expression: does not get role from "real" SRE node');
  t.equal(theLink.hasAttribute('data-owns-id'), false, '"Wrapping Anchor" with "flat" expression: does not get data-owns-id from "real" SRE node');
  t.notOk(theLink.querySelector(':not([role="presentation"])'), '"Wrapping Anchor" with "flat" expression: descendents are presentational.')
  t.equal(theLink.getAttribute('aria-label'), 'b', '"Wrapping Anchor" with "flat" expression: gets aria-label from "real" SRE node'); //NOTE: as opposed to inner links, no added text "link" is needed here.
});
