
const dbConfig = () => {
   if (process.env.NODE_ENV === 'test') {
      return {
         username: process.env.BUDGET_TRACKER_TEST_DB_USERNAME,
         password: process.env.BUDGET_TRACKER_TEST_DB_PASSWORD,
         database: process.env.BUDGET_TRACKER_TEST_DB_NAME
      }
   }
   if (process.env.NODE_ENV !== 'production') {
      return {
         username: process.env.BUDGET_TRACKER_DEV_DB_USERNAME,
         password: process.env.BUDGET_TRACKER_DEV_DB_PASSWORD,
         database: process.env.BUDGET_TRACKER_DEV_DB_NAME
      }
   }
}

module.exports = {
   type: "postgres",
   host: "localhost",
   port: 5432,
   synchronize: true,
   logging: true,
   entities: [
      "src/entity/**/*.ts"
   ],
   migrations: [
      "src/migration/**/*.ts"
   ],
   subscribers: [
      "src/subscriber/**/*.ts"
   ],
   cli: {
      entitiesDir: "src/entity",
      migrationsDir: "src/migration",
      subscribersDir: "src/subscriber"
   },
   ...dbConfig()
}