import { join } from 'path';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'allah',
  database: 'ideasapi',
  synchronize: true,
  logging: true,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
};
