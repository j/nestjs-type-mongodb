import { Inject } from '@nestjs/common';
import { Constructor } from 'type-mongodb';
import { getRepositoryToken, getDocumentManagerToken } from './utils';

export const InjectRepository = (
  document: Constructor,
  connectionName?: string
) => Inject(getRepositoryToken(document, connectionName));

export const InjectDocumentManager = (connectionName?: string) =>
  Inject(getDocumentManagerToken(connectionName));
