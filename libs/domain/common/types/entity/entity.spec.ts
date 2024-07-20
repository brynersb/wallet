import { InvalidEntityIdError } from '../../errors/invalid-entity-id.error';
import { deepFreeze } from '../../utils/object';
import { uuidRegEx } from '../../utils/uuidRegEx';
import Entity from './entity';

describe('Entity unit test', () => {
  interface DummyProps {
    prop1: string;
    prop2: string;
  }
  class DummyClass extends Entity<DummyProps> {
    private _prop1;
    private _prop2;
    constructor(props: DummyProps, id?: string) {
      super(props, id);
      this._prop1 = props.prop1;
      this._prop2 = props.prop2;
    }
  }

  const dummyObject = new DummyClass({ prop1: 'prop1', prop2: 'prop2' }, '7d25ec8e-28ae-408b-a2f0-e273fec958f5');

  test('entity id', () => {
    expect(uuidRegEx.test(dummyObject.id)).toBeTruthy();

    const invalidId = '100';
    const error = new InvalidEntityIdError('Entity Id must be an UUID');
    expect(() => new DummyClass({ prop1: 'prop1', prop2: 'prop2' }, invalidId)).toThrowError(error);
  });

  it('should return JSON', () => {
    const id = '77ee83f8-3afd-4bd5-a541-e8d1f45c46fc';
    const dummyObject = new DummyClass({ prop1: 'prop1', prop2: 'prop2' }, id);
    console.log(dummyObject.toJSON());
    expect(dummyObject.toJSON()).toStrictEqual(
      JSON.parse(`{ "id": "77ee83f8-3afd-4bd5-a541-e8d1f45c46fc", "prop1": "prop1", "prop2": "prop2" }`),
    );
  });

  it('should return the original object reference', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
      },
    };
    const frozenObj = deepFreeze(obj);
    expect(frozenObj).toBe(obj);
  });
});
