import { createConnection, getConnection, getConnectionManager } from 'typeorm';

export const createConnectionIfNecessary = async () => {
  getConnection().close().catch(e => {
    //NOP
  });
  await createConnection();
  await getConnection().synchronize(true);
};

export const closeConnectionIfNecessary = async () => {
    await getConnection().synchronize(true).catch(e => {});
    getConnection().close().catch(e => {});
};