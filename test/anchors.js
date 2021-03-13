const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('anchors', (t) => {
  t.plan(4);
  const out = tex2svg('a  = \\href{//example.com}{link}');
  const svg = out.firstElementChild;
  sre2tree(svg);
  t.notOk(svg.querySelector('a').getAttribute('role') , 'anchors do not get role (presentation');
  t.equal(svg.querySelector('a > [data-semantic-speech]'), svg.querySelector('a > [data-href]'), 'Link "pushed" to first semantic child');
  t.equal(svg.querySelector('a').getAttribute('href'), svg.querySelector('a > [data-href]').getAttribute('data-href'), '"pushed" Link data-href value');
  t.ok(svg.querySelector('a > [data-href]').getAttribute('aria-label').endsWith(' link'), '"pushed" fake-link aria-label affordance');
});
