import json
import boto3
import os

# Initialize SageMaker runtime client
sagemaker_runtime = boto3.client('sagemaker-runtime')

# Environment variable for the SageMaker endpoint name
SAGEMAKER_ENDPOINT_NAME = os.environ['SAGEMAKER_ENDPOINT_NAME']

def lambda_handler(event, context):
    # Extract input data from the frontend (assuming JSON input)
    input_data = json.loads(event['body'])
    
    # Convert input data to the format expected by the SageMaker model
    payload = json.dumps(input_data)

    try:
        # Call the SageMaker endpoint
        response = sagemaker_runtime.invoke_endpoint(
            EndpointName=SAGEMAKER_ENDPOINT_NAME,
            ContentType='application/json',
            Body=payload
        )
        
        # Read response
        result = json.loads(response['Body'].read().decode())
        
        # Return the response to the frontend
        return {
            'statusCode': 200,
            'body': json.dumps(result)
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
