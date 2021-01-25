import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { DocumentClass, DocumentManager, Newable } from 'type-mongodb';
import { getDocumentManagerToken, getRepositoryToken, Storage } from './utils';
import { TYPE_MONGODB_DEFAULT_CONNECTION } from './type-mongodb.constants';

@Global()
@Module({})
export class TypeMongoDBFeatureModule {
  static register(
    documents: DocumentClass[],
    connectionName: string = TYPE_MONGODB_DEFAULT_CONNECTION
  ): DynamicModule {
    Storage.addDocuments(documents, connectionName);

    const providers = this.createDocumentProviders(documents, connectionName);

    return {
      module: TypeMongoDBFeatureModule,
      providers,
      exports: providers
    };
  }

  private static createDocumentProviders(
    documents: Newable[],
    connectionName: string = TYPE_MONGODB_DEFAULT_CONNECTION
  ): Provider[] {
    const providers: Provider[] = [];

    for (const document of documents) {
      providers.push({
        provide: getRepositoryToken(document, connectionName),
        useFactory: (dm: DocumentManager) => {
          return dm.getRepository(document);
        },
        inject: [getDocumentManagerToken(connectionName)]
      });
    }

    return providers;
  }
}
