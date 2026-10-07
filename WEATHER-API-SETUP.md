# Weather API Setup (Optional)

The DateTime & Weather widget works with fallback data by default, but you can enable real-time weather data from OpenWeatherMap.

## Current Status
✅ **Widget is fully functional** with simulated weather data for Daraga, Albay
- Shows time-of-day appropriate weather (morning/afternoon/evening)
- Typical temperatures: 24-31°C
- No API key required for basic functionality

## Enable Real-Time Weather (Optional)

### Step 1: Get Free API Key
1. Visit: https://openweathermap.org/api
2. Sign up for a free account
3. Go to "API keys" section
4. Copy your API key

### Step 2: Add API Key
Open `datetime-weather.js` and replace line 8:
```javascript
this.apiKey = 'YOUR_API_KEY_HERE';
```
With your actual key:
```javascript
this.apiKey = 'abc123your_actual_api_key_here';
```

### Step 3: Deploy
Commit and push the change to GitHub:
```bash
git add datetime-weather.js
git commit -m "Add OpenWeatherMap API key"
git push origin main
```

## Free Tier Limits
- 60 calls per minute
- 1,000,000 calls per month
- Weather updates every 10 minutes
- This is MORE than enough for the demo (uses ~6 calls/hour per user)

## Location Details
- **City:** Daraga, Albay, Philippines
- **Coordinates:** 13.1603°N, 123.6939°E
- **Timezone:** Asia/Manila (UTC+8)

## Features
- Real-time temperature in Celsius
- Current weather description
- Weather icon from OpenWeatherMap
- 10-minute cache to minimize API calls
- Automatic fallback if API is unavailable

## Note
The widget is designed to work perfectly without an API key. Real-time weather is optional and recommended only if you want live data for production use.
