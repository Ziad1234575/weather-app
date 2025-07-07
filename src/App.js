import axios from 'axios';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default function App() { 
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Riyadh');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=4090c8f261ca43e9ba8101314250707&q=${city}&aqi=no`
      );
      setWeather(response.data);
      setError(null);
    } catch (err) {
      setError('المدينة غير موجودة. الرجاء إدخال اسم مدينة صحيح.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather();
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="input-group-custom">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="أدخل اسم المدينة"
          className="form-control"
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جاري البحث...' : 'بحث'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {weather && !loading && (
        <div className="weather-info">
          <h1 className="city-name">{weather.location.name}, {weather.location.country}</h1>
          <p className="weather-description">{weather.current.condition.text}</p>
          <p className="local-time">الوقت المحلي: {new Date(weather.location.localtime).toLocaleTimeString()}</p>
          
          <div className="weather-icon-container">
            <img
              className="weather-icon"
              src={weather.current.condition.icon}
              alt={weather.current.condition.text}
            />
          </div>
          
          <div className="temperature">
            {Math.round(weather.current.temp_c)}
            <span className="temperature-unit">°C</span>
          </div>
          
          <div className="additional-info">
            <div className="info-item">
              <div className="info-label">الشعور</div>
              <div className="info-value">{Math.round(weather.current.feelslike_c)}°C</div>
            </div>
            <div className="info-item">
              <div className="info-label">الرطوبة</div>
              <div className="info-value">{weather.current.humidity}%</div>
            </div>
            <div className="info-item">
              <div className="info-label">سرعة الرياح</div>
              <div className="info-value">{weather.current.wind_kph} كم/س</div>
            </div>
            <div className="info-item">
              <div className="info-label">الرؤية</div>
              <div className="info-value">{weather.current.vis_km} كم</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
