import { createConnection, getConnection, getConnectionManager } from 'typeorm';

export const createConnectionIfNecessary = async () => {
  try {
    getConnection().close().catch(e => {
      //NOP
    });
  } catch (e) {
  }
  await createConnection();
  await getConnection().synchronize(true);
};

export const closeConnectionIfNecessary = async () => {
  try {
    await getConnection().synchronize(true).catch(e => {});
  } catch (e) {

  }
  getConnection().close().catch(e => {});
};