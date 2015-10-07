'use strict';

const aws = require('aws-sdk');

const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

function awsRoutes(server) {

  server.route({
    method: 'GET',
    path: '/sign-s3',
    config: {
      auth: 'user'
    },
    handler: function (request, reply) {
      aws.config.update({
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY
      });

      const s3 = new aws.S3();
      const s3Params = {
        Bucket: AWS_BUCKET_NAME,
        Key: request.query.file_name,
        Expires: 60,
        ContentType: request.query.file_type,
        ACL: 'public-read'
      };

      s3.getSignedUrl('putObject', s3Params, function (err, data) {
        if (err) {
          console.error(err);
          return reply(err);
        }

        const replyData = {
          signed_request: data,
          url: 'https://' + AWS_BUCKET_NAME + '.s3.amazonaws.com/' + request.query.file_name
        };

        return reply(replyData);
      });
    }
  });
}

module.exports = awsRoutes;
