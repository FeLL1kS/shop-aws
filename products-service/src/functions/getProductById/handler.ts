import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import { Product } from '../getProductsList/handler';
import { ConnectionOptions, createConnection } from 'mysql2';
import { promisify } from 'util';

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

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const connection = createConnection(dbOptions);
  
  const query = promisify(connection.query).bind(connection);
  const connect = promisify(connection.connect).bind(connection);

  await connect();
  
  let id = null;

  if (event.queryStringParameters && event.queryStringParameters.id) {
    id = event.queryStringParameters.id;
  }

  const product: Product = (await query(`SELECT * FROM Products WHERE id = ${id}`))[0];

  return formatJSONResponse({
    product
  });
};

export const main = middyfy(getProductById);
