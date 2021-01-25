import { Inject } from '@nestjs/common';
import { Newable } from 'type-mongodb';
import { getRepositoryToken, getDocumentManagerToken } from './utils';

export const InjectRepository = (document: Newable, connectionName?: string) =>
  Inject(getRepositoryToken(document, connectionName));

export const InjectDocumentManager = (connectionName?: string) =>
  Inject(getDocumentManagerToken(connectionName));
