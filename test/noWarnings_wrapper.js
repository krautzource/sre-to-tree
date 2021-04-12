const test = require('tape');
const exec = require('child_process').exec;

test('rewriteNode warnings', (t) => {
    t.plan(1);
    exec(`node test/noWarnings.js`, (err, stdout, stderr) => {
        t.equal(stderr, '', 'No console warnings.');
    });
});
