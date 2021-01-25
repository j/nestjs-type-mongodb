import { Injectable } from '@nestjs/common';
import { Repository } from 'type-mongodb';
import { CreateDogDto } from './dto/create-dog.dto';
import { Dog } from './models/dog.model';
import { InjectRepository } from '../../../src';

@Injectable()
export class DogsService {
  constructor(
    @InjectRepository(Dog) private readonly repository: Repository<Dog>
  ) {}

  async create(createDogDto: CreateDogDto): Promise<Dog> {
    return this.repository.create(createDogDto);
  }

  async findAll(): Promise<Dog[]> {
    return this.repository.find().toArray();
  }
}
