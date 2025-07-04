// import mongoose from 'mongoose';

// export class MongoDBClient {
//     static async connect() {
//         try {
//             const conn = await mongoose.connect((process.env.MONGODB_URI + "/" + process.env.MONGODB_DB_NAME) || 'mongodb://localhost:27017/birbnb');
//             console.log(`MongoDB is connected: ${conn.connection.host}`);
//         } catch (error) {
//             console.error(`Error: ${error.message}`);
//             process.exit(1);
//         }
//     }
// }

import mongoose from 'mongoose';

export class MongoDBClient {
  static async connect() {
    try {
      const uri =
        process.env.MONGODB_URI && process.env.MONGODB_DB_NAME
          ? `${process.env.MONGODB_URI}/${process.env.MONGODB_DB_NAME}`
          : 'mongodb://localhost:27017/birbnb';

      const conn = await mongoose.connect(uri);

      console.log(`MongoDB is connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
  }
}
