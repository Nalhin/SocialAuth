import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../src/app.module';
import { TypeOrmTestUtils } from '../../utils/typeorm-test.utils';
import { GraphqlConfigService } from '../../../src/config/graphql.config';
import { GraphqlTestConfigService } from '../../config/graphql.config';
import { TypeOrmConfigService } from '../../../src/config/typeorm.config';
import { TypeOrmTestConfigService } from '../../config/typeorm.config';
import { INestApplication } from '@nestjs/common';

export interface E2EApp {
  app: INestApplication;
  dbTestUtils: TypeOrmTestUtils;
  cleanup: () => void;
}

export async function initializeApp() {
  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [AppModule, TypeOrmTestUtils],
  })
    .overrideProvider(GraphqlConfigService)
    .useClass(GraphqlTestConfigService)
    .overrideProvider(TypeOrmConfigService)
    .useClass(TypeOrmTestConfigService)
    .compile();

  const app = moduleRef.createNestApplication();
  await app.init();

  const dbTestUtils = app.get(TypeOrmTestUtils);
  await dbTestUtils.startServer();

  const cleanup = async () => {
    await dbTestUtils.closeServer();
    await app.close();
  };

  return { app, dbTestUtils, cleanup };
}
