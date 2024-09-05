import { spawnSync } from 'node:child_process';
import { suite } from "./suite";

suite("cli", (test) => {
  test("runs cli (help)", (assert) => {
    const { stdout } = spawnSync('tsx', ['src/cli.ts', '-h'], {
      encoding: 'utf8'
    });
    assert(stdout.includes('--input'));
  });

  test("runs cli (input only)", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '-i', 'test/all.json'
    ], {
      encoding: 'utf8'
    });
    assert(!stderr);
  });

  test("runs cli (noImport)", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '-i', 'test/all.json',
      '--noImport'
    ], {
      encoding: 'utf8'
    });
    assert(!stderr);
  });

  test("runs cli (stdin only)", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts'
    ], {
      input: '{"type": "any"}',
      encoding: 'utf8'
    });
    assert(!stderr);
  });

  test("runs cli (output)", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '--output', 'test/output/output.js',
      '-i', 'test/all.json'
    ], {
      encoding: 'utf8'
    });
    assert(!stderr);
  });

  test("runs cli (output with depth)", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '--output', 'test/output/output.js',
      '-i', 'test/all.json',
      '-d', '2'
    ], {
      encoding: 'utf8'
    });
    assert(!stderr);
  });

  test("cli should err with with missing input", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '--output', 'test/output/output.js'
    ], {
      encoding: 'utf8'
    });
    assert(stderr.includes('Unexpected end of JSON input'));
  });

  test("cli should err with with bad depth", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '--output', 'test/output/output.js',
      '-i', 'test/all.json',
      '-d', 'abc'
    ], {
      encoding: 'utf8'
    });
    assert(stderr.includes('Value of argument depth must be a valid number'));
  });

  test("cli should err with with missing depth", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '--output', 'test/output/output.js',
      '-i', 'test/all.json',
      '-d'
    ], {
      encoding: 'utf8'
    });
    assert(stderr.includes('Expected a value for argument depth'));
  });

  test("cli should err with bad array value", (assert) => {
    const { stderr } = spawnSync('tsx', [
      'src/cli.ts',
      '--output', 'test/output/output.js',
      '-i', 'test/all.json',
      '-m', 'notAModule'
    ], {
      encoding: 'utf8'
    });
    assert(stderr.includes('Value of argument module must be one of esm,cjs,none'));
  });
});
