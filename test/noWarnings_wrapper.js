import tape from 'tape';
import{ exec} from 'node:child_process';

tape('rewriteNode warnings', (t) => {
    t.plan(1);
    exec(`node test/noWarnings.js`, (err, stdout, stderr) => {
        t.equal(stderr, '', 'No console warnings.');
    });
});
