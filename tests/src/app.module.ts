import { Module } from '@nestjs/common';
import { TypeMongoDBModule } from '../../src';
import { DogsModule } from './dogs/dogs.module';
import { CatsModule } from './cats/cats.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';

@Module({
  imports: [
    TypeMongoDBModule.forRoot({
      uri:
        'mongodb://localhost:27017,localhost:27018,localhost:27019/type_mongodb?replicaSet=replicaset'
    }),
    TypeMongoDBModule.forRoot(
      {
        uri:
          'mongodb://localhost:27017,localhost:27018,localhost:27019/type_mongodb_second?replicaSet=replicaset'
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
