import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './models/cat.model';
import { TypeMongoDBModule } from '../../../src';

@Module({
  imports: [TypeMongoDBModule.forFeature([Cat], 'second')],
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
