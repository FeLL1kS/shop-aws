import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      sqs: {
        arn: 'arn:aws:sqs:eu-west-1:364156362749:products-service-queue',
        batchSize: 10,
      }
    },
  ],
};
