import { connect } from 'mongoose';
import config from '../config';

const host = config.db.host || 'localhost';
const port = config.db.port || 27017;
const database = config.db.database || 'test';

class Database {
  private static DB_URL = `mongodb://${host}:${port}/${database}`;

  static async createConnection() {
    try {
      await connect(this.DB_URL);
      console.log('Database connection successful');
    } catch (error) {
      console.log('Database connection failed', error);
    }
  }

  constructor() {
    console.log('Database constructor');
  }
}

export default Database;
