import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = process.env.AWS_BUCKET_REGION || ""; //e.g. "us-east-1"
const ACCESS_KEY_ID = process.env.AWS_PUBLIC_KEY || ""; //e.g. "us-east-1"
const SECRET_ACCES_KEY = process.env.AWS_SECRET_KEY || ""; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCES_KEY,
  },
});
export { s3Client };
