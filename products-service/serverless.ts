import type { AWS } from '@serverless/typescript';

import hello from '@functions/hello';
import getProductsList from '@functions/getProductsList';
import getProductById from '@functions/getProductById';

const serverlessConfiguration: AWS = {
  service: 'products-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      MYSQL_HOST: 'production-cluster.cun6p4lzyohj.eu-west-1.rds.amazonaws.com',
      MYSQL_PORT: '3306',
      MYSQL_DATABASE: 'production',
      MYSQL_USERNAME: 'admin',
      MYSQL_PASSWORD: 'BxXGW1ZibbUL0KT4ow8l'
    },
  },
  // import the function via paths
  functions: { hello, getProductsList, getProductById },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
