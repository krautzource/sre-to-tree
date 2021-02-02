const test = require('tape');
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

test('rewriteNode warnings', (t) => {
  t.plan(1);
  const out = tex2svg('\\begin{eqnarray} x \\tag{1} \\\\a \\tag{x}\\end{eqnarray}');
  const svg = out.firstElementChild;
  sre2tree(svg);
  t.ok(true , 'FAKE TEST - check there were no console warnings!');
});
