const { average } = require('../utils/for_testing');

describe('average', () => {
  test('one value is the value itself', () => {
    expect(average([1])).toBe(1);
  });

  test('should calculate average of many numbers', () => {
    expect(average([1, 2, 3, 4, 5, 6])).toBe(3.5);
  });

  test('should be zero if empty array', () => {
    expect(average([])).toBe(0);
  });
});
