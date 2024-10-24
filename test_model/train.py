import pandas as pd
import yaml
import tarfile
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score
import pickle

def save_model(model, path):
    """Save the XGBoost model to a file."""
    model.save_model(path)

def main():
    # Prepare features and target
    df = pd.read_csv("../Data/test_model_data.csv")
    X = df[['postal_code','median_listing_price']]
    y = df['percentile_label']

    with open("./config.yaml", "r") as config_file:
        config = yaml.safe_load(config_file)

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, **config["train_test_split"])

    # Create and train the XGBoost model
    model = XGBClassifier(**config["model_params"])  # Assuming model parameters are in a separate key
    model.fit(X_train, y_train)

    # Make predictions on the test set
    y_pred = model.predict(X_test)

    # Calculate and print accuracy
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Accuracy: {accuracy * 100:.2f}%")

    # Assuming 'model' is your trained XGBoost model
    with open('./xgb_model.pkl', 'wb') as f:
        pickle.dump(model, f)

    # Create tar.gz file containing the model and other necessary files
    with tarfile.open("./xgboost_model.tar.gz", "w:gz") as tar:
        tar.add("./xgb_model.pkl", arcname="xgb_model.pkl")
        tar.add("./inference.py", arcname="inference.py")

if __name__ == "__main__":
    main()

