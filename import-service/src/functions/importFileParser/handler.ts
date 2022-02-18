import { middyfy } from '@libs/lambda';
import { S3Event } from 'aws-lambda';
import * as AWS from 'aws-sdk'
import { Options, parse } from 'csv-parse';
import { promisify } from 'util';

interface Product {
  title: string;
  description: string;
  count: number;
  price: number;
}

const BUCKET = 'fe-import-service';

const importFileParser = async (event: S3Event) => {
  if (!event.Records.length) {
    return {
      statusCode: 400 
    }
  }

  const parsePromise = promisify<Buffer | string, Options, any>(parse);

  const s3 = new AWS.S3({ region: 'eu-west-1' });
  const sqs = new AWS.SQS({ region: 'eu-west-1' });

  const record = event.Records[0];

  const params: AWS.S3.GetObjectRequest = {
    Bucket: BUCKET,
    Key: record.s3.object.key
  }

  const s3Object = await s3.getObject(params).promise();

  const products: Product[] = await parsePromise(s3Object.Body.toString(), {
    delimiter: ',',
    columns: ['title', 'description', 'price', 'count']
  })

  console.log(process.env.SQS_URL);

  for (const product of products) {
    const response = await sqs.sendMessage({
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(product)
    }).promise()
    console.log(response)
  }

  return {
    statusCode: 202,
    products
  }
};

export const main = middyfy(importFileParser);
