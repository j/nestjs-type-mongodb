import { Document, Id, Field } from 'type-mongodb';
import { ObjectId } from 'mongodb';

@Document()
export class Cat {
  @Id()
  _id: ObjectId;

  @Field()
  name: string;

  @Field()
  age: number;

  @Field()
  breed: string;
}
