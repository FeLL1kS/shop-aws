import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import * as AWS from 'aws-sdk'

import schema from './schema';

const BUCKET = 'fe-import-service';

const importProductsFile: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const params = {
    Bucket: BUCKET,
    Key: `files/${event.pathParameters.fileName}`,
    Expires: 60,
    ContentType: 'text/csv'
  }
  let result = '';
  
  try {
    result = await s3.getSignedUrlPromise('putObject', params);
  } catch (error) {
    console.error(error);
  }
  
  return formatJSONResponse({
    result
  });
};

export const main = middyfy(importProductsFile);
