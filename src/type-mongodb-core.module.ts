import {
  DynamicModule,
  Global,
  Logger,
  Module,
  OnApplicationShutdown,
  Provider
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { DocumentManager } from 'type-mongodb';
import {
  TypeMongoDBModuleAsyncOptions,
  TypeMongoDBModuleOptions,
  TypeMongoDBOptionsFactory
} from './type-mongodb.interfaces';
import {
  Storage,
  getDocumentManagerToken,
  getDocumentManagerOptionsToken
} from './utils';

@Global()
@Module({})
export class TypeMongoDBCoreModule implements OnApplicationShutdown {
  private readonly logger = new Logger('TypeMongoDBModule');

  async onApplicationShutdown() {
    // close all the known document managers
    await Promise.all(
      Storage.getDocumentManagers().map(
        (dm) =>
          new Promise((resolve, reject) => {
            if (dm && dm.client().isConnected()) {
              try {
                resolve(dm.close());
              } catch (e) {
                this.logger.error(e?.message);
                reject(e);
              }
            }
          })
      )
    );
  }

  static register(
    connectionName: string,
    options: TypeMongoDBModuleOptions
  ): DynamicModule {
    const providers = [
      this.createDocumentManagerOptionsProvider(connectionName, options),
      this.createDocumentManagerProvider(connectionName)
    ];

    return {
      module: TypeMongoDBCoreModule,
      providers,
      exports: providers
    };
  }

  static registerAsync(
    connectionName: string,
    options: TypeMongoDBModuleAsyncOptions
  ): DynamicModule {
    const providers = [
      ...(options.providers || []),
      ...this.createAsyncDocumentManagerProviders(connectionName, options),
      this.createDocumentManagerProvider(connectionName)
    ];

    return {
      module: TypeMongoDBCoreModule,
      imports: options.imports || [],
      providers,
      exports: providers
    };
  }

  private static createDocumentManagerOptionsProvider(
    connectionName: string,
    options: TypeMongoDBModuleOptions
  ): Provider {
    return {
      provide: getDocumentManagerOptionsToken(connectionName),
      useValue: options
    };
  }

  private static createDocumentManagerProvider(
    connectionName: string
  ): Provider {
    return {
      provide: getDocumentManagerToken(connectionName),
      useFactory: async (
        options: TypeMongoDBModuleOptions,
        moduleRef: ModuleRef
      ) => {
        const dm = await DocumentManager.create({
          ...options,
          documents: Storage.getDocuments(connectionName),
          container: {
            get: async (Repository: any): Promise<any> => {
              return moduleRef.create(Repository);
            }
          }
        });

        Storage.addDocumentManager(connectionName, dm);

        return dm;
      },
      inject: [getDocumentManagerOptionsToken(connectionName), ModuleRef]
    };
  }

  private static createAsyncDocumentManagerProviders(
    connectionName: string,
    options: TypeMongoDBModuleAsyncOptions
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [
        this.createAsyncDocumentManagerOptionsProvider(connectionName, options)
      ];
    }

    if (options.useClass) {
      return [
        this.createAsyncDocumentManagerOptionsProvider(connectionName, options),
        { provide: options.useClass, useClass: options.useClass }
      ];
    }

    throw new Error(
      'Invalid type-mongodb async options: one of `useClass`, `useExisting` or `useFactory` should be defined.'
    );
  }

  private static createAsyncDocumentManagerOptionsProvider(
    connectionName: string,
    options: TypeMongoDBModuleAsyncOptions
  ): Provider {
    if (options.useFactory) {
      return {
        provide: getDocumentManagerOptionsToken(connectionName),
        useFactory: options.useFactory,
        inject: options.inject || []
      };
    }

    const inject = [];

    if (options.useClass || options.useExisting) {
      inject.push(options.useClass ?? options.useExisting!);
    }

    return {
      provide: getDocumentManagerOptionsToken(connectionName),
      useFactory: async (optionsFactory: TypeMongoDBOptionsFactory) =>
        await optionsFactory.createTypeMongoDBOptions(),
      inject
    };
  }
}
