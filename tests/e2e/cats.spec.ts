import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Server } from 'http';
import request from 'supertest';
import { DocumentManager, removeDocuments } from 'type-mongodb';
import { AppModule } from '../src/app.module';
import { getDocumentManagerToken } from '../../src/utils';

describe('Cats', () => {
  let server: Server;
  let app: INestApplication;
  let dm: DocumentManager;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = module.createNestApplication();
    server = app.getHttpServer();
    app.enableShutdownHooks();
    await app.init();

    dm = app.get(getDocumentManagerToken('second'));
    await removeDocuments(dm);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return created document', (done) => {
    const createDto = {
      name: 'Charlie',
      breed: 'Persian',
      age: 5
    };

    request(server)
      .post('/cats')
      .send(createDto)
      .expect(201)
      .end((err, { body }) => {
        expect(err).toBeFalsy();
        expect(body.name).toEqual(createDto.name);
        expect(body.age).toEqual(createDto.age);
        expect(body.breed).toEqual(createDto.breed);
        done();
      });
  });
});
