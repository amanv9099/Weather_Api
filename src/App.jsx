import { useState } from 'react'
import './App.css'

const API_KEY = 'c98ddf6c8f5af931330b40793fb44a7a'

function App() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [weatherTheme, setWeatherTheme] = useState('')

  const fetchWeather = async () => {
    if (!city.trim()) {
      setError('Please enter a city name')
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)
    setWeatherTheme('')

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      )

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please check the city name.')
        } else if (response.status === 401) {
          throw new Error('Invalid API key.')
        } else {
          throw new Error('Failed to fetch weather data.')
        }
      }

      const data = await response.json()
      setWeather(data)
      
      // Set weather theme based on condition
      const condition = data.weather[0].main.toLowerCase()
      if (condition.includes('rain') || condition.includes('drizzle')) {
        setWeatherTheme('rain')
      } else if (condition.includes('thunder') || condition.includes('storm')) {
        setWeatherTheme('storm')
      } else if (condition.includes('snow')) {
        setWeatherTheme('snow')
      } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze') || condition.includes('smoke')) {
        setWeatherTheme('haze')
      } else if (condition.includes('cloud')) {
        setWeatherTheme('cloudy')
      } else if (condition.includes('clear') || condition.includes('sun')) {
        setWeatherTheme('sunny')
      } else {
        setWeatherTheme('')
      }
      
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchWeather()
    }
  }

  const getWeatherIcon = (condition) => {
    const icons = {
      clear: '☀️',
      clouds: '☁️',
      rain: '🌧️',
      drizzle: '🌦️',
      thunderstorm: '⛈️',
      snow: '❄️',
      mist: '🌫️',
      fog: '🌫️',
      haze: '🌫️',
      smoke: '🌫️',
    }
    
    const mainCondition = condition.toLowerCase()
    for (const key of Object.keys(icons)) {
      if (mainCondition.includes(key)) {
        return icons[key]
      }
    }
    return '🌤️'
  }

  return (
    <div className={`weather-card ${weatherTheme}`}>
      {/* Weather Animation Overlay */}
      {weatherTheme && (
        <div className="weather-animation">
          {weatherTheme === 'rain' && (
            <div className="rain-effect">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="rain-drop" style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}></div>
              ))}
            </div>
          )}
          {weatherTheme === 'storm' && (
            <div className="storm-effect">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="lightning" style={{ 
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}></div>
              ))}
            </div>
          )}
          {weatherTheme === 'snow' && (
            <div className="snow-effect">
              {[...Array(50)].map((_, i) => (
                <div key={i} className="snowflake" style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${3 + Math.random() * 4}s`
                }}></div>
              ))}
            </div>
          )}
          {weatherTheme === 'haze' && (
            <div className="haze-effect">
              {[...Array(25)].map((_, i) => (
                <div key={i} className="haze-particle" style={{ 
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${4 + Math.random() * 3}s`
                }}></div>
              ))}
            </div>
          )}
          {weatherTheme === 'cloudy' && (
            <div className="cloud-effect">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="cloud" style={{ 
                  left: `${i * 25 - 10}%`,
                  top: `${Math.random() * 30 + 5}%`,
                  animationDelay: `${i * 2}s`
                }}></div>
              ))}
            </div>
          )}
          {weatherTheme === 'sunny' && (
            <div className="sunny-effect">
              <div className="sun"></div>
              <div className="sun-ray"></div>
              <div className="sun-ray" style={{ transform: 'rotate(60deg)' }}></div>
              <div className="sun-ray" style={{ transform: 'rotate(120deg)' }}></div>
              <div className="sun-ray" style={{ transform: 'rotate(180deg)' }}></div>
              <div className="sun-ray" style={{ transform: 'rotate(240deg)' }}></div>
              <div className="sun-ray" style={{ transform: 'rotate(300deg)' }}></div>
            </div>
          )}
        </div>
      )}

      <div className="search-box">
        <input
          type="text"
          className="search-input"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="search-btn" onClick={fetchWeather}>
          Search
        </button>
      </div>

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <div className="error">
          <div className="error-message">{error}</div>
        </div>
      )}

      {!loading && !error && !weather && (
        <div className="initial-state">
          <div className="initial-icon">🌍</div>
          <p className="initial-text">Search for a city to get weather information</p>
        </div>
      )}

      {weather && !loading && !error && (
        <div className="weather-info">
          <h2 className="city-name">{weather.name}</h2>
          <p className="country">{weather.sys.country}</p>
          
          <div className="weather-icon">
            {getWeatherIcon(weather.weather[0].main)}
          </div>
          
          <div className="temperature">
            {Math.round(weather.main.temp)}<span>°C</span>
          </div>
          
          <p className="description">{weather.weather[0].description}</p>
          
          <div className="weather-details">
            <div className="detail-item">
              <span className="detail-icon">💧</span>
              <div className="detail-text">
                <span className="detail-label">Humidity</span>
                <span className="detail-value">{weather.main.humidity}%</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">💨</span>
              <div className="detail-text">
                <span className="detail-label">Wind Speed</span>
                <span className="detail-value">{weather.wind.speed} m/s</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">🌡️</span>
              <div className="detail-text">
                <span className="detail-label">Feels Like</span>
                <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
              </div>
            </div>
            
            <div className="detail-item">
              <span className="detail-icon">📊</span>
              <div className="detail-text">
                <span className="detail-label">Pressure</span>
                <span className="detail-value">{weather.main.pressure} hPa</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
