import UniqueEntityId from '../value-object/unique-entity-id';

export default abstract class Entity<Props> {
  public readonly uniqueEntityId: UniqueEntityId;
  constructor(
    public readonly props: Props,
    id?: string,
  ) {
    this.uniqueEntityId = new UniqueEntityId(id);
  }
  get id(): string {
    return this.uniqueEntityId.value;
  }
  toJSON(): Required<{ id: string } & Props> {
    return {
      id: this.id,
      ...this.props,
    } as Required<{ id: string } & Props>;
  }
}
