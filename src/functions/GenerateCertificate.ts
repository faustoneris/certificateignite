import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/DynamodbClients";

interface ICreateCertificate {
  id: string;
  name: string;
  grade: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, name, grade } = JSON.parse(event.body) as ICreateCertificate;

  await document
    .put({
      TableName: "users_certificate",
      Item: {
        id,
        name,
        grade,
        created_at: new Date(),
      },
    })
    .promise();

  const response = await document
    .query({
      TableName: "users_certificate",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    })
    .promise();
  // id, name, grade
  return {
    statusCode: 201,
    body: JSON.stringify(response.Items[0]),
  };
};
