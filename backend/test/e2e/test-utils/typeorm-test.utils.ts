import { Connection, getConnection } from 'typeorm';

export interface Class<T> extends Function {
  new(...args: any[]): T;
}

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

  saveOne = async <T>(entity: T): Promise<T> => {
    try {
      const name = (entity as unknown as Class<T>).constructor.name;
      const repository = this.connection.getRepository(name);
      return await repository.save(entity);
    } catch (e) {
      throw new Error(
        `Error saving entity: ${name}
        ${e}`,
      );
    }
  };

  saveMany = async <T>(entities: T[]): Promise<T[]> => {
    const savedEntities: T[] = [];

    for (const entity of entities) {
      try {
        const name = (entity as unknown as Class<T>).constructor.name;
        const repository = this.connection.getRepository(
          name,
        );
        const created = repository.create({...entity}) as T;
        const savedEntity = await repository.save(created);
        savedEntities.push(savedEntity);
      } catch (e) {
        throw new Error(
          `Error saving entity: ${name}
          ${e}`,
        );
      }
    }
    return savedEntities;
  };
}
