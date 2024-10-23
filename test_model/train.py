import pandas as pd
import yaml
import tarfile
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier
from sklearn.metrics import accuracy_score

def save_model(model, path):
    """Save the XGBoost model to a file."""
    model.save_model(path)

def main():
    # Prepare features and target
    df = pd.read_csv("../data/realtor_dataset.csv")
    X = df[['zipcode', 'price']]
    y = df['risklevel']

    with open("../config.yaml", "r") as config_file:
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

    # Save the trained model
    save_model(model, "../xgb_model.json")

    # Create tar.gz file containing the model and other necessary files
    with tarfile.open("../xgboost_model.tar.gz", "w:gz") as tar:
        tar.add("../xgb_model.json", arcname="xgb_model.json")
        tar.add("../inference.py", arcname="inference.py")
        tar.add("../config.yaml", arcname="config.yaml")

if __name__ == "__main__":
    main()

