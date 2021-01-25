import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Dog } from './dogs/models/dog.model';
import { Cat } from './cats/models/cat.model';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async findAll(): Promise<{ dogs: Dog[]; cats: Cat[] }> {
    return this.appService.findAll();
  }
}
