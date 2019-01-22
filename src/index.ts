import { initializeDB } from './db';
import logger from './logger';
import app from './server';

initializeDB().then(() => {
    app.listen(5000, () => {
        app.emit('appStarted');
        logger.log('info', 'App started on port 5000.');
    });
});