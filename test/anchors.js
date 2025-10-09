import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('anchors', async (t) => {
  t.plan(15);
  // SRE info for "inner" links is moved to <a> element
  let out = await tex2svg('a  = \\href{//example.com}{link}');
  let node = out.firstElementChild;
  sre2tree(node);
  let theLink = node.querySelector('a[href]');
  t.equal(theLink.getAttribute('role'), 'treeitem', 'Anchor gets role from "real" SRE node');
  t.equal(theLink.getAttribute('data-owns-id'), '9', 'Anchor gets data-owns-id from "real" SRE node');
  t.notOk(theLink.querySelector('[data-owns-id="9"]'), 'Anchor descendents do not have the same data-owns-id, i.e., removed from "real" SRE node.')
  t.equal(theLink.getAttribute('data-owns'), '2 6 3 7 4 8 5', 'Anchor gets data-owns from "real" SRE node');
  t.equal(theLink.getAttribute('aria-label'), 'l i n k link', 'Anchor gets aria-label from "real" SRE node');

  // "Outer"/"wrapping" links are "flattened" (not trees)
  out = await tex2svg('\\href{a}{b, c}');
  node = out.firstElementChild;
  sre2tree(node);
  theLink = node.querySelector('a[href]');
  t.equal(theLink.hasAttribute('role'), false, '"Wrapping Anchor" does not get role from "real" SRE node');
  t.equal(theLink.hasAttribute('data-owns-id'), false, '"Wrapping Anchor" does not get data-owns-id from "real" SRE node');
  t.notOk(theLink.querySelector(':not([role="presentation"])'), '"Wrapping Anchor" descendents are presentational.')
  t.equal(theLink.getAttribute('aria-label'), 'b comma c', '"Wrapping Anchor" gets aria-label from "real" SRE node'); //NOTE: as opposed to inner links, no added text "link" is needed here.


  // "flat" ( no semantic children) with "wrapping" link gets "wrapping link" treatment, not "flat" treatment
  out = await tex2svg('\\href{a}{b}');
  node = out.firstElementChild;
  sre2tree(node);

  theLink = node.querySelector('a[href]');
  t.equal(node.querySelector('svg').getAttribute('role'), 'presentation', '"Wrapping Anchor" with "flat" expression: svg is presentation');
  t.equal(theLink.hasAttribute('role'), false, '"Wrapping Anchor" with "flat" expression: does not get role from "real" SRE node');
  t.equal(theLink.hasAttribute('data-owns-id'), false, '"Wrapping Anchor" with "flat" expression: does not get data-owns-id from "real" SRE node');
  t.notOk(theLink.querySelector(':not([role="presentation"])'), '"Wrapping Anchor" with "flat" expression: descendents are presentational.')
  t.equal(theLink.getAttribute('aria-label'), 'b', '"Wrapping Anchor" with "flat" expression: gets aria-label from "real" SRE node'); //NOTE: as opposed to inner links, no added text "link" is needed here.

  // "wrapping links" root may not be first child
  out = await tex2svg('\\xhref[foo]{a}{b}');
  node = out.firstElementChild;
  sre2tree(node);

  t.equal(node.outerHTML, `<mjx-container class="MathJax" jax="SVG" overflow="overflow" display="true"><svg style="vertical-align: -0.525ex;" xmlns="http://www.w3.org/2000/svg" width="1.471ex" height="2.595ex" role="presentation" focusable="false" viewBox="0 -915 650 1147" xmlns:xlink="http://www.w3.org/1999/xlink"><defs role="presentation"><path role="presentation" id="MJX-6-NCM-I-1D44F" d="M281 445C245 445 209 428 174 394L243 679C241 688 238 694 226 694C193 694 120 685 107 684C92 682 84 675 84 660C84 650 93 645 112 645C131 645 157 646 157 632C157 628 152 608 143 571L63 249C52 207 47 173 47 148C47 62 93-11 175-11C240-11 297 22 347 89C392 151 415 216 415 283C415 370 364 445 281 445M279 415C318 415 337 385 337 326C337 299 331 263 319 218C297 133 268 75 233 44C213 27 194 19 175 19C134 19 114 51 114 115C114 137 119 170 129 214L151 304C154 319 159 330 165 338C204 389 242 415 279 415Z" /></defs><g role="presentation" stroke="currentColor" fill="currentColor" stroke-width="0" transform="scale(1,-1)"><g role="presentation" data-mml-node="math" data-latex="\\xhref[foo]{a}{b}" data-semantic-structure="0"><a aria-braillelabel="⠃" aria-label="b" href="a"><g role="presentation" data-mml-node="mpadded" data-ams-ref="foo" data-latex="\\xhref[foo]{a}{b}"><rect role="presentation" data-hitbox="true" fill="none" stroke="none" pointer-events="all" width="650" height="1147" x="0" y="-232" /><g role="presentation" transform="translate(110.5,0)"><g role="presentation" data-semantic-braille="⠃" data-mml-node="mi" data-latex="b" data-semantic-type="identifier" data-semantic-role="latinletter" data-semantic-font="italic" data-semantic-annotation="clearspeak:simple;nemeth:number;depth:1" data-semantic-id="0" data-semantic-attributes="latex:\\xhref[foo]{a}{b};href:a" data-semantic-postfix="link" data-semantic-speech="b"><use role="presentation" data-c="1D44F" xlink:href="#MJX-6-NCM-I-1D44F" /></g></g></g></a></g></g></svg></mjx-container>`, '"Wrapping Anchor" with layout snapshot');
});
