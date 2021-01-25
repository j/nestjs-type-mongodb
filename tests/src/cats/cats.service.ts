import { Injectable } from '@nestjs/common';
import { DocumentManager, Repository } from 'type-mongodb';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './models/cat.model';
import { InjectDocumentManager } from '../../../src';

@Injectable()
export class CatsService {
  private readonly repository: Repository<Cat>;

  constructor(
    @InjectDocumentManager('second')
    private readonly dm: DocumentManager
  ) {
    this.repository = this.dm.getRepository(Cat);
  }

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    return this.repository.create(createCatDto);
  }

  async findAll(): Promise<Cat[]> {
    return this.repository.find().toArray();
  }
}
