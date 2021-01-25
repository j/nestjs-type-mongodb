export const DEFAULT_CONNECTION = 'DEFAULT';

export function getModulePrefixToken(connectionName?: string) {
  return `TYPE_MONGODB_${(connectionName || DEFAULT_CONNECTION).toUpperCase()}`;
}

export function getDocumentManagerOptionsToken(connectionName?: string) {
  return `${getModulePrefixToken(connectionName)}_DOCUMENT_MANAGER_OPTIONS}`;
}

export function getDocumentManagerToken(connectionName?: string) {
  return `${getModulePrefixToken(connectionName)}_DOCUMENT_MANAGER`;
}

export function getRepositoryToken(entity: Function, connectionName?: string) {
  return `${getModulePrefixToken(connectionName)}_${entity.name}Repository`;
}
