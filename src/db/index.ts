import { connect } from 'mongoose';

const host = process.env.MONGO_HOST || 'localhost';
const port = process.env.MONGO_PORT || 27017;
const database = process.env.MONGO_DATABASE || 'test';

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
