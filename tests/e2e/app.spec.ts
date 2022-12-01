// import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DocumentManager } from 'type-mongodb';
import { getDocumentManagerToken } from '../../src/utils';
import {
  TypeMongoDBModule,
  TypeMongoDBModuleOptions,
  TypeMongoDBOptionsFactory
} from '../../src';
import { Dog } from '../src/dogs/models/dog.model';
import { Cat } from '../src/cats/models/cat.model';
import { Inject, Logger, Module } from '@nestjs/common';
import { CatsModule } from '../src/cats/cats.module';
import { DogsModule } from '../src/dogs/dogs.module';

const myLoggerProvider = { provide: 'my-logger', useValue: new Logger() };

class ConfigService implements TypeMongoDBOptionsFactory {
  constructor(@Inject('my-logger') private readonly logger: Logger) {}

  createTypeMongoDBOptions(): TypeMongoDBModuleOptions {
    return {
      uri:
        'mongodb://localhost:27017,localhost:27018,localhost:27019/type_mongodb?replicaSet=replicaset'
    };
  }

  getLogger() {
    return this.logger;
  }
}

@Module({
  imports: [
    TypeMongoDBModule.forRoot(
      {
        uri:
          'mongodb://localhost:27017,localhost:27018,localhost:27019/type_mongodb_second?replicaSet=replicaset'
      },
      'second'
    ),
    CatsModule,
    DogsModule
  ],
  providers: [ConfigService, myLoggerProvider],
  exports: [ConfigService]
})
export class ConfigModule {}

describe('App', () => {
  it('creates definitions', async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeMongoDBModule.forRoot({
          uri:
            'mongodb://localhost:27017,localhost:27018,localhost:27019/type_mongodb?replicaSet=replicaset'
        }),
        TypeMongoDBModule.forRootAsync(
          {
            useFactory: () => ({
              uri:
                'mongodb://localhost:27017,localhost:27018,localhost:27019/type_mongodb_second?replicaSet=replicaset'
            })
          },
          'second'
        ),
        TypeMongoDBModule.forFeature([Dog]),
        TypeMongoDBModule.forFeature([Cat], 'second')
      ]
    }).compile();

    // validate first DM created with proper models
    const dm1 = module.get<DocumentManager>(getDocumentManagerToken());
    expect(dm1).toBeInstanceOf(DocumentManager);
    expect(dm1.client.db().databaseName).toBe('type_mongodb');
    const metadata1 = [...dm1.metadataFactory.loadedDocumentMetadata.values()];
    expect(metadata1).toHaveLength(1);
    expect(metadata1[0].name).toEqual('Dog');

    // validate second DM created with proper models
    const dm2 = module.get<DocumentManager>(getDocumentManagerToken('second'));
    expect(dm2).toBeInstanceOf(DocumentManager);
    expect(dm2.client.db().databaseName).toBe('type_mongodb_second');
    const metadata2 = [...dm2.metadataFactory.loadedDocumentMetadata.values()];
    expect(metadata2).toHaveLength(1);
    expect(metadata2[0].name).toEqual('Cat');

    await Promise.all([dm1.close(), dm2.close()]);
  });

  it('registers async modules using class', async () => {
    const module = await Test.createTestingModule({
      imports: [
        TypeMongoDBModule.forRootAsync({
          useClass: ConfigService,
          providers: [myLoggerProvider]
        }),
        TypeMongoDBModule.forFeature([Dog])
      ]
    }).compile();

    // validate first DM created with proper models
    const dm = module.get<DocumentManager>(getDocumentManagerToken());
    expect(dm).toBeInstanceOf(DocumentManager);
    expect(dm.client.db().databaseName).toBe('type_mongodb');
    const metadata1 = [...dm.metadataFactory.loadedDocumentMetadata.values()];
    expect(metadata1).toHaveLength(1);
    expect(metadata1[0].name).toEqual('Dog');

    await dm.close();
  });

  it('registers async modules using existing module', async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule,
        TypeMongoDBModule.forRootAsync({
          useExisting: ConfigService,
          imports: [ConfigModule]
        }),
        TypeMongoDBModule.forFeature([Dog])
      ]
    }).compile();

    // validate first DM created with proper models
    const dm1 = module.get<DocumentManager>(getDocumentManagerToken());
    expect(dm1).toBeInstanceOf(DocumentManager);
    expect(dm1.client.db().databaseName).toBe('type_mongodb');
    const metadata1 = [...dm1.metadataFactory.loadedDocumentMetadata.values()];
    expect(metadata1).toHaveLength(1);
    expect(metadata1[0].name).toEqual('Dog');

    // validate second DM created with proper models
    const dm2 = module.get<DocumentManager>(getDocumentManagerToken('second'));
    expect(dm2).toBeInstanceOf(DocumentManager);
    expect(dm2.client.db().databaseName).toBe('type_mongodb_second');
    const metadata2 = [...dm2.metadataFactory.loadedDocumentMetadata.values()];
    expect(metadata2).toHaveLength(1);
    expect(metadata2[0].name).toEqual('Cat');

    await Promise.all([dm1.close(), dm2.close()]);
  });
});
