import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as appsync from "aws-cdk-lib/aws-appsync";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as path from "path";

export class NotesAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const notesTable = new dynamodb.Table(this, "NotesTable", {
      tableName: "Notes",
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "dateCreated", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    notesTable.addGlobalSecondaryIndex({
      indexName: "sentiment-dateCreated-index",
      partitionKey: { name: "sentiment", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "dateCreated", type: dynamodb.AttributeType.STRING },
    });

    notesTable.addGlobalSecondaryIndex({
      indexName: "userId-dateCreated-index",
      partitionKey: { name: "userId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "dateCreated", type: dynamodb.AttributeType.STRING },
    });

    const userPool = new cognito.UserPool(this, "NotesUserPool", {
      userPoolName: "NotesUserPool",
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
      autoVerify: {
        email: true,
      },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const userPoolClient = new cognito.UserPoolClient(
      this,
      "NotesUserPoolClient",
      {
        userPool,
        generateSecret: false,
        authFlows: {
          userPassword: true,
          userSrp: true,
        },
      }
    );

    const api = new appsync.GraphqlApi(this, "NotesApi", {
      name: "NotesApi",
      definition: appsync.Definition.fromFile(
        path.join(__dirname, "schema.graphql")
      ),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: cdk.Expiration.after(cdk.Duration.days(365)),
          },
        },
        additionalAuthorizationModes: [
          {
            authorizationType: appsync.AuthorizationType.USER_POOL,
            userPoolConfig: {
              userPool: userPool,
            },
          },
        ],
      },
      xrayEnabled: true,
    });

    const createNoteFunction = new lambda.Function(this, "CreateNoteFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "resolvers/createNote")),
      environment: {
        NOTES_TABLE_NAME: notesTable.tableName,
      },
    });

    const getNotesFunction = new lambda.Function(this, "GetNotesFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(path.join(__dirname, "resolvers/getNotes")),
      environment: {
        NOTES_TABLE_NAME: notesTable.tableName,
      },
    });

    notesTable.grantReadWriteData(createNoteFunction);
    notesTable.grantReadData(getNotesFunction);

    const createNoteDataSource = api.addLambdaDataSource(
      "CreateNoteDataSource",
      createNoteFunction
    );

    const getNotesDataSource = api.addLambdaDataSource(
      "GetNotesDataSource",
      getNotesFunction
    );

    createNoteDataSource.createResolver("CreateNoteResolver", {
      typeName: "Mutation",
      fieldName: "createNote",
    });

    getNotesDataSource.createResolver("GetNotesResolver", {
      typeName: "Query",
      fieldName: "getNotes",
    });

    new cdk.CfnOutput(this, "GraphQLAPIURL", {
      value: api.graphqlUrl,
      description: "GraphQL API URL",
    });

    new cdk.CfnOutput(this, "GraphQLAPIKey", {
      value: api.apiKey || "",
      description: "GraphQL API Key",
    });

    new cdk.CfnOutput(this, "Region", {
      value: this.region,
      description: "AWS Region",
    });

    new cdk.CfnOutput(this, "UserPoolId", {
      value: userPool.userPoolId,
      description: "Cognito User Pool ID",
    });

    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
      description: "Cognito User Pool Client ID",
    });
  }
}
