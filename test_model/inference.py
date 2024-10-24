import xgboost as xgb
import json
import numpy as np
import os

def model_fn(model_dir):
    model_path = os.path.join(model_dir, 'xgb_model.pkl')
    model = xgb.Booster()
    try:
        model.load_model(model_path)
    except Exception as e:
        print(f"Error loading model: {e}")
        raise
    return model

def input_fn(request_body, request_content_type):
    # Parse the input data for prediction
    if request_content_type == 'text/csv':
        # Split the CSV input string into a list
        csv_data = request_body.split(',')
        # Extract postal_code and median_listing_price from the input
        postal_code = float(csv_data[0])  # Assuming the first column is zipcode
        median_listing_price = float(csv_data[1])  # Assuming the second column is price
        # Convert to a NumPy array for prediction
        features = np.array([[postal_code, median_listing_price]])
        return features
    else:
        raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(input_data, model):
    # Make a prediction
    dmatrix_input = xgb.DMatrix(input_data, feature_names=['postal_code', 'median_listing_price'])
    prediction = model.predict(dmatrix_input)
    return prediction.tolist()  # Return the prediction directly as a list

def output_fn(prediction, response_content_type):
    # Format the prediction output
    if response_content_type == 'application/json':
        return json.dumps({'predictions': prediction})  # Return the predicted value
    elif response_content_type == 'text/csv':
        return f"{prediction[0]}"  # Return as a CSV string
    else:
        raise ValueError(f"Unsupported content type: {response_content_type}")

# No config loading needed
if __name__ == "__main__":
    print("Inference script is running.")
