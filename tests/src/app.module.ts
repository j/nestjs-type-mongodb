import { Module } from '@nestjs/common';
import { TypeMongoDBModule } from '../../src';
import { DogsModule } from './dogs/dogs.module';
import { CatsModule } from './cats/cats.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeMongoDBModule.forRoot({
      connection: {
        uri:
          'mongodb://localhost:31000,localhost:31001,localhost:31002/type_mongodb?replicaSet=test',
        database: 'type_mongodb'
      }
    }),
    TypeMongoDBModule.forRoot(
      {
        connection: {
          uri:
            'mongodb://localhost:31000,localhost:31001,localhost:31002/type_mongodb_second?replicaSet=test',
          database: 'type_mongodb_second'
        }
      },
      'second'
    ),
    DogsModule,
    CatsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
