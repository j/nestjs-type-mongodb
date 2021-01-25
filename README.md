<h1 align="center" style="border-bottom: none;">nestjs-type-mongodb</h1>
<p align="center">
    A <a href="https://github.com/j/type-mongodb">type-mongodb</a> module for <a href="https://github.com/nestjs/nest">Nest.js</a>.
</p>

<p align="center">
    <a href="https://www.npmjs.com/~jrdn" target="_blank"><img src="https://img.shields.io/npm/v/nestjs-type-mongodb.svg" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/~jrdn" target="_blank"><img src="https://img.shields.io/npm/l/nestjs-type-mongodb.svg" alt="Package License" /></a>
    <a href="https://www.npmjs.com/~jrdn" target="_blank"><img src="https://img.shields.io/npm/dm/nestjs-type-mongodb.svg" alt="NPM Downloads" /></a>
</p>

## Installation

```bash
$ yarn add nestjs-type-mongodb
```

## Basic usage

**app.module.ts**

```typescript
import { Module } from "@nestjs/common";
import { TypeMongoDBModule } from 'nestjs-type-mongodb';
import { DogsModule } from "./dog.module.ts";

@Module({
  imports: [
    TypeMongoDBModule.forRoot({
      connection: {
        uri: 'mongodb://localhost:31000/animals?replicaSet=test',
        database: 'animals'
      }
    }),
    DogsModule
  ]
})
export class AppModule {}
```

Create class that describes your schema

**dog.model.ts**

```typescript
import { Document, Id, Field } from 'type-mongodb';
import { ObjectId } from 'mongodb';

@Document()
export class Dog {
  @Id()
  _id: ObjectId;

  @Field()
  name: string;

  @Field()
  age: number;

  @Field()
  breed: string;
}
```

Inject Dog for `DogsModule`

**dog.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { TypeMongoDBModule } from 'nestjs-type-mongodb';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';
import { Dog } from './models/dog';

@Module({
    imports: [
        TypeMongoDBModule.forFeature([Dog])
    ],
    controllers: [DogsController],
    providers: [DogsService]
})
export class DogsModule { }
```

Get the dog repository in a service

**dogs.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from 'nestjs-type-mongodb';
import { Repository } from 'type-mongodb';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './models/dog';

@Injectable()
export class DogsService {
    constructor(
        @InjectRepository(Dog)
        private readonly repository: Repository<Dog>
    ) { }

    async create(dog: CreateDogDto): Promise<Dog> {
        return this.repository.create(dog);
    }

    async findAll(): Promise<Dog[]> {
        return this.repository.find().toArray();
    }
}
```


## Test

```bash
# e2e tests
$ npm run test:e2e
```

## Stay in touch

- Author - [Jordan Stout](https://github.com/j)

## License

`nestjs-type-mongodb` is [MIT licensed](LICENSE).