import { join } from 'path';
import { safePush, createResolver } from '../src/util';

describe('safePush', () => {
  it('doesn\'t push null or undefined', () => {
    const arr: any[] = [];

    safePush(arr, null, undefined);

    expect(arr.length).toBe(0);
  });

  it('pushes regular objects as expected', () => {
    const arr: any[] = [];
    const item1 = { foo: 1 };
    const item2 = { bar: 2 };

    safePush(arr, item1, item2);

    expect(arr.length).toBe(2);
    expect(arr[0]).toBe(item1);
    expect(arr[1]).toBe(item2);
  });
});

describe('createResolver', () => {
  it('places resolved uri in the correct spot', () => {
    const initialPath = join('test', 'path');
    const subDir = 'indent//';
    const subPaths = ['wow', 'deeper'];

    const resolved = createResolver(initialPath)(subDir, ...subPaths);

    expect(resolved).toContain(initialPath);
    expect(resolved.startsWith(initialPath)).toBeTruthy();
    expect(resolved.endsWith(join(subDir, ...subPaths))).toBeTruthy();
  });
});
