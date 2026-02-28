import { DataSource } from 'typeorm';
import { config } from './config';
import { User } from './entities/User';
import { Payment } from './entities/Payment';
import { AccessRestriction } from './entities/AccessRestriction';
import { StudentLog } from './entities/StudentLog';

export const AppDataSource = new DataSource({
  type: config.db.type as any,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.name,
  synchronize: config.env === 'development', // Only in development!
  logging: config.env === 'development',
  entities: [User, Payment, AccessRestriction, StudentLog],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};
