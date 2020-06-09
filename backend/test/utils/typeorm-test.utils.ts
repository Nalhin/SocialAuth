import { Connection, getConnection } from 'typeorm';

export class TypeOrmTestUtils {
  private connection: Connection;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('NODE_ENV !== test');
    }
  }

  async startServer() {
    this.connection = await getConnection();
  }

  async closeServer() {
    await this.connection.close();
  }

  saveOne = async (entity) => {
    try {
      const repository = this.connection.getRepository(entity.constructor.name);
      return await repository.save(entity);
    } catch (e) {
      throw new Error(
        `Error saving entity: ${entity.constructor.name}
        ${e}`,
      );
    }
  };

  saveMany = async (entities) => {
    const savedEntities: any[] = [];

    for (const entity of entities) {
      try {
        const repository = this.connection.getRepository(
          entity.constructor.name,
        );
        const savedEntity = await repository.save(entity);
        savedEntities.push(savedEntity);
      } catch (e) {
        throw new Error(
          `Error saving entity: ${entity.constructor.name}
          ${e}`,
        );
      }
    }
    return savedEntities;
  };
}
