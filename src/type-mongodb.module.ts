import { DynamicModule, Module } from '@nestjs/common';
import { Newable } from 'type-mongodb';
import {
  TypeMongoDBModuleOptions,
  TypeMongoDBModuleAsyncOptions
} from './type-mongodb.interfaces';
import { TypeMongoDBCoreModule } from './type-mongodb-core.module';
import { TypeMongoDBFeatureModule } from './type-mongodb-feature.module';
import { TYPE_MONGODB_DEFAULT_CONNECTION } from './type-mongodb.constants';

@Module({})
export class TypeMongoDBModule {
  static forRoot(
    options?: TypeMongoDBModuleOptions,
    connectionName: string = TYPE_MONGODB_DEFAULT_CONNECTION
  ): DynamicModule {
    return {
      module: TypeMongoDBModule,
      imports: [TypeMongoDBCoreModule.register(connectionName, options)]
    };
  }

  static forRootAsync(
    options?: TypeMongoDBModuleAsyncOptions,
    connectionName: string = TYPE_MONGODB_DEFAULT_CONNECTION
  ): DynamicModule {
    return {
      module: TypeMongoDBModule,
      imports: [TypeMongoDBCoreModule.registerAsync(connectionName, options)]
    };
  }

  static forFeature(
    documents: Newable[],
    connectionName?: string
  ): DynamicModule {
    return {
      module: TypeMongoDBFeatureModule,
      imports: [TypeMongoDBFeatureModule.register(documents, connectionName)]
    };
  }
}
