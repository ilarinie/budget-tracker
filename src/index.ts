import { getConnection } from 'typeorm';
import { initializeDB } from './db';
import app from './server';

interface Server {
    close: () => void;
}

let server: Server;

initializeDB().then(() => {
    server = app.listen(5000, () => {
        app.emit('appStarted');
    });
});

export { app, server };