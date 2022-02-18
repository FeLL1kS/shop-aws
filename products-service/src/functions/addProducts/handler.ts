import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import { ConnectionOptions, createConnection } from 'mysql2';
import { promisify } from 'util';
import { SQSEvent } from 'aws-lambda';
import { Product } from '@functions/getProductsList/handler';

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

const addProducts = async (event: SQSEvent) => {
  console.log(event);
  const connection = createConnection(dbOptions);
  
  const query = promisify(connection.query).bind(connection);
  const connect = promisify(connection.connect).bind(connection);

  await connect();

  const values: string[] = [];

  for (const record of event.Records) {
    const product: Product = JSON.parse(record.body);

    values.push(`("${product.title}", "${product.description}", ${product.count}, ${product.price})`)
  }
  console.log(values);
  try {
    await query(`
      INSERT INTO Products (title, description, count, price) VALUES ${values.join(', ')}
    `)
  } catch (error) {
    return formatJSONResponse({
      error: error.message
    })
  }

  return formatJSONResponse({
    message: 'Products added'
  });
};

export const main = middyfy(addProducts);
