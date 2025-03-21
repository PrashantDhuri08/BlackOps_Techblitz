from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
import pandas as pd
from flask_cors import CORS


  # Allow all origins


# Initialize Flask app
app = Flask(__name__)

CORS(app)

# Load the trained model
model = tf.keras.models.load_model("air_quality_model.h5")

# Define the scaler (use the same scaler used for training)
scaler = StandardScaler()

# Load dataset to fit the scaler (ensure to use the original dataset)
data = pd.read_csv("./updated_pollution_dataset.csv")  # Load your dataset here
features = ['Temperature', 'Humidity', 'PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'Proximity_to_Industrial_Areas', 'Population_Density']
X = data[features]
scaler.fit(X)

def categorize_air_quality(predicted_value):
    if predicted_value >= 0.5:
        return "Good"
    elif 0 <= predicted_value < 0.5:
        return "Moderate"
    elif -0.5 <= predicted_value < 0:
        return "Unhealthy for Sensitive Groups"
    elif -1 <= predicted_value < -0.5:
        return "Unhealthy"
    else:
        return "Hazardous"

@app.route('/predict', methods=['POST'])
def predict_air_quality():
    try:
        # Get JSON data from the request
        input_data = request.get_json()

        # Extract features from input_data
        temp = input_data['Temperature']
        humidity = input_data['Humidity']
        pm25 = input_data['PM25']
        pm10 = input_data['PM10']
        no2 = input_data['NO2']
        so2 = input_data['SO2']
        co = input_data['CO']
        proximity = input_data['Proximity_to_Industrial_Areas']
        population_density = input_data['Population_Density']

        # Create a NumPy array for the input
        new_data = np.array([[temp, humidity, pm25, pm10, no2, so2, co, proximity, population_density]])
        # Scale the input
        new_data_scaled = scaler.transform(new_data)
        # Make prediction
        prediction = model.predict(new_data_scaled)
        predicted_value = float(prediction[0][0])
        
        # Get air quality category
        air_quality_category = categorize_air_quality(predicted_value)
        
        # Return the prediction and category as JSON
        return jsonify({"Predicted_Air_Quality": predicted_value, "Category": air_quality_category})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    # Run the Flask app
    app.run(debug=True)
