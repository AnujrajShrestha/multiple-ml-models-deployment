const HEART_API_URL =
  import.meta.env.VITE_HEART_API_URL;

const MENTAL_HEALTH_API_URL =
  import.meta.env.VITE_MENTAL_HEALTH_API_URL;

const HOUSE_API_URL =
  import.meta.env.VITE_HOUSE_API_URL;

const EmailSpamDetection_API_URL=
import.meta.env.VITE_EMAIL_DETECTION_API_URL;

const CarPricePrediction_API_URL=
import.meta.env.VITE_CAR_PRICE_PREDICTION_API_URL;

const StudentPlacementPrediction_API_URL=
import.meta.env.VITE_STUDENT_PLACEMENT_API_URL;

const WeatherPrediction_API_URL=
import.meta.env.VITE_WEATHER_PREDICTION_API_URL


async function request(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
  } catch {
    throw new Error(
      "Unable to connect to the API. Check that the FastAPI server is running and the API URL is correct."
    );
  }

  let body = null;

  try {
    body = await response.json();
  } catch {
    // Keep body null for non-JSON responses.
  }

  if (!response.ok) {
    const detail =
      body?.detail ||
      body?.message ||
      `API request failed with status ${response.status}.`;

    throw new Error(
      typeof detail === "string"
        ? detail
        : JSON.stringify(detail)
    );
  }

  return body;
}


export async function predictHeartDisease(payload) {
  return request(`${HEART_API_URL}/predict`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function getHeartMetrics() {
  return request(`${HEART_API_URL}/api/metrics`);
}


export async function predictMentalHealth(payload) {
  return request(`${MENTAL_HEALTH_API_URL}/predict`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}


export async function predictHousePrice(payload) {
  return request(`${HOUSE_API_URL}/predict`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function predictEmailSpam(payload){
  return request(`${EmailSpamDetection_API_URL}/predict`,{
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function predictCarPrice(payload){
  return request(`${CarPricePrediction_API_URL}/predict`,{
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function predictStudentPlacement(payload){
  return request(`${StudentPlacementPrediction_API_URL}/predict`,{
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function predictWeather(payload){
  return request(`${WeatherPrediction_API_URL}/predict`,{
    method: 'POST',
    body: JSON.stringify(payload)
  });
}


export {
  HEART_API_URL,
  MENTAL_HEALTH_API_URL,
  HOUSE_API_URL,
  EmailSpamDetection_API_URL,
  CarPricePrediction_API_URL,
  StudentPlacementPrediction_API_URL,
  WeatherPrediction_API_URL
};