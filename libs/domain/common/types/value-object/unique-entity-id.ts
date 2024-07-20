import { v4, validate } from 'uuid';
import ValueObject from './value-object';
import { InvalidEntityIdError } from '../../errors/invalid-entity-id.error';

export default class UniqueEntityId extends ValueObject<string> {
  uuidValidate = validate;
  constructor(readonly id?: string) {
    super(id || v4());
    this.UuidValidate();
  }
  private UuidValidate() {
    const isValid = this.uuidValidate(this._value);
    if (!isValid) {
      throw new InvalidEntityIdError('Entity Id must be an UUID');
    }
  }
}
