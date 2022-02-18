import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      s3: {
        bucket: 'fe-import-service',
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: 'files/'
          }
        ],
        existing: true
      }
    },
  ],
};
