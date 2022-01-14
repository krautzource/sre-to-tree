
const sre2tree = require('../lib');
const tex2svg = require('./tex2svg');

(async () => {
    const out = await tex2svg('\\begin{eqnarray} x \\tag{1} \\\\a \\tag{x}\\end{eqnarray}');
    const svg = out.firstElementChild;
    sre2tree(svg);
    const sreProperOwns = await tex2svg('= a{bc}');
    const sreProperOwnsSvg = sreProperOwns.firstElementChild;
    sre2tree(sreProperOwnsSvg);
})()
