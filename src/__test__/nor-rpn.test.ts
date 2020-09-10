import NORRpn from '../index';

describe('rpn transform', () => {
  const instance = new NORRpn();
  const s1 = instance.parseString('1 and 2 or 3');
  const s2 = instance.parseString('1 OR 2 AND 3');
  const s3 = instance.parseString('1 and (2 or 3)');
  const s4 = instance.parseString('1 and ((2 or 3) and 4)');
  const s5 = instance.parseString('1 and 2 or 3)'); // error expression

  test('parse string', () => {
    expect(s1).toEqual(['1', 'and', '2', 'or', '3']);
    expect(s2).toEqual(['1', 'or', '2', 'and', '3']);
    expect(s3).toEqual(['1', 'and', '(', '2', 'or', '3', ')']);
    expect(s4).toEqual(['1', 'and', '(', '(', '2', 'or', '3', ')', 'and', '4', ')']);
  });

  test('getReversePolishNotation', () => {
    expect(instance.getReversePolishNotation(s1)).toEqual(['1', '2', 'and', '3', 'or']);
    expect(instance.getReversePolishNotation(s2)).toEqual(['1', '2', 'or', '3', 'and']);
    expect(instance.getReversePolishNotation(s3)).toEqual(['1', '2', '3', 'or', 'and']);
    expect(instance.getReversePolishNotation(s4)).toEqual(['1', '2', '3', 'or', '4', 'and', 'and']);
    try {
      instance.getReversePolishNotation(s5);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error).toHaveProperty('message', 'Brackets are inconsistent');
    }
  });
});

describe('valuation', () => {
  const instance = new NORRpn();
  let isStrict;

  test('valuation base', () => {
    expect(instance.valuation('and', [])).toBe('and');
    expect(instance.valuation('1', [true])).toBe(true);
    expect(instance.valuation('2', [true, false])).toBe(false);
  });

  test('valuation strict', () => {
    isStrict = true;
    expect(instance.valuation('1', [true], isStrict)).toBe(true);
    expect(instance.valuation('2', [true], isStrict)).toBe(false); // 序号2的值在数组中未定义
  });

  test('valuation non strict', () => {
    isStrict = false;
    expect(instance.valuation('1', [null], isStrict)).toBe(true);
    expect(instance.valuation('2', [true], isStrict)).toBe(true); // 序号2的值在数组中未定义
  });
});

describe('rpn calculate', () => {
  const instance = new NORRpn();
  let isStrict;

  test('calculate strict', () => {
    expect(instance.calculate('1 and 2', [true, true])).toBe(true);
    expect(instance.calculate('1 or 2', [false, true])).toBe(true);
    expect(instance.calculate('(1 or 2) and 3', [true, false, true])).toBe(true);
  });

  test('calculate strict', () => {
    isStrict = true;
    expect(instance.calculate('1 and 2', [true], isStrict)).toBe(false);
    expect(instance.calculate('1 or 2', [false], isStrict)).toBe(false);
    expect(instance.calculate('(1 or 2) and 3', [true], isStrict)).toBe(false);
  });

  test('calculate non strict', () => {
    isStrict = false;
    expect(instance.calculate('1 and 2', [true], isStrict)).toBe(true);
    expect(instance.calculate('1 or 2', [false], isStrict)).toBe(true);
    expect(instance.calculate('1 or 2', [true], isStrict)).toBe(true);
  });
});
