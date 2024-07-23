import { deepFreeze } from '../../utils/object';

export default abstract class ValueObject<Value> {
  protected readonly _value: Value;

  constructor(value: Value) {
    this._value = deepFreeze(value);
  }

  get value(): Value {
    return this._value;
  }
}
