type StackValue = string | boolean;

class NorRpn {
  private operators: string[];
  private operatorLetters: string;

  public constructor() {
    this.operators = ['and', 'or'];
    this.operatorLetters = this.operators.join(''); // 'and', 'or'
  }

  /**
 * 逆波兰表达式计算
 * @param  {String} formula 管理端自定义的公式
 * @param  {Array} values 计算出来的条件的值
 * @param  {Boolean} strict 严格等于模式
 * @return {Boolean}
 */
  public calculate(formula: string, values: any[], strict = true) {
    const rpn = this.getReversePolishNotation(this.parseString(formula))
      .map(item => this.valuation(item, values, strict));

    let v1: StackValue;
    let v2: StackValue;
    const stack: StackValue[] = [];
    rpn.forEach((value) => {
      switch (value) {
        case 'and':
          v2 = (stack.pop() as StackValue);
          v1 = (stack.pop() as StackValue);
          stack.push(v1 && v2);
          break;
        case 'or':
          v2 = (stack.pop() as StackValue);
          v1 = (stack.pop() as StackValue);
          stack.push(v1 || v2);
          break;
        default:
          stack.push(value);
      }
    });

    return stack[0];
  }

  public getReversePolishNotation(infixAry: string[]): string[] {
    let operator;
    const operators: string[] = [];
    const output: string[] = [];

    infixAry.forEach((value) => {
      switch (value) {
        case 'and':
        case 'or':
          if (operators.length) {
            operator = operators.pop();
            while (operator && operator !== '(') {
              output.push(operator);
              operator = operators.pop();
            }
            if (operator) {
              operators.push(operator);
            }
          }
          operators.push(value);
          break;
        case '(':
          operators.push(value);
          break;
        case ')':
          operator = operators.pop();
          while (operator !== '(') {
            if (!operator) {
              throw new Error('Brackets are inconsistent');
            }
            output.push(operator);
            operator = operators.pop();
          }
          break;
        default:
          output.push(value);
      }
    });

    while (operators.length) {
      output.push((operators.pop() as string));
    }

    return output;
  }

  public parseString(str: string): string[] {
    const infix = str.replace(/\s+/g, '').toLowerCase();
    const parts = [];
    let part = '';
    let index = 0;

    while (index < infix.length) {
      const value = infix[index];

      if (value === '(' || value === ')') {
        if (part) {
          parts.push(part);
          part = '';
        }
        parts.push(value);
      } else if (this.isSameType(value, infix[index + 1])) {
        part += value;
      } else {
        part += value;
        parts.push(part);
        part = '';
      }

      index += 1;
    }
    if (part) {
      parts.push(part);
    }
    return parts;
  }

  public valuation(item: string, values: any[], strict = true): StackValue {
    if (this.isKeyword(item)) {
      return item;
    }

    const value = values[+item - 1];
    if (strict) {
      return value === true;
    }

    return value !== false;
  }

  private isSameType(target: string, source: string) {
    return this.isKeyword(target) === this.isKeyword(source);
  }

  private isKeyword(letter: string) {
    return this.operatorLetters.includes(letter);
  }
}

export default NorRpn;
