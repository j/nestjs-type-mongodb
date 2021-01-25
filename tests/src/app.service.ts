import { Injectable } from '@nestjs/common';
import { Dog } from './dogs/models/dog.model';
import { Cat } from './cats/models/cat.model';
import { DogsService } from './dogs/dogs.service';
import { CatsService } from './cats/cats.service';

@Injectable()
export class AppService {
  constructor(
    private readonly dogs: DogsService,
    private readonly cats: CatsService
  ) {}

  async findAll(): Promise<{ dogs: Dog[]; cats: Cat[] }> {
    return {
      dogs: await this.dogs.findAll(),
      cats: await this.cats.findAll()
    };
  }
}
