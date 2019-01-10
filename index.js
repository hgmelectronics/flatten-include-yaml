#!/usr/bin/env node

const commander = require('commander');
const yaml = require('js-yaml');
const fs = require('fs');
const os = require('os');
const path = require('path');
const process = require('process');
const yamlinc = require('yaml-include');

generate = (def, generatorPath, output) => {
    const generator = require(fs.realpathSync(generatorPath));
    if (!generator) {
        throw 'Could not require() ' + src;
    }

    const content = generator(def);

    const target = output || src.replace(/\.[^.]*$/, ''); // strip final extension

    content = content.replace(/\n/g, os.EOL);

    const existing = fs.readFileSync(target, { encoding: 'utf8' });
    if (existing === content) {
        return 'upToDate';
    }
    else {
        fs.writeFileSync(target, content, { encoding: 'utf8' });
        return existing ? 'updated' : 'created';
    }
}

if (require.main === module) {
    commander
        .usage('[options] <input YAML file> ...')
        .option('-o --output [output-file]', 'Output file name; not valid with multiple inputs')
        .parse(process.argv);

    if (commander.args.length < 1 || (commander.args.length > 1 && commander.output)) {
        commander.outputHelp();
        process.exitCode = 1;
    }
    else {
        for (const src of commander.args) {
            const wd = process.cwd();
            try {
                let text = fs.readFileSync(src);
                process.chdir(path.dirname(src));
                const obj = yaml.safeLoad(text, { schema: yamlinc.YAML_INCLUDE_SCHEMA });
                text = yaml.safeDump(obj);
                let outPath;
                if (commander.output) {
                    if (path.isAbsolute(commander.output)) {
                        outPath = commander.output;
                    }
                    else {
                        outPath = path.join(wd, commander.output);
                    }
                }
                else {
                    const ext = path.extname(src);
                    const base = path.basename(src, ext);
                    outPath = `${base}-flat${ext}`;
                }
                fs.writeFileSync(outPath, text);
            }
            catch (err) {
                console.error(err);
                process.exitCode = 1;
                break;
            }
            finally {
                process.chdir(wd);
            }
        }
    }
}
