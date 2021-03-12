const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('anchors', (t) => {
  t.plan(1);
  const out = tex2svg('a  = \\href{//example.com}{link}');
  const svg = out.firstElementChild;
  sre2tree(svg);
  t.notOk(svg.querySelector('a').getAttribute('role') , 'anchors do not get role (presentation');
});
