import 'reflect-metadata';
import { createConnection } from 'typeorm';

const initializeDB = async () => {
  await createConnection();
};

export { initializeDB };