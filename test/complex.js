import tape from 'tape';
import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

tape('complex SRE output', async (t) => {
    t.plan(1);
    const textCase1 = '\\begin{empheq} [left = \\empheqlbrace \\,]{align} b \\tag{1}\\end{empheq}';   // unusually structured SRE output from Speech-Rule-Engine/speech-rule-engine#729

    const out = await tex2svg(textCase1);
    const svg = out.firstElementChild;
    sre2tree(svg); // NOTE with SVG output, rewrite the SVG node cf. krautzource/sre-to-tree#6

    t.equal(svg.getAttribute('aria-label'), 'left brace StartLayout 1st Row  with Label left parenthesis 1 right parenthesis EndLabel b EndLayout', 'Top-level aria-label'); // NOTE: merely a sort of snapshot test for now

});
