import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PetsModule } from './pets.module';
import { PetsService } from './pets.service';
import { AppModule } from '../app.module';

describe('Cats', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it(`/GET pets`, () => {
    return request(app.getHttpServer())
      .get('/pets')
      .expect(200)
  });

  afterAll(async () => {
    await app.close();
  });
});