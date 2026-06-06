/**
 * tests/unit/helpers.test.js
 * ===================================================================
 * Unit tests for src/utils/helpers.js
 * ===================================================================
 */

const { paginate, pick, sanitize, toSlug } = require('../../src/utils/helpers');

describe('paginate()', () => {
  const items = Array.from({ length: 23 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));

  test('should return correct page data', () => {
    const result = paginate(items, 1, 10);
    expect(result.data).toHaveLength(10);
    expect(result.meta.page).toBe(1);
    expect(result.meta.pageSize).toBe(10);
    expect(result.meta.totalPages).toBe(3);
    expect(result.meta.hasMore).toBe(true);
  });

  test('should handle last page correctly', () => {
    const result = paginate(items, 3, 10);
    expect(result.data).toHaveLength(3); // 23 - 20 = 3 remaining
    expect(result.meta.hasMore).toBe(false);
  });
});

describe('pick()', () => {
  test('should return only the specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });
});

describe('sanitize()', () => {
  test('should remove null and undefined values', () => {
    const obj = { a: 1, b: null, c: undefined, d: 'hello' };
    expect(sanitize(obj)).toEqual({ a: 1, d: 'hello' });
  });
});

describe('toSlug()', () => {
  test('should convert string to URL-friendly slug', () => {
    expect(toSlug('Hello World!')).toBe('hello-world');
    expect(toSlug('  Some   Special Chars  ')).toBe('some-special-chars');
  });
});
