import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

import productsList from './productsList.json';

export interface Product {
  id: string;
  title: string;
  description: string;
  count: number;
  price: number;
}

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  const products = productsList as Product[];

  return formatJSONResponse({
    products
  });
};

export const main = middyfy(getProductsList);
