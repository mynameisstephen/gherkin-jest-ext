import { cucumber } from '../lib';
import { HookType, FeatureContext } from 'stucumber-ext';
import * as fs from 'fs';
import * as path from 'path';

interface World {
  a?: number;
  b?: number;
  answer?: number;
}

cucumber.defineCreateWorld(async () => ({
  a: null,
  b: null,
  answer: null
}));

cucumber.defineRule(
  /^I have numbers (\d+) and (\d+)$/,
  (world: World, a: string, b: string) => {
    // use a promise to test using promises
    return new Promise(resolve => {
      process.nextTick(() => {
        world.a = parseInt(a);
        world.b = parseInt(b);
        resolve();
      });
    });
  }
);

cucumber.defineRule(
  /^I (add|subtract|multiply|divide) them$/,
  (world: World, op: string) => {
    switch (op) {
      case 'add':
        world.answer = world.a + world.b;
        break;
      case 'subtract':
        world.answer = world.a - world.b;
        break;
      case 'multiply':
        world.answer = world.a * world.b;
        break;
      case 'divide':
        world.answer = world.a / world.b;
        break;
    }
  }
);

cucumber.defineRule(/^I get (\d+)$/, (world: World, answer: string) => {
  expect(world.answer).toBe(parseInt(answer));
});
