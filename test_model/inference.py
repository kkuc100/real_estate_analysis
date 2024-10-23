import xgboost as xgb
import json
import numpy as np
import os
import yaml

def load_config():
    with open('config.yaml', 'r') as file:
        return yaml.safe_load(file)

def model_fn(model_dir):
    model_path = os.path.join(model_dir, 'xgb_model.json')
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
        # Extract postal_code and median_listing_price_yy from the input
        zipcode = float(csv_data[0])  # Assuming the first column is zipcode
        price = float(csv_data[1])     # Assuming the second column is price
        # Convert to a NumPy array for prediction
        features = np.array([[zipcode, price]])
        return features
    else:
        raise ValueError(f"Unsupported content type: {request_content_type}")

def predict_fn(input_data, model):
    # Make a prediction
    dmatrix_input = xgb.DMatrix(input_data, feature_names=['zipcode', 'price'])
    prediction = model.predict(dmatrix_input)
    return prediction

def output_fn(prediction, response_content_type):
    # Format the prediction output
    predicted_class = np.argmax(prediction[0])
    if response_content_type == 'application/json':
        return json.dumps({'predictions': int(predicted_class)})
    elif response_content_type == 'text/csv':
        return f"{int(predicted_class)}"  # Return as a CSV string
    else:
        raise ValueError(f"Unsupported content type: {response_content_type}")

# Optional: load configuration when the script is run
if __name__ == "__main__":
    config = load_config()
    print(config)  # For debugging purposes, you might want to log this instead
