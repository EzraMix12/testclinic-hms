// DateTime and Weather Widget for Daraga, Albay, Philippines
// Uses OpenWeatherMap API for real-time weather data

class DateTimeWeather {
    constructor() {
        this.location = 'Daraga, Albay, PH';
        this.lat = 13.1603; // Daraga, Albay coordinates
        this.lon = 123.6939;
        this.apiKey = 'YOUR_API_KEY_HERE'; // User needs to add their own key
        this.weatherCache = null;
        this.cacheExpiry = null;
        this.useCache = true; // Cache for 10 minutes to avoid API limits
        
        this.init();
    }

    init() {
        this.updateDateTime();
        this.updateWeather();
        
        // Update time every second
        setInterval(() => this.updateDateTime(), 1000);
        
        // Update weather every 10 minutes
        setInterval(() => this.updateWeather(), 600000);
    }

    updateDateTime() {
        const now = new Date();
        
        // Format date: "Wednesday, October 7, 2026"
        const dateOptions = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            timeZone: 'Asia/Manila'
        };
        const dateStr = now.toLocaleDateString('en-US', dateOptions);
        
        // Format time: "2:30:45 PM"
        const timeOptions = {
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
            timeZone: 'Asia/Manila'
        };
        const timeStr = now.toLocaleTimeString('en-US', timeOptions);
        
        // Update DOM
        const dateElement = document.getElementById('current-date');
        const timeElement = document.getElementById('current-time');
        
        if (dateElement) dateElement.textContent = dateStr;
        if (timeElement) timeElement.textContent = timeStr;
    }

    async updateWeather() {
        // Check cache first
        if (this.useCache && this.weatherCache && this.cacheExpiry && Date.now() < this.cacheExpiry) {
            this.displayWeather(this.weatherCache);
            return;
        }

        try {
            // Try to fetch from OpenWeatherMap (free tier allows 60 calls/minute, 1M calls/month)
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${this.lat}&lon=${this.lon}&units=metric&appid=${this.apiKey}`
            );
            
            if (!response.ok) {
                throw new Error('Weather API unavailable');
            }
            
            const data = await response.json();
            
            // Cache the result
            this.weatherCache = data;
            this.cacheExpiry = Date.now() + 600000; // 10 minutes
            
            this.displayWeather(data);
        } catch (error) {
            console.log('Weather API not configured, using fallback data');
            this.displayFallbackWeather();
        }
    }

    displayWeather(data) {
        const tempElement = document.getElementById('weather-temp');
        const descElement = document.getElementById('weather-desc');
        const iconElement = document.getElementById('weather-icon');
        const locationElement = document.getElementById('weather-location');
        
        if (tempElement) {
            tempElement.textContent = `${Math.round(data.main.temp)}°C`;
        }
        
        if (descElement) {
            const description = data.weather[0].description;
            descElement.textContent = description.charAt(0).toUpperCase() + description.slice(1);
        }
        
        if (iconElement) {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            iconElement.src = iconUrl;
            iconElement.alt = data.weather[0].description;
            iconElement.style.display = 'block'; // Show icon when API is working
        }
        
        if (locationElement) {
            locationElement.textContent = this.location;
        }
    }

    displayFallbackWeather() {
        // Display typical weather for Daraga, Albay (warm tropical climate)
        const tempElement = document.getElementById('weather-temp');
        const descElement = document.getElementById('weather-desc');
        const iconElement = document.getElementById('weather-icon');
        const locationElement = document.getElementById('weather-location');
        
        // Typical weather for Daraga
        const hour = new Date().getHours();
        let temp, desc, emoji;
        
        if (hour >= 6 && hour < 12) {
            temp = '26°C';
            desc = 'Partly Cloudy';
            emoji = '⛅';
        } else if (hour >= 12 && hour < 18) {
            temp = '31°C';
            desc = 'Warm & Humid';
            emoji = '☀️';
        } else {
            temp = '24°C';
            desc = 'Clear Night';
            emoji = '🌙';
        }
        
        if (tempElement) tempElement.textContent = temp;
        if (descElement) descElement.innerHTML = `<span style="font-size:1.2em;">${emoji}</span> ${desc}`;
        if (locationElement) locationElement.textContent = this.location;
        
        if (iconElement) {
            // For fallback, we hide the weather API icon
            iconElement.style.display = 'none';
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if widget exists on page
    if (document.getElementById('datetime-weather-widget')) {
        new DateTimeWeather();
    }
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DateTimeWeather;
}
