# Introduction

A simple wrapper for [`yaml-include`](https://www.npmjs.com/package/yaml-include) - reads in files using include tags and writes them back out as a flat YAML. It is not necessary to run `flatten-include-yaml` from the same directory as the input YAML file; it will temporarily change to that directory while loading.

# Usage

`flatten-include-yaml [options] <input file> ...`

Multiple input YAML files can be passed on one command line. Note that this does not make sense with the `-o`,`--output` option.

## Options

### `-o`, `--output`
Specifies the output file to be written. The default is the name of the input file with `-flat` inserted before the extension; `foo.yaml` &rarr; `foo-flat.yaml`, `bar.yml` &rarr; `bar-flat.yml`.
