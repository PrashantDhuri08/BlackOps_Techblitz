// 

import React, { useState } from "react";
import axios from "axios";

const AirQualityApp = () => {
  const [formData, setFormData] = useState({
    Temperature: "",
    Humidity: "",
    PM25: "",
    PM10: "",
    NO2: "",
    SO2: "",
    CO: "",
    Proximity_to_Industrial_Areas: "",
    Population_Density: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      setPrediction(response.data);
    } catch {
      setError("Error fetching prediction. Please check your inputs and try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-extrabold text-center text-gray-800">
          🌍 Air Quality Prediction
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key} className="relative">
              <input
                type="number"
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={key.replace(/_/g, " ")}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <label
                className="absolute -top-2 left-3 bg-white px-1 text-xs font-bold text-gray-500 transform transition-all duration-200"
              >
                {key.replace(/_/g, " ")}
              </label>
            </div>
          ))}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 transition duration-300"
          >
            Predict
          </button>
        </form>
        {prediction && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md shadow-inner text-center space-y-2">
            <p className="text-lg font-medium text-gray-700">
              Predicted Air Quality:{" "}
              <strong className="text-blue-600">{prediction.Predicted_Air_Quality.toFixed(2)}</strong>
            </p>
            <p className="text-lg font-medium text-gray-700">
              Category: <strong className="text-green-600">{prediction.Category}</strong>
            </p>
          </div>
        )}
        {error && (
          <p className="text-center text-red-500 font-semibold">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default AirQualityApp;
