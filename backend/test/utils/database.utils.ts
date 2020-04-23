import { Injectable } from '@nestjs/common';
import { Connection, getConnection } from 'typeorm';

@Injectable()
export class TestUtils {

  constructor(private connection: Connection) {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('ERROR-TEST-UTILS-ONLY-FOR-TESTS');
    }
  }

  async shutdownServer(server) {
    await server.httpServer.close();
    await this.closeDbConnection();
  }

  async closeDbConnection() {
    const connection = await this.connection;
    if (connection.isConnected) {
      await (await this.connection).close();
    }
  }

  async getEntities() {
    const entities = [];
    (await this.connection).entityMetadatas.forEach(x =>
      entities.push({ name: x.name, tableName: x.tableName }),
    );
    return entities;
  }

  async cleanAll() {
    const entities = this.connection.entityMetadatas;

    for (const entity of entities) {
      const repository = this.connection.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName};`);
    }
  }

  async saveEntities(...entities) {
    for (const entity of entities) {
      try {
        const repository = await getConnection().getRepository(
          entity.constructor.name,
        );
        await repository.save(entity);
      } catch (e) {
        throw new Error(
          `ERROR: Saving entity: ${entity.constructor.name} \n ${e}`,
        );
      }
    }
  }

}
