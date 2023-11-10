import { sre2tree } from '../lib.js'
import { tex2svg } from './tex2svg.js';

(async () => {
    const out = await tex2svg('\\begin{eqnarray} x \\tag{1} \\\\a \\tag{x}\\end{eqnarray}');
    const svg = out.firstElementChild;
    sre2tree(svg);
    const sreProperOwns = await tex2svg('= a{bc}');
    const sreProperOwnsSvg = sreProperOwns.firstElementChild;
    sre2tree(sreProperOwnsSvg);
})()
