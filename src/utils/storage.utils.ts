import { DocumentClass, DocumentManager } from 'type-mongodb';

export class Storage {
  private static documents = new Map<string, Set<DocumentClass>>();
  private static dms = new Map<string, DocumentManager>();

  static addDocuments(
    documents: DocumentClass[],
    connectionName: string
  ): void {
    if (!this.documents.has(connectionName)) {
      this.documents.set(connectionName, new Set(documents));
    } else {
      documents.forEach((document) =>
        this.documents.get(connectionName).add(document)
      );
    }
  }

  static getDocuments(connectionName: string): DocumentClass[] {
    if (!this.documents.has(connectionName)) {
      throw new Error(
        `Documents for connection "${connectionName}" do not exist`
      );
    }

    return [...this.documents.get(connectionName)];
  }

  static addDocumentManager(connectionName: string, dm: DocumentManager): void {
    if (!this.dms.has(connectionName)) {
      this.dms.set(connectionName, dm);
    }
  }

  static getDocumentManagers(): DocumentManager[] {
    return [...this.dms.values()];
  }
}
