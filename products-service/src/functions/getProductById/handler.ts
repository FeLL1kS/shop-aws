import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import productsList from '../getProductsList/productsList.json';

import { Product } from '../getProductsList/handler';

const getProductById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let id = null;

  if (event.queryStringParameters && event.queryStringParameters.id) {
    id = event.queryStringParameters.id;
  }

  const products = productsList as Product[];
  const product = products.filter(product => product.id === id)[0];

  return formatJSONResponse({
    product
  });
};

export const main = middyfy(getProductById);
