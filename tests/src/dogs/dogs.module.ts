import { Module } from '@nestjs/common';
import { DogsController } from './dogs.controller';
import { DogsService } from './dogs.service';
import { Dog } from './models/dog.model';
import { TypeMongoDBModule } from '../../../src';

@Module({
  imports: [TypeMongoDBModule.forFeature([Dog])],
  controllers: [DogsController],
  providers: [DogsService],
  exports: [DogsService]
})
export class DogsModule {}
