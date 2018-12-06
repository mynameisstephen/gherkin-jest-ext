import { GenericTransformer } from 'stucumber-ext';
import { readFileSync } from 'fs';

require('source-map-support').install({
  environment: 'node',

  retrieveFile: (path: string) => {
    path = path.trim();

    if (!/\.feature$/.test(path)) {
      return null;
    }

    try {
      return process(readFileSync(path, 'utf8'), path);
    } catch (e) {
      return null;
    }
  }
});

export default function process(source: string, filename: string) {
  const transformer = new GenericTransformer({
    featureFn: 'describe',
    scenarioFn: 'it',
    beforeEachFn: 'beforeEach',
    afterEachFn: 'afterEach',
    beforeAllFn: 'beforeAll',
    afterAllFn: 'afterAll'
  });

  try {
    return transformer.transform(filename, source);
  } catch (e) {
    if (e.name === 'SyntaxError' && e.location) {
      fail(
        `${filename} (${e.location.start.line}, ${e.location.start.column}): ${
          e.message
        }`
      );
    } else {
      fail(`${e.name}: ${e.message}`);
    }
  }
}

function fail(message: string) {
  throw new Error(message);
}
