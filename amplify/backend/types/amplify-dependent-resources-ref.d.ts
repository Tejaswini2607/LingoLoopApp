export type AmplifyDependentResourcesAttributes = {
  "auth": {
    "speechortextapp47cbd091": {
      "AppClientID": "string",
      "AppClientIDWeb": "string",
      "IdentityPoolId": "string",
      "IdentityPoolName": "string",
      "UserPoolArn": "string",
      "UserPoolId": "string",
      "UserPoolName": "string"
    }
  },
  "function": {
    "S3Trigger627ad9f6": {
      "Arn": "string",
      "LambdaExecutionRole": "string",
      "LambdaExecutionRoleArn": "string",
      "Name": "string",
      "Region": "string"
    }
  },
  "predictions": {
    "speechtotext": {
      "language": "string",
      "region": "string"
    },
    "texttospeech": {
      "language": "string",
      "region": "string",
      "voice": "string"
    }
  },
  "storage": {
    "autogen": {
      "BucketName": "string",
      "Region": "string"
    }
  }
}