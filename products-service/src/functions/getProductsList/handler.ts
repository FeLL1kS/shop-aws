import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import { ConnectionOptions, createConnection,  } from 'mysql2';
import { promisify } from 'util';

export interface Product {
  id?: string;
  title: string;
  description: string;
  count: number;
  price: number;
}

const { MYSQL_HOST, MYSQL_PORT, MYSQL_DATABASE, MYSQL_USERNAME, MYSQL_PASSWORD } = process.env;

const dbOptions: ConnectionOptions = {
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT),
  database: MYSQL_DATABASE,
  user: MYSQL_USERNAME,
  password: MYSQL_PASSWORD,
  connectTimeout: 5000,
  ssl: {
    rejectUnauthorized: false
  }
}

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const connection = createConnection(dbOptions);
  
  const query = promisify(connection.query).bind(connection);
  const connect = promisify(connection.connect).bind(connection);

  await connect();

  // await query(`
  //   CREATE TABLE IF NOT EXISTS Products (
  //     id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  //     title VARCHAR(255),
  //     description TEXT,
  //     count INT,
  //     price DECIMAL(10, 2)
  //   )
  // `);

  // await query(`
  //   INSERT INTO Products (title, description, count, price) VALUES (
  //     { "Simple Car", "Just a Simple Car", 4, 1000 },
  //     { "Car", "Just a Car", 4, 10000 },
  //     { "Better Car", "Just a Better Car", 4, 100000 },
  //     { "The Best Car", "Just the Best Car", 4, 1000000 }
  //   )
  // `);

  const products: Product[] = await query(`SELECT * FROM Products`);

  return formatJSONResponse({
    products
  });
};

export const main = middyfy(getProductsList);
