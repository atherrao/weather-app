/**
 * Breeze - Global World Weather App Engine, Interactive Map & Settings System
 */

document.addEventListener('DOMContentLoaded', () => {
    // Views & Panes
    const welcomeView = document.getElementById('welcome-view');
    const dashboardView = document.getElementById('dashboard-view');
    const getStartedBtn = document.getElementById('get-started-btn');
    const navHomeBtn = document.getElementById('nav-home-btn');
    const navItems = document.querySelectorAll('.nav-item');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Weather Sub-views (Compact vs Expanded Air Conditions)
    const compactView = document.getElementById('weather-compact-view');
    const expandedView = document.getElementById('weather-expanded-view');
    const seeMoreBtn = document.getElementById('see-more-btn');
    const seeLessBtn = document.getElementById('see-less-btn');
    const sideHourlyCard = document.getElementById('side-hourly-card');
    const sideHourlyList = document.getElementById('side-hourly-list');

    // Weather Tab Elements
    const searchInput = document.getElementById('city-search-input');
    const searchSubmitBtn = document.getElementById('city-search-btn');
    const searchSpinner = document.getElementById('search-spinner');
    const searchDropdown = document.getElementById('search-dropdown');

    const currentCityName = document.getElementById('current-city-name');
    const currentCityBadge = document.getElementById('current-city-badge');
    const currentRainChance = document.getElementById('current-rain-chance');
    const currentTemp = document.getElementById('current-temp');
    const currentWeatherIcon = document.getElementById('current-weather-icon');
    const currentLiveClock = document.getElementById('current-live-clock');
    const hourlyCurrentDate = document.getElementById('hourly-current-date');

    const hourlyForecastList = document.getElementById('hourly-forecast-list');
    const weeklyForecastList = document.getElementById('weekly-forecast-list');

    // Compact Mode Air Conditions
    const realFeelVal = document.getElementById('real-feel-val');
    const windVal = document.getElementById('wind-val');
    const chanceRainVal = document.getElementById('chance-rain-val');
    const uvIndexVal = document.getElementById('uv-index-val');

    // Expanded Mode 8 Detailed Air Conditions
    const expUvVal = document.getElementById('exp-uv-val');
    const expWindVal = document.getElementById('exp-wind-val');
    const expHumidityVal = document.getElementById('exp-humidity-val');
    const expVisibilityVal = document.getElementById('exp-visibility-val');
    const expFeelsVal = document.getElementById('exp-feels-val');
    const expRainVal = document.getElementById('exp-rain-val');
    const expPressureVal = document.getElementById('exp-pressure-val');
    const expSunsetVal = document.getElementById('exp-sunset-val');

    // Cities Tab Elements
    const citiesSearchInput = document.getElementById('cities-tab-search-input');
    const citiesSearchSubmitBtn = document.getElementById('cities-tab-search-btn');
    const citiesSearchSpinner = document.getElementById('cities-search-spinner');
    const citiesSearchDropdown = document.getElementById('cities-search-dropdown');
    const citiesCardsList = document.getElementById('cities-cards-list');
    const countryFilterChips = document.querySelectorAll('.filter-chip');

    const detailCityName = document.getElementById('detail-city-name');
    const detailCityBadge = document.getElementById('detail-city-badge');
    const detailLiveClock = document.getElementById('detail-live-clock');
    const detailRainChance = document.getElementById('detail-rain-chance');
    const detailTemp = document.getElementById('detail-temp');
    const detailWeatherIcon = document.getElementById('detail-weather-icon');
    const detailHourlyList = document.getElementById('detail-hourly-list');
    const detail3DayList = document.getElementById('detail-3day-list');

    // Map Tab Elements
    const mapSearchInput = document.getElementById('map-search-input');
    const mapSearchSubmitBtn = document.getElementById('map-search-btn');
    const mapSearchSpinner = document.getElementById('map-search-spinner');
    const mapSearchDropdown = document.getElementById('map-search-dropdown');
    const mapCitiesList = document.getElementById('map-cities-list');
    const mapDoneBtn = document.getElementById('map-done-btn');
    const mapTerrainViewport = document.getElementById('map-terrain-viewport');
    const mapFloatingLayer = document.getElementById('map-floating-layer');
    const mapZoomInBtn = document.getElementById('map-zoom-in');
    const mapZoomOutBtn = document.getElementById('map-zoom-out');
    const mapRecenterBtn = document.getElementById('map-recenter');
    const regionPills = document.querySelectorAll('.region-pill');

    // Settings Tab Elements
    const settingsSearchInput = document.getElementById('settings-search-input');
    const settingsSearchSubmitBtn = document.getElementById('settings-search-btn');
    const settingsSearchSpinner = document.getElementById('settings-search-spinner');
    const settingsSearchDropdown = document.getElementById('settings-search-dropdown');
    const segmentedControls = document.querySelectorAll('.segmented-control');
    const settingNotificationsToggle = document.getElementById('setting-notifications-toggle');
    const setting12hToggle = document.getElementById('setting-12h-toggle');
    const settingLocationToggle = document.getElementById('setting-location-toggle');
    const btnSignupPremium = document.getElementById('btn-signup-premium');

    // Subscription Modal & Pro Elements
    const subscriptionModal = document.getElementById('subscription-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const btnUnlockMapPro = document.getElementById('btn-unlock-map-pro');
    const mapLockOverlay = document.getElementById('map-lock-overlay');
    const planCards = document.querySelectorAll('.plan-card');
    const subscriptionForm = document.getElementById('subscription-form');
    const btnCheckoutSubmit = document.getElementById('btn-checkout-submit');
    const btnCheckoutText = document.getElementById('btn-checkout-text');
    const testProModeToggle = document.getElementById('test-pro-mode-toggle');

    // ==========================================
    // 1. SETTINGS STATE & PERSISTENCE
    // ==========================================
    const DEFAULT_SETTINGS = {
        tempUnit: 'C',       // 'C' | 'F'
        windUnit: 'kmh',     // 'kmh' | 'ms' | 'knots'
        pressureUnit: 'hPa', // 'hPa' | 'inches' | 'kPa' | 'mm'
        precipUnit: 'mm',    // 'mm' | 'inches'
        distUnit: 'km',      // 'km' | 'miles'
        notifications: true,
        is12Hour: true,
        locationEnabled: true
    };

    let appSettings = Object.assign({}, DEFAULT_SETTINGS);
    let isProUser = false; // Free tier by default

    try {
        const savedSettings = localStorage.getItem('breeze_weather_settings');
        if (savedSettings) {
            appSettings = Object.assign({}, DEFAULT_SETTINGS, JSON.parse(savedSettings));
        }

        const savedProState = localStorage.getItem('breeze_is_pro');
        if (savedProState) {
            isProUser = (savedProState === 'true');
        }
    } catch (e) {
        console.warn('Could not read settings from storage', e);
    }

    function saveSettings() {
        try {
            localStorage.setItem('breeze_weather_settings', JSON.stringify(appSettings));
        } catch (e) {
            console.warn('Could not save settings to storage', e);
        }
    }

    function saveProState(status) {
        isProUser = status;
        try {
            localStorage.setItem('breeze_is_pro', status ? 'true' : 'false');
        } catch (e) {
            console.warn('Could not save pro state to storage', e);
        }
        rerenderAllViews(); // Re-render to reflect unlocked/locked state
    }

    // Toast Notification System
    function showToast(message, duration = 3200) {
        const toast = document.getElementById('app-toast');
        if (!toast) return;
        toast.innerHTML = message;
        toast.classList.remove('hidden');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.add('hidden');
        }, duration);
    }

    // Unit Conversion Formatters
    function formatTemp(valInC) {
        if (valInC === undefined || valInC === null || isNaN(valInC)) return '--°';
        if (appSettings.tempUnit === 'F') {
            const valInF = Math.round((Number(valInC) * 9 / 5) + 32);
            return `${valInF}°`;
        }
        return `${Math.round(Number(valInC))}°`;
    }

    function formatWind(valInKmh) {
        if (valInKmh === undefined || valInKmh === null || isNaN(valInKmh)) return '--';
        const num = Number(valInKmh);
        if (appSettings.windUnit === 'ms') {
            return `${(num * 0.277778).toFixed(1)} m/s`;
        }
        if (appSettings.windUnit === 'knots') {
            return `${(num * 0.539957).toFixed(1)} knots`;
        }
        return `${num.toFixed(1)} km/h`;
    }

    function formatPressure(valInHpa) {
        if (valInHpa === undefined || valInHpa === null || isNaN(valInHpa)) return '--';
        const num = Number(valInHpa);
        if (appSettings.pressureUnit === 'inches') {
            return `${(num * 0.02953).toFixed(2)} inHg`;
        }
        if (appSettings.pressureUnit === 'kPa') {
            return `${(num * 0.1).toFixed(1)} kPa`;
        }
        if (appSettings.pressureUnit === 'mm') {
            return `${Math.round(num * 0.750062)} mmHg`;
        }
        return `${Math.round(num)} hPa`;
    }

    function formatDistance(valInKm) {
        if (valInKm === undefined || valInKm === null || isNaN(valInKm)) return '--';
        const num = Number(valInKm);
        if (appSettings.distUnit === 'miles') {
            return `${(num * 0.621371).toFixed(1)} mi`;
        }
        return `${num} km`;
    }

    function formatPrecipitation(chanceVal, mmVal = 0) {
        if (appSettings.precipUnit === 'inches') {
            const inInches = (mmVal * 0.0393701).toFixed(2);
            return `${chanceVal}% (${inInches} in)`;
        }
        return `${chanceVal}%`;
    }

    function formatSunset(sunsetStr) {
        if (!sunsetStr) return '20:58';
        if (!appSettings.is12Hour) return sunsetStr;
        const parts = sunsetStr.split(':');
        if (parts.length < 2) return sunsetStr;
        let hour = parseInt(parts[0], 10);
        const minute = parts[1];
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    }

    // ==========================================
    // 2. GLOBAL CITIES & COUNTRIES DATASET
    // ==========================================
    const worldCities = [
        // PAKISTAN
        { name: 'Karachi', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 31, realFeelVal: 30, windVal: 0.2, chanceRainVal: 0, uvIndex: '3', humidity: '56%', visibilityVal: 12, pressureVal: 1008, sunset: '20:58', condition: 'Sunny', icon: 'assets/sun.png', lat: 24.8607, lon: 67.0011, baseHigh: 36, baseLow: 22, mapTop: '48%', mapLeft: '24%' },
        { name: 'Lahore', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 27, realFeelVal: 28, windVal: 6.5, chanceRainVal: 10, uvIndex: '5', humidity: '62%', visibilityVal: 8, pressureVal: 1012, sunset: '18:45', condition: 'Partly Cloudy', icon: 'assets/sun_cloud.png', lat: 31.5204, lon: 74.3587, baseHigh: 35, baseLow: 21, mapTop: '32%', mapLeft: '68%' },
        { name: 'Islamabad', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 25, realFeelVal: 25, windVal: 5.2, chanceRainVal: 5, uvIndex: '6', humidity: '48%', visibilityVal: 15, pressureVal: 1014, sunset: '18:50', condition: 'Sunny', icon: 'assets/sun.png', lat: 33.6844, lon: 73.0479, baseHigh: 32, baseLow: 18, mapTop: '14%', mapLeft: '45%' },
        { name: 'Rawalpindi', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 26, realFeelVal: 26, windVal: 5.8, chanceRainVal: 5, uvIndex: '6', humidity: '50%', visibilityVal: 14, pressureVal: 1013, sunset: '18:50', condition: 'Partly Cloudy', icon: 'assets/sun_cloud.png', lat: 33.5651, lon: 73.0169, baseHigh: 33, baseLow: 19, mapTop: '18%', mapLeft: '47%' },
        { name: 'Peshawar', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 28, realFeelVal: 28, windVal: 7.1, chanceRainVal: 0, uvIndex: '7', humidity: '42%', visibilityVal: 16, pressureVal: 1011, sunset: '18:55', condition: 'Sunny', icon: 'assets/sun.png', lat: 34.0151, lon: 71.5249, baseHigh: 34, baseLow: 20, mapTop: '16%', mapLeft: '32%' },
        { name: 'Quetta', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 22, realFeelVal: 21, windVal: 12.0, chanceRainVal: 0, uvIndex: '6', humidity: '28%', visibilityVal: 20, pressureVal: 1020, sunset: '19:10', condition: 'Cloudy', icon: 'assets/cloud.png', lat: 30.1798, lon: 66.9750, baseHigh: 28, baseLow: 14, mapTop: '38%', mapLeft: '8%' },
        { name: 'Multan', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 33, realFeelVal: 34, windVal: 8.4, chanceRainVal: 0, uvIndex: '8', humidity: '45%', visibilityVal: 10, pressureVal: 1009, sunset: '18:52', condition: 'Sunny', icon: 'assets/sun.png', lat: 30.1575, lon: 71.5249, baseHigh: 37, baseLow: 23, mapTop: '68%', mapLeft: '46%' },
        { name: 'Faisalabad', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 29, realFeelVal: 30, windVal: 6.2, chanceRainVal: 0, uvIndex: '7', humidity: '52%', visibilityVal: 10, pressureVal: 1011, sunset: '18:48', condition: 'Sunny', icon: 'assets/sun.png', lat: 31.4504, lon: 73.1350, baseHigh: 35, baseLow: 21, mapTop: '36%', mapLeft: '55%' },
        { name: 'Gwadar', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 30, realFeelVal: 32, windVal: 16.0, chanceRainVal: 0, uvIndex: '9', humidity: '65%', visibilityVal: 14, pressureVal: 1009, sunset: '19:15', condition: 'Sunny', icon: 'assets/sun.png', lat: 25.1216, lon: 62.3254, baseHigh: 33, baseLow: 24, mapTop: '74%', mapLeft: '14%' },
        { name: 'Murree', country: 'Pakistan', category: 'Pakistan', flag: '🇵🇰', tz: 'Asia/Karachi', tempVal: 16, realFeelVal: 15, windVal: 10.5, chanceRainVal: 20, uvIndex: '5', humidity: '75%', visibilityVal: 8, pressureVal: 1022, sunset: '18:49', condition: 'Cloudy', icon: 'assets/cloud.png', lat: 33.9062, lon: 73.3903, baseHigh: 21, baseLow: 11, mapTop: '12%', mapLeft: '52%' },

        // UAE & SAUDI ARABIA
        { name: 'Dubai', country: 'United Arab Emirates', category: 'UAE', flag: '🇦🇪', tz: 'Asia/Dubai', tempVal: 35, realFeelVal: 38, windVal: 14.0, chanceRainVal: 0, uvIndex: '9', humidity: '45%', visibilityVal: 10, pressureVal: 1007, sunset: '18:30', condition: 'Sunny', icon: 'assets/sun.png', lat: 25.2048, lon: 55.2708, baseHigh: 38, baseLow: 28, mapTop: '40%', mapLeft: '55%' },
        { name: 'Abu Dhabi', country: 'United Arab Emirates', category: 'UAE', flag: '🇦🇪', tz: 'Asia/Dubai', tempVal: 36, realFeelVal: 39, windVal: 12.5, chanceRainVal: 0, uvIndex: '9', humidity: '48%', visibilityVal: 10, pressureVal: 1008, sunset: '18:32', condition: 'Sunny', icon: 'assets/sun.png', lat: 24.4539, lon: 54.3773, baseHigh: 39, baseLow: 27, mapTop: '45%', mapLeft: '48%' },
        { name: 'Riyadh', country: 'Saudi Arabia', category: 'UAE', flag: '🇸🇦', tz: 'Asia/Riyadh', tempVal: 37, realFeelVal: 37, windVal: 11.0, chanceRainVal: 0, uvIndex: '10', humidity: '18%', visibilityVal: 16, pressureVal: 1010, sunset: '18:15', condition: 'Sunny', icon: 'assets/sun.png', lat: 24.7136, lon: 46.6753, baseHigh: 40, baseLow: 26, mapTop: '50%', mapLeft: '30%' },
        { name: 'Jeddah', country: 'Saudi Arabia', category: 'UAE', flag: '🇸🇦', tz: 'Asia/Riyadh', tempVal: 34, realFeelVal: 38, windVal: 15.2, chanceRainVal: 0, uvIndex: '9', humidity: '60%', visibilityVal: 12, pressureVal: 1009, sunset: '18:35', condition: 'Sunny', icon: 'assets/sun.png', lat: 21.5433, lon: 39.1728, baseHigh: 36, baseLow: 27, mapTop: '58%', mapLeft: '18%' },

        // UNITED KINGDOM
        { name: 'London', country: 'United Kingdom', category: 'UK', flag: '🇬🇧', tz: 'Europe/London', tempVal: 19, realFeelVal: 18, windVal: 16.0, chanceRainVal: 45, uvIndex: '4', humidity: '72%', visibilityVal: 10, pressureVal: 1015, sunset: '19:25', condition: 'Rainy', icon: 'assets/rain.png', lat: 51.5074, lon: -0.1278, baseHigh: 21, baseLow: 13, mapTop: '35%', mapLeft: '42%' },
        { name: 'Manchester', country: 'United Kingdom', category: 'UK', flag: '🇬🇧', tz: 'Europe/London', tempVal: 17, realFeelVal: 16, windVal: 18.5, chanceRainVal: 60, uvIndex: '3', humidity: '78%', visibilityVal: 9, pressureVal: 1014, sunset: '19:30', condition: 'Rainy', icon: 'assets/rain.png', lat: 53.4808, lon: -2.2426, baseHigh: 18, baseLow: 11, mapTop: '25%', mapLeft: '38%' },
        { name: 'Edinburgh', country: 'United Kingdom', category: 'UK', flag: '🇬🇧', tz: 'Europe/London', tempVal: 15, realFeelVal: 14, windVal: 20.0, chanceRainVal: 35, uvIndex: '3', humidity: '74%', visibilityVal: 12, pressureVal: 1016, sunset: '19:35', condition: 'Cloudy', icon: 'assets/cloud.png', lat: 55.9533, lon: -3.1883, baseHigh: 16, baseLow: 9, mapTop: '15%', mapLeft: '35%' },

        // UNITED STATES
        { name: 'New York', country: 'United States', category: 'USA', flag: '🇺🇸', tz: 'America/New_York', tempVal: 24, realFeelVal: 24, windVal: 10.0, chanceRainVal: 10, uvIndex: '6', humidity: '52%', visibilityVal: 16, pressureVal: 1016, sunset: '19:10', condition: 'Sunny', icon: 'assets/sun.png', lat: 40.7128, lon: -74.0060, baseHigh: 26, baseLow: 17, mapTop: '38%', mapLeft: '72%' },
        { name: 'Los Angeles', country: 'United States', category: 'USA', flag: '🇺🇸', tz: 'America/Los_Angeles', tempVal: 28, realFeelVal: 29, windVal: 8.5, chanceRainVal: 0, uvIndex: '8', humidity: '48%', visibilityVal: 16, pressureVal: 1013, sunset: '19:00', condition: 'Sunny', icon: 'assets/sun.png', lat: 34.0522, lon: -118.2437, baseHigh: 30, baseLow: 19, mapTop: '52%', mapLeft: '18%' },
        { name: 'Chicago', country: 'United States', category: 'USA', flag: '🇺🇸', tz: 'America/Chicago', tempVal: 21, realFeelVal: 20, windVal: 19.0, chanceRainVal: 15, uvIndex: '5', humidity: '55%', visibilityVal: 14, pressureVal: 1017, sunset: '19:05', condition: 'Partly Cloudy', icon: 'assets/sun_cloud.png', lat: 41.8781, lon: -87.6298, baseHigh: 23, baseLow: 14, mapTop: '35%', mapLeft: '54%' },
        { name: 'Miami', country: 'United States', category: 'USA', flag: '🇺🇸', tz: 'America/New_York', tempVal: 31, realFeelVal: 36, windVal: 14.0, chanceRainVal: 40, uvIndex: '8', humidity: '76%', visibilityVal: 12, pressureVal: 1012, sunset: '19:30', condition: 'Rainy', icon: 'assets/rain.png', lat: 25.7617, lon: -80.1918, baseHigh: 32, baseLow: 25, mapTop: '68%', mapLeft: '68%' },

        // TURKEY
        { name: 'Istanbul', country: 'Turkey', category: 'Turkey', flag: '🇹🇷', tz: 'Europe/Istanbul', tempVal: 26, realFeelVal: 26, windVal: 15.0, chanceRainVal: 5, uvIndex: '6', humidity: '58%', visibilityVal: 15, pressureVal: 1014, sunset: '19:15', condition: 'Sunny', icon: 'assets/sun.png', lat: 41.0082, lon: 28.9784, baseHigh: 28, baseLow: 19, mapTop: '28%', mapLeft: '45%' },
        { name: 'Ankara', country: 'Turkey', category: 'Turkey', flag: '🇹🇷', tz: 'Europe/Istanbul', tempVal: 24, realFeelVal: 23, windVal: 8.0, chanceRainVal: 0, uvIndex: '7', humidity: '40%', visibilityVal: 18, pressureVal: 1018, sunset: '19:05', condition: 'Sunny', icon: 'assets/sun.png', lat: 39.9334, lon: 32.8597, baseHigh: 26, baseLow: 15, mapTop: '35%', mapLeft: '58%' },
        { name: 'Antalya', country: 'Turkey', category: 'Turkey', flag: '🇹🇷', tz: 'Europe/Istanbul', tempVal: 30, realFeelVal: 31, windVal: 9.5, chanceRainVal: 0, uvIndex: '8', humidity: '50%', visibilityVal: 16, pressureVal: 1012, sunset: '19:10', condition: 'Sunny', icon: 'assets/sun.png', lat: 36.8969, lon: 30.7133, baseHigh: 32, baseLow: 22, mapTop: '55%', mapLeft: '52%' },

        // JAPAN
        { name: 'Tokyo', country: 'Japan', category: 'Japan', flag: '🇯🇵', tz: 'Asia/Tokyo', tempVal: 27, realFeelVal: 29, windVal: 11.0, chanceRainVal: 20, uvIndex: '6', humidity: '68%', visibilityVal: 12, pressureVal: 1011, sunset: '17:50', condition: 'Partly Cloudy', icon: 'assets/sun_cloud.png', lat: 35.6762, lon: 139.6503, baseHigh: 29, baseLow: 21, mapTop: '42%', mapLeft: '75%' },
        { name: 'Osaka', country: 'Japan', category: 'Japan', flag: '🇯🇵', tz: 'Asia/Tokyo', tempVal: 28, realFeelVal: 30, windVal: 9.0, chanceRainVal: 10, uvIndex: '7', humidity: '64%', visibilityVal: 14, pressureVal: 1012, sunset: '18:00', condition: 'Sunny', icon: 'assets/sun.png', lat: 34.6937, lon: 135.5023, baseHigh: 30, baseLow: 22, mapTop: '50%', mapLeft: '62%' },
        { name: 'Kyoto', country: 'Japan', category: 'Japan', flag: '🇯🇵', tz: 'Asia/Tokyo', tempVal: 26, realFeelVal: 27, windVal: 7.5, chanceRainVal: 15, uvIndex: '6', humidity: '62%', visibilityVal: 14, pressureVal: 1013, sunset: '18:00', condition: 'Sunny', icon: 'assets/sun.png', lat: 35.0116, lon: 135.7681, baseHigh: 28, baseLow: 20, mapTop: '46%', mapLeft: '64%' },

        // EUROPE
        { name: 'Paris', country: 'France', category: 'Europe', flag: '🇫🇷', tz: 'Europe/Paris', tempVal: 22, realFeelVal: 22, windVal: 12.0, chanceRainVal: 10, uvIndex: '5', humidity: '58%', visibilityVal: 16, pressureVal: 1016, sunset: '20:05', condition: 'Sunny', icon: 'assets/sun.png', lat: 48.8566, lon: 2.3522, baseHigh: 24, baseLow: 15, mapTop: '38%', mapLeft: '32%' },
        { name: 'Berlin', country: 'Germany', category: 'Europe', flag: '🇩🇪', tz: 'Europe/Berlin', tempVal: 20, realFeelVal: 20, windVal: 14.0, chanceRainVal: 15, uvIndex: '4', humidity: '60%', visibilityVal: 15, pressureVal: 1017, sunset: '19:35', condition: 'Partly Cloudy', icon: 'assets/sun_cloud.png', lat: 52.5200, lon: 13.4050, baseHigh: 22, baseLow: 13, mapTop: '28%', mapLeft: '52%' },
        { name: 'Madrid', country: 'Spain', category: 'Europe', flag: '🇪🇸', tz: 'Europe/Madrid', tempVal: 31, realFeelVal: 30, windVal: 8.0, chanceRainVal: 0, uvIndex: '7', humidity: '38%', visibilityVal: 20, pressureVal: 1015, sunset: '20:45', condition: 'Sunny', icon: 'assets/sun.png', lat: 40.4168, lon: -3.7038, baseHigh: 33, baseLow: 19, mapTop: '62%', mapLeft: '18%' },
        { name: 'Rome', country: 'Italy', category: 'Europe', flag: '🇮🇹', tz: 'Europe/Rome', tempVal: 27, realFeelVal: 28, windVal: 10.0, chanceRainVal: 5, uvIndex: '6', humidity: '55%', visibilityVal: 16, pressureVal: 1014, sunset: '19:40', condition: 'Sunny', icon: 'assets/sun.png', lat: 41.9028, lon: 12.4964, baseHigh: 29, baseLow: 18, mapTop: '58%', mapLeft: '55%' },

        // CANADA & AUSTRALIA
        { name: 'Toronto', country: 'Canada', category: 'Canada', flag: '🇨🇦', tz: 'America/Toronto', tempVal: 20, realFeelVal: 20, windVal: 14.0, chanceRainVal: 10, uvIndex: '5', humidity: '54%', visibilityVal: 18, pressureVal: 1018, sunset: '19:35', condition: 'Sunny', icon: 'assets/sun.png', lat: 43.6532, lon: -79.3832, baseHigh: 22, baseLow: 13, mapTop: '32%', mapLeft: '68%' },
        { name: 'Vancouver', country: 'Canada', category: 'Canada', flag: '🇨🇦', tz: 'America/Vancouver', tempVal: 18, realFeelVal: 17, windVal: 12.0, chanceRainVal: 30, uvIndex: '4', humidity: '70%', visibilityVal: 14, pressureVal: 1019, sunset: '19:25', condition: 'Cloudy', icon: 'assets/cloud.png', lat: 49.2827, lon: -123.1207, baseHigh: 20, baseLow: 12, mapTop: '24%', mapLeft: '22%' },
        { name: 'Sydney', country: 'Australia', category: 'Australia', flag: '🇦🇺', tz: 'Australia/Sydney', tempVal: 21, realFeelVal: 21, windVal: 18.0, chanceRainVal: 15, uvIndex: '6', humidity: '58%', visibilityVal: 18, pressureVal: 1022, sunset: '17:45', condition: 'Sunny', icon: 'assets/sun.png', lat: -33.8688, lon: 151.2093, baseHigh: 23, baseLow: 14, mapTop: '55%', mapLeft: '78%' },
        { name: 'Melbourne', country: 'Australia', category: 'Australia', flag: '🇦🇺', tz: 'Australia/Melbourne', tempVal: 17, realFeelVal: 16, windVal: 22.0, chanceRainVal: 25, uvIndex: '5', humidity: '64%', visibilityVal: 15, pressureVal: 1020, sunset: '17:55', condition: 'Partly Cloudy', icon: 'assets/sun_cloud.png', lat: -37.8136, lon: 144.9631, baseHigh: 19, baseLow: 10, mapTop: '65%', mapLeft: '70%' }
    ];

    // Dynamic Forecast Enrichment
    function refreshCityForecasts() {
        worldCities.forEach(city => {
            city.hourly = generateDynamicHourly(city.tempVal, city.icon);
            city.weekly = generateDynamic7Days(city.baseHigh, city.baseLow, city.condition, city.icon);
        });
    }

    let selectedCityIndex = 0; // Default: Karachi
    let activeCountryFilter = 'all';
    let activeMapRegion = 'pakistan';

    // Timezone Helper: Gets exact live time in that city's timezone
    function getCityLiveTime(cityObj) {
        if (!cityObj) return '';
        try {
            return new Date().toLocaleTimeString('en-US', {
                timeZone: cityObj.tz || 'UTC',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: appSettings.is12Hour
            });
        } catch (e) {
            return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: appSettings.is12Hour });
        }
    }

    function getCityShortTime(cityObj) {
        if (!cityObj) return '';
        try {
            return new Date().toLocaleTimeString('en-US', {
                timeZone: cityObj.tz || 'UTC',
                hour: '2-digit',
                minute: '2-digit',
                hour12: appSettings.is12Hour
            });
        } catch (e) {
            return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: appSettings.is12Hour });
        }
    }

    // Dynamic Hourly generator
    function generateDynamicHourly(baseTemp = 31, baseIcon = 'assets/sun.png') {
        const now = new Date();
        const currentHour = now.getHours();
        const hourlySlots = [];
        const offsets = [0, 3, 6, 9, 12, 15];

        offsets.forEach(offset => {
            const hDate = new Date();
            hDate.setHours(currentHour + offset, 0, 0, 0);
            const timeLabel = hDate.toLocaleTimeString([], {
                hour: 'numeric',
                minute: '2-digit',
                hour12: appSettings.is12Hour
            });

            const h = hDate.getHours();
            let tempOffset = 0;
            let icon = baseIcon;

            if (h >= 12 && h <= 16) {
                tempOffset = 3;
                icon = 'assets/sun.png';
            } else if (h >= 6 && h <= 11) {
                tempOffset = 0;
                icon = 'assets/sun_cloud.png';
            } else if (h >= 17 && h <= 20) {
                tempOffset = -1;
                icon = 'assets/sun_cloud.png';
            } else {
                tempOffset = -5;
                icon = 'assets/cloud.png';
            }

            hourlySlots.push({
                time: timeLabel,
                tempVal: baseTemp + tempOffset,
                icon: icon
            });
        });

        return hourlySlots;
    }

    // Dynamic 7-Day Forecast generator
    function generateDynamic7Days(baseHigh = 36, baseLow = 22, baseCondition = 'Sunny', baseIcon = 'assets/sun.png') {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const now = new Date();
        const weekly = [];

        const conditionsMap = [
            { condition: 'Sunny', icon: 'assets/sun.png', highOffset: 0, lowOffset: 0 },
            { condition: 'Sunny', icon: 'assets/sun.png', highOffset: 1, lowOffset: -1 },
            { condition: 'Sunny', icon: 'assets/sun.png', highOffset: 1, lowOffset: -1 },
            { condition: 'Cloudy', icon: 'assets/cloud.png', highOffset: 1, lowOffset: -1 },
            { condition: 'Cloudy', icon: 'assets/cloud.png', highOffset: 1, lowOffset: -1 },
            { condition: 'Rainy', icon: 'assets/rain.png', highOffset: 1, lowOffset: -1 },
            { condition: 'Sunny', icon: 'assets/sun.png', highOffset: 1, lowOffset: -1 }
        ];

        for (let i = 0; i < 7; i++) {
            const nextDate = new Date();
            nextDate.setDate(now.getDate() + i);
            const dayName = i === 0 ? 'Today' : days[nextDate.getDay()];
            const cond = conditionsMap[i % conditionsMap.length];

            weekly.push({
                day: dayName,
                condition: i === 0 ? baseCondition : cond.condition,
                icon: i === 0 ? baseIcon : cond.icon,
                highVal: baseHigh + cond.highOffset,
                lowVal: baseLow + cond.lowOffset
            });
        }

        return weekly;
    }

    refreshCityForecasts();

    // Live Clock Updater (Updates real-time in selected city timezone)
    function startLiveClocks() {
        function updateTime() {
            const curCity = worldCities[selectedCityIndex];
            const dateStr = new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

            if (currentLiveClock && curCity) currentLiveClock.textContent = getCityLiveTime(curCity);
            if (detailLiveClock && curCity) detailLiveClock.textContent = getCityLiveTime(curCity);
            if (hourlyCurrentDate) hourlyCurrentDate.textContent = dateStr;

            document.querySelectorAll('[data-city-tz-idx]').forEach(el => {
                const cIdx = parseInt(el.dataset.cityTzIdx, 10);
                if (worldCities[cIdx]) {
                    el.textContent = getCityShortTime(worldCities[cIdx]);
                }
            });
        }

        updateTime();
        setInterval(updateTime, 1000);
    }

    // View Switching Logic
    function showDashboard() {
        if (welcomeView) welcomeView.classList.remove('active');
        if (dashboardView) dashboardView.classList.add('active');
    }

    function showWelcome() {
        if (dashboardView) dashboardView.classList.remove('active');
        if (welcomeView) welcomeView.classList.add('active');
    }

    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', (e) => {
            createRipple(e, getStartedBtn);
            setTimeout(showDashboard, 250);
        });
    }

    if (navHomeBtn) {
        navHomeBtn.addEventListener('click', showWelcome);
    }

    // Switch tab
    function activateTab(tabName) {
        navItems.forEach(n => {
            n.classList.remove('active');
            if (n.dataset.tab === tabName) n.classList.add('active');
        });

        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            if (pane.id === `pane-${tabName}`) {
                pane.classList.add('active');
            }
        });

        if (tabName === 'weather') {
            renderWeatherData(worldCities[selectedCityIndex]);
        } else if (tabName === 'cities') {
            renderCitiesList();
            renderCityDetail(worldCities[selectedCityIndex]);
        } else if (tabName === 'map') {
            renderMapTab();
        } else if (tabName === 'settings') {
            syncSettingsUI();
        }
    }

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            activateTab(btn.dataset.tab);
        });
    });

    // SEE MORE / SEE LESS TOGGLE
    if (seeMoreBtn) {
        seeMoreBtn.addEventListener('click', () => {
            compactView.classList.remove('active');
            expandedView.classList.add('active');
            if (sideHourlyCard) {
                sideHourlyCard.style.display = 'block';
                renderSideHourly(worldCities[selectedCityIndex]);
            }
        });
    }

    if (seeLessBtn) {
        seeLessBtn.addEventListener('click', () => {
            expandedView.classList.remove('active');
            compactView.classList.add('active');
            if (sideHourlyCard) {
                sideHourlyCard.style.display = 'none';
            }
        });
    }

    if (mapDoneBtn) {
        mapDoneBtn.addEventListener('click', () => {
            activateTab('weather');
        });
    }

    // Zoom Controls on Map
    let currentMapZoom = 1;
    if (mapZoomInBtn) {
        mapZoomInBtn.addEventListener('click', () => {
            if (currentMapZoom < 1.6) currentMapZoom += 0.15;
            if (mapTerrainViewport) mapTerrainViewport.style.transform = `scale(${currentMapZoom})`;
        });
    }

    if (mapZoomOutBtn) {
        mapZoomOutBtn.addEventListener('click', () => {
            if (currentMapZoom > 0.8) currentMapZoom -= 0.15;
            if (mapTerrainViewport) mapTerrainViewport.style.transform = `scale(${currentMapZoom})`;
        });
    }

    if (mapRecenterBtn) {
        mapRecenterBtn.addEventListener('click', () => {
            currentMapZoom = 1;
            if (mapTerrainViewport) mapTerrainViewport.style.transform = `scale(1)`;
        });
    }

    // Country Filter Chips (Cities Tab)
    countryFilterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const selectedCountry = chip.dataset.country;
            if (!isProUser && selectedCountry !== 'all') {
                showToast('🔒 Country filters are a Breeze PRO feature');
                openSubscriptionModal();
                return;
            }
            countryFilterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            activeCountryFilter = selectedCountry;
            renderCitiesList();
        });
    });

    // Map Region Selector Pills (Map Tab)
    regionPills.forEach(pill => {
        pill.addEventListener('click', () => {
            regionPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            activeMapRegion = pill.dataset.region;
            renderMapTab();
        });
    });

    // Ripple Helper
    function createRipple(e, button) {
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.classList.add('btn-ripple');

        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }

    // Render 3-hour side hourly list in expanded mode
    function renderSideHourly(cityObj) {
        if (!sideHourlyList || !cityObj || !cityObj.hourly) return;
        sideHourlyList.innerHTML = cityObj.hourly.slice(0, 3).map(item => `
            <div class="hourly-item">
                <span class="hour-time">${item.time}</span>
                <div class="hour-icon-wrapper">
                    <img src="${item.icon}" alt="${item.time}" class="hour-img">
                </div>
                <span class="hour-temp">${formatTemp(item.tempVal)}</span>
            </div>
        `).join('');
    }

    // Render Weather Tab Data
    function renderWeatherData(cityObj) {
        if (!cityObj) return;

        if (currentCityName) currentCityName.textContent = cityObj.name;
        if (currentCityBadge) currentCityBadge.textContent = `${cityObj.flag || '🌐'} ${cityObj.country.toUpperCase()}`;
        if (currentRainChance) currentRainChance.textContent = `Chance of rain: ${cityObj.chanceRainVal ?? 0}%`;
        if (currentTemp) currentTemp.textContent = formatTemp(cityObj.tempVal);
        if (currentWeatherIcon) currentWeatherIcon.src = cityObj.icon;
        if (currentLiveClock) currentLiveClock.textContent = getCityLiveTime(cityObj);

        // Compact Metrics
        if (realFeelVal) realFeelVal.textContent = formatTemp(cityObj.realFeelVal ?? cityObj.tempVal);
        if (windVal) windVal.textContent = formatWind(cityObj.windVal);
        if (chanceRainVal) chanceRainVal.textContent = formatPrecipitation(cityObj.chanceRainVal ?? 0);
        if (uvIndexVal) uvIndexVal.textContent = cityObj.uvIndex || '3';

        // Expanded 8 Metrics
        if (expUvVal) expUvVal.textContent = cityObj.uvIndex || '3';
        if (expWindVal) expWindVal.textContent = formatWind(cityObj.windVal);
        if (expHumidityVal) expHumidityVal.textContent = cityObj.humidity || '56%';
        if (expVisibilityVal) expVisibilityVal.textContent = formatDistance(cityObj.visibilityVal);
        if (expFeelsVal) expFeelsVal.textContent = formatTemp(cityObj.realFeelVal ?? cityObj.tempVal);
        if (expRainVal) expRainVal.textContent = formatPrecipitation(cityObj.chanceRainVal ?? 0);
        if (expPressureVal) expPressureVal.textContent = formatPressure(cityObj.pressureVal);
        if (expSunsetVal) expSunsetVal.textContent = formatSunset(cityObj.sunset);

        // 6 Hourly
        if (hourlyForecastList && cityObj.hourly) {
            hourlyForecastList.innerHTML = cityObj.hourly.slice(0, 6).map(item => `
                <div class="hourly-item">
                    <span class="hour-time">${item.time}</span>
                    <div class="hour-icon-wrapper">
                        <img src="${item.icon}" alt="${item.time}" class="hour-img">
                    </div>
                    <span class="hour-temp">${formatTemp(item.tempVal)}</span>
                </div>
            `).join('');
        }

        renderSideHourly(cityObj);

        // 7-Day Record
        if (weeklyForecastList && cityObj.weekly) {
            weeklyForecastList.innerHTML = cityObj.weekly.map(item => `
                <div class="weekly-row">
                    <span class="day-name">${item.day}</span>
                    <div class="day-weather-info">
                        <img src="${item.icon}" alt="${item.condition}" class="day-icon">
                        <span class="day-condition">${item.condition}</span>
                    </div>
                    <div class="day-temps">
                        <span class="temp-high">${formatTemp(item.highVal)}</span>/<span class="temp-low">${formatTemp(item.lowVal)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    // Render Cities Tab List (With Country Filter & Search)
    function renderCitiesList(filterQuery = '') {
        if (!citiesCardsList) return;

        let filtered = worldCities;

        // Apply country category filter
        if (activeCountryFilter !== 'all') {
            filtered = filtered.filter(c => c.category === activeCountryFilter || c.country.toLowerCase().includes(activeCountryFilter.toLowerCase()));
        }

        // Apply search filter
        if (filterQuery) {
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                c.country.toLowerCase().includes(filterQuery.toLowerCase())
            );
        }

        if (filtered.length === 0) {
            citiesCardsList.innerHTML = `<div style="padding: 2.5rem; text-align: center; color: var(--text-secondary);">No cities found for this search.</div>`;
            return;
        }

        let displayList = filtered;
        if (!isProUser) {
            // Free Tier: restrict to first 3 matches
            displayList = filtered.slice(0, 3);
        }

        let htmlStr = displayList.map((city) => {
            const actualIndex = worldCities.indexOf(city);
            const isActive = actualIndex === selectedCityIndex;
            return `
                <div class="city-card ${isActive ? 'active' : ''}" data-index="${actualIndex}">
                    <div class="city-card-left">
                        <div class="city-card-icon-wrap">
                            <img src="${city.icon}" alt="${city.condition}" class="city-card-img">
                        </div>
                        <div class="city-card-info">
                            <div class="city-card-name-row">
                                <span class="city-card-name">${city.name}</span>
                                <small style="font-size: 0.8rem;">${city.flag || ''}</small>
                                <svg class="city-nav-arrow" viewBox="0 0 24 24">
                                    <path d="M12 2L2 22l10-4 10 4L12 2z"/>
                                </svg>
                            </div>
                            <span class="city-card-time" data-city-tz-idx="${actualIndex}">${getCityShortTime(city)}</span>
                        </div>
                    </div>
                    <div class="city-card-temp">${formatTemp(city.tempVal)}</div>
                </div>
            `;
        }).join('');

        // Append PRO Banner if not pro
        if (!isProUser) {
            htmlStr += `
                <div class="cities-pro-upgrade-card">
                    <div class="cities-pro-card-header">
                        <span style="font-size: 1.5rem;">👑</span>
                        <h4 class="cities-pro-card-title">Unlock 50+ Global Cities</h4>
                    </div>
                    <p class="cities-pro-card-desc">Get Breeze PRO to explore live weather and local time for all cities worldwide.</p>
                    
                    <div class="cities-pro-locked-preview">
                        <span class="locked-city-chip">🔒 Tokyo, JP</span>
                        <span class="locked-city-chip">🔒 London, UK</span>
                        <span class="locked-city-chip">🔒 New York, US</span>
                    </div>
                    
                    <button class="btn-cities-upgrade-pro" id="btn-cities-upgrade-pro">Upgrade to PRO</button>
                </div>
            `;
        }

        citiesCardsList.innerHTML = htmlStr;

        document.querySelectorAll('.city-card').forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.index, 10);
                selectCityByIndex(idx);
                renderCitiesList(filterQuery);
            });
        });

        // Attach upgrade button listener if exists
        const btnCitiesUpgrade = document.getElementById('btn-cities-upgrade-pro');
        if (btnCitiesUpgrade) {
            btnCitiesUpgrade.addEventListener('click', () => openSubscriptionModal());
        }
    }

    // Render Cities Tab Detail Panel
    function renderCityDetail(city) {
        if (!city) return;

        if (detailCityName) detailCityName.textContent = city.name;
        if (detailCityBadge) detailCityBadge.textContent = `${city.flag || '🌐'} ${city.country.toUpperCase()}`;
        if (detailRainChance) detailRainChance.textContent = `Chance of rain: ${city.chanceRainVal ?? 0}%`;
        if (detailTemp) detailTemp.textContent = formatTemp(city.tempVal);
        if (detailWeatherIcon) detailWeatherIcon.src = city.icon;
        if (detailLiveClock) detailLiveClock.textContent = getCityLiveTime(city);

        if (detailHourlyList && city.hourly) {
            detailHourlyList.innerHTML = city.hourly.slice(0, 3).map(item => `
                <div class="hourly-item">
                    <span class="hour-time">${item.time}</span>
                    <div class="hour-icon-wrapper">
                        <img src="${item.icon}" alt="${item.time}" class="hour-img">
                    </div>
                    <span class="hour-temp">${formatTemp(item.tempVal)}</span>
                </div>
            `).join('');
        }

        if (detail3DayList && city.weekly) {
            detail3DayList.innerHTML = city.weekly.map(item => `
                <div class="weekly-row">
                    <span class="day-name">${item.day}</span>
                    <div class="day-weather-info">
                        <img src="${item.icon}" alt="${item.condition}" class="day-icon">
                        <span class="day-condition">${item.condition}</span>
                    </div>
                    <div class="day-temps">
                        <span class="temp-high">${formatTemp(item.highVal)}</span>/<span class="temp-low">${formatTemp(item.lowVal)}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    // Render Map Tab Content (With Regional filtering)
    function renderMapTab() {
        if (!mapCitiesList || !mapFloatingLayer) return;

        // Filter cities by map region
        let regionCities = worldCities;
        if (activeMapRegion === 'pakistan') {
            regionCities = worldCities.filter(c => c.category === 'Pakistan');
        } else if (activeMapRegion === 'middle_east') {
            regionCities = worldCities.filter(c => c.category === 'UAE');
        } else if (activeMapRegion === 'europe') {
            regionCities = worldCities.filter(c => c.category === 'Europe' || c.category === 'UK' || c.category === 'Turkey');
        } else if (activeMapRegion === 'america') {
            regionCities = worldCities.filter(c => c.category === 'USA' || c.category === 'Canada');
        } else if (activeMapRegion === 'asia') {
            regionCities = worldCities.filter(c => c.category === 'Japan' || c.category === 'Australia' || c.category === 'Pakistan');
        }

        // Render right list in Map tab
        mapCitiesList.innerHTML = regionCities.map((city) => {
            const actualIdx = worldCities.indexOf(city);
            const isActive = actualIdx === selectedCityIndex;
            return `
                <div class="city-card ${isActive ? 'active' : ''}" data-map-index="${actualIdx}">
                    <div class="city-card-left">
                        <div class="city-card-icon-wrap">
                            <img src="${city.icon}" alt="${city.condition}" class="city-card-img">
                        </div>
                        <div class="city-card-info">
                            <div class="city-card-name-row">
                                <span class="city-card-name">${city.name}</span>
                                <small>${city.flag || ''}</small>
                                <svg class="city-nav-arrow" viewBox="0 0 24 24">
                                    <path d="M12 2L2 22l10-4 10 4L12 2z"/>
                                </svg>
                            </div>
                            <span class="city-card-time" data-city-tz-idx="${actualIdx}">${getCityShortTime(city)}</span>
                        </div>
                    </div>
                    <div class="city-card-temp">${formatTemp(city.tempVal)}</div>
                </div>
            `;
        }).join('');

        document.querySelectorAll('[data-map-index]').forEach(card => {
            card.addEventListener('click', () => {
                const idx = parseInt(card.dataset.mapIndex, 10);
                selectCityByIndex(idx);
                renderMapTab();
            });
        });

        // Render Floating Markers on Map
        const markersToShow = regionCities.slice(0, 6);
        mapFloatingLayer.innerHTML = markersToShow.map((city) => {
            const actualIdx = worldCities.indexOf(city);
            const isCurrent = actualIdx === selectedCityIndex;
            const topPos = city.mapTop || '40%';
            const leftPos = city.mapLeft || '50%';

            return `
                <div class="map-marker-pin" style="top: ${topPos}; left: ${leftPos};">
                    <div class="pin-dot"></div>
                    <div class="map-weather-badge ${isCurrent ? 'active' : ''}" data-marker-city-idx="${actualIdx}">
                        <span class="badge-city-name">${city.name}</span>
                        <div class="badge-icon-wrap">
                            <img src="${city.icon}" alt="${city.name}" class="badge-icon">
                        </div>
                        <span class="badge-temp">${formatTemp(city.tempVal)}</span>
                        <button class="badge-detail-btn" data-detail-city-idx="${actualIdx}">See detail</button>
                    </div>
                </div>
            `;
        }).join('');

        // Attach click listeners to map markers
        document.querySelectorAll('[data-marker-city-idx]').forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(badge.dataset.markerCityIdx, 10);
                selectCityByIndex(idx);
                renderMapTab();
            });
        });

        document.querySelectorAll('[data-detail-city-idx]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const idx = parseInt(btn.dataset.detailCityIdx, 10);
                selectCityByIndex(idx);
                activateTab('weather');
            });
        });

        if (mapLockOverlay) {
            if (isProUser) {
                mapLockOverlay.classList.add('unlocked');
            } else {
                mapLockOverlay.classList.remove('unlocked');
            }
        }
    }

    // Select City helper
    function selectCityByIndex(idx) {
        if (idx < 0 || idx >= worldCities.length) return;
        selectedCityIndex = idx;
        const city = worldCities[idx];
        renderWeatherData(city);
        renderCityDetail(city);
    }

    // Re-render all views on global settings change
    function rerenderAllViews() {
        refreshCityForecasts();
        renderWeatherData(worldCities[selectedCityIndex]);
        renderCitiesList();
        renderCityDetail(worldCities[selectedCityIndex]);
        renderMapTab();

        // Show/hide the PRO lock badge on the Map nav icon
        const mapProBadge = document.getElementById('nav-map-pro-badge');
        if (mapProBadge) {
            mapProBadge.style.display = isProUser ? 'none' : 'flex';
        }
    }

    // ==========================================
    // 3. SETTINGS ENGINE & INTERACTIVE CONTROLS
    // ==========================================
    function syncSettingsUI() {
        // Sync segmented control buttons
        segmentedControls.forEach(control => {
            const group = control.dataset.settingGroup;
            const currentVal = appSettings[group];
            if (group && currentVal) {
                control.querySelectorAll('.seg-btn').forEach(btn => {
                    if (btn.dataset.unit === currentVal) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });
            }
        });

        // Sync Toggles
        if (settingNotificationsToggle) settingNotificationsToggle.checked = !!appSettings.notifications;
        if (setting12hToggle) setting12hToggle.checked = !!appSettings.is12Hour;
        if (settingLocationToggle) settingLocationToggle.checked = !!appSettings.locationEnabled;
    }

    // Wire Segmented Buttons
    segmentedControls.forEach(control => {
        const group = control.dataset.settingGroup;
        control.querySelectorAll('.seg-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetUnit = btn.dataset.unit;
                if (!targetUnit || !group) return;

                control.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                appSettings[group] = targetUnit;
                saveSettings();

                // Human-readable labels for feedback toast
                const unitLabels = {
                    'C': 'Celsius (°C)',
                    'F': 'Fahrenheit (°F)',
                    'kmh': 'Kilometers per hour (km/h)',
                    'ms': 'Meters per second (m/s)',
                    'knots': 'Knots',
                    'hPa': 'Hectopascals (hPa)',
                    'inches': 'Inches of Mercury (inHg)',
                    'kPa': 'Kilopascals (kPa)',
                    'mm': 'Millimeters of Mercury (mmHg)',
                    'km': 'Kilometers (km)',
                    'miles': 'Miles (mi)'
                };

                const friendlyLabel = unitLabels[targetUnit] || targetUnit;
                showToast(`⚙️ Unit updated: <strong>${friendlyLabel}</strong>`);

                // Live-update the entire app instantly!
                rerenderAllViews();
            });
        });
    });

    // Wire Notification Toggle
    if (settingNotificationsToggle) {
        settingNotificationsToggle.addEventListener('change', (e) => {
            appSettings.notifications = e.target.checked;
            saveSettings();

            if (appSettings.notifications) {
                if ('Notification' in window) {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            try {
                                new Notification('Breeze Weather', {
                                    body: '✅ Weather notifications enabled! You will receive daily alerts.',
                                    icon: 'assets/sun.png'
                                });
                            } catch (err) { }
                        }
                    });
                }
                showToast('🔔 <strong>Weather notifications enabled!</strong> Severe alerts are active.');
            } else {
                showToast('🔕 <strong>Weather notifications disabled.</strong>');
            }
        });
    }

    // Wire 12-Hour Time Toggle
    if (setting12hToggle) {
        setting12hToggle.addEventListener('change', (e) => {
            appSettings.is12Hour = e.target.checked;
            saveSettings();

            const modeName = appSettings.is12Hour ? '12-Hour (AM/PM)' : '24-Hour (Military)';
            showToast(`⏰ Time format switched to <strong>${modeName}</strong>`);
            rerenderAllViews();
        });
    }

    // Wire Location Toggle
    if (settingLocationToggle) {
        settingLocationToggle.addEventListener('change', (e) => {
            appSettings.locationEnabled = e.target.checked;
            saveSettings();

            if (appSettings.locationEnabled) {
                showToast('📍 Detecting your current location...');
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        async (position) => {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;
                            try {
                                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                                const geoData = await geoRes.json();
                                const cityName = geoData.address.city || geoData.address.town || geoData.address.state || 'My Location';
                                const countryName = geoData.address.country || 'Current';

                                await fetchLiveWeather(cityName, lat, lon, countryName);
                                showToast(`📍 Live location active: <strong>${cityName}, ${countryName}</strong>`);
                            } catch (err) {
                                await fetchLiveWeather('Current Location', lat, lon, 'Local');
                                showToast('📍 Weather updated for your coordinates!');
                            }
                        },
                        (error) => {
                            showToast('⚠️ Location access was denied or unavailable.');
                        },
                        { timeout: 10000 }
                    );
                } else {
                    showToast('⚠️ Geolocation is not supported by your browser.');
                }
            } else {
                showToast('📍 Custom city selection mode active.');
            }
        });
    }

    // Wire Advanced Premium Sign up Button
    if (btnSignupPremium) {
        btnSignupPremium.addEventListener('click', () => {
            showToast('🎉 <strong>Welcome to Breeze Advanced!</strong> Your 30-Day Ad-Free Trial is now active.', 4500);
        });
    }

    // ==========================================
    // 4. WEATHER CODE INTERPRETATION
    // ==========================================
    function getWeatherIconAndDesc(wCode) {
        if (wCode === 0) return { icon: 'assets/sun.png', desc: 'Sunny' };
        if (wCode >= 1 && wCode <= 3) return { icon: 'assets/sun_cloud.png', desc: 'Partly Cloudy' };
        if (wCode >= 45 && wCode <= 48) return { icon: 'assets/cloud.png', desc: 'Foggy' };
        if (wCode >= 51 && wCode <= 67) return { icon: 'assets/rain.png', desc: 'Rainy' };
        if (wCode >= 71 && wCode <= 77) return { icon: 'assets/cloud.png', desc: 'Snowy' };
        if (wCode >= 80 && wCode <= 82) return { icon: 'assets/rain.png', desc: 'Rain Showers' };
        if (wCode >= 95) return { icon: 'assets/rain.png', desc: 'Thunderstorm' };
        return { icon: 'assets/cloud.png', desc: 'Cloudy' };
    }

    // Live Global Weather Fetcher
    async function fetchLiveWeather(city, lat, lon, countryName = 'Global', timezone = 'UTC') {
        try {
            if (searchSpinner) searchSpinner.classList.remove('hidden');
            if (citiesSearchSpinner) citiesSearchSpinner.classList.remove('hidden');
            if (mapSearchSpinner) mapSearchSpinner.classList.remove('hidden');
            if (settingsSearchSpinner) settingsSearchSpinner.classList.remove('hidden');

            const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,surface_pressure,wind_speed_10m,weather_code&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunset&timezone=auto`
            );

            if (!weatherRes.ok) throw new Error('Weather fetch failed');
            const data = await weatherRes.json();

            const current = data.current;
            const daily = data.daily;
            const hourly = data.hourly;

            const currentWeather = getWeatherIconAndDesc(current.weather_code);
            const rainProb = daily.precipitation_probability_max?.[0] ?? 0;

            const currentHourIndex = new Date().getHours();
            const formattedHourly = [];
            for (let i = 0; i < 6; i++) {
                const targetIdx = (currentHourIndex + i * 3) % 24;
                const hDate = new Date();
                hDate.setHours(targetIdx, 0, 0, 0);
                const timeLabel = hDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: appSettings.is12Hour });
                const hCode = hourly.weather_code[targetIdx] ?? 0;
                const hTemp = Math.round(hourly.temperature_2m[targetIdx] ?? 0);
                const hIconInfo = getWeatherIconAndDesc(hCode);

                formattedHourly.push({
                    time: timeLabel,
                    tempVal: hTemp,
                    icon: hIconInfo.icon
                });
            }

            const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const formattedWeekly = [];
            for (let i = 0; i < Math.min(7, daily.time.length); i++) {
                const date = new Date(daily.time[i]);
                const dayName = i === 0 ? 'Today' : daysOfWeek[date.getDay()];
                const wCode = daily.weather_code[i];
                const iconInfo = getWeatherIconAndDesc(wCode);
                const high = Math.round(daily.temperature_2m_max[i]);
                const low = Math.round(daily.temperature_2m_min[i]);

                formattedWeekly.push({
                    day: dayName,
                    condition: iconInfo.desc,
                    icon: iconInfo.icon,
                    highVal: high,
                    lowVal: low
                });
            }

            const uvVal = daily.uv_index_max ? Math.round(daily.uv_index_max[0]) : 3;
            const sunsetRaw = daily.sunset?.[0];
            const sunsetStr = sunsetRaw ? new Date(sunsetRaw).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '20:00';

            const newCityObj = {
                name: city,
                country: countryName,
                category: 'Global',
                flag: '🌐',
                tz: data.timezone || timezone || 'UTC',
                tempVal: Math.round(current.temperature_2m),
                realFeelVal: Math.round(current.apparent_temperature),
                windVal: current.wind_speed_10m,
                chanceRainVal: rainProb,
                uvIndex: `${uvVal}`,
                humidity: `${current.relative_humidity_2m}%`,
                visibilityVal: 15,
                pressureVal: Math.round(current.surface_pressure),
                sunset: sunsetStr,
                condition: currentWeather.desc,
                icon: currentWeather.icon,
                baseHigh: Math.round(daily.temperature_2m_max?.[0] ?? current.temperature_2m + 4),
                baseLow: Math.round(daily.temperature_2m_min?.[0] ?? current.temperature_2m - 5),
                hourly: formattedHourly,
                weekly: formattedWeekly,
                mapTop: '50%',
                mapLeft: '50%'
            };

            const existingIdx = worldCities.findIndex(c => c.name.toLowerCase() === city.toLowerCase());
            if (existingIdx >= 0) {
                worldCities[existingIdx] = newCityObj;
                selectedCityIndex = existingIdx;
            } else {
                worldCities.unshift(newCityObj);
                selectedCityIndex = 0;
            }

            rerenderAllViews();

        } catch (err) {
            console.error('Error fetching live weather:', err);
        } finally {
            if (searchSpinner) searchSpinner.classList.add('hidden');
            if (citiesSearchSpinner) citiesSearchSpinner.classList.add('hidden');
            if (mapSearchSpinner) mapSearchSpinner.classList.add('hidden');
            if (settingsSearchSpinner) settingsSearchSpinner.classList.add('hidden');
        }
    }

    // Select city by name
    function selectCityByName(cityName) {
        const foundIdx = worldCities.findIndex(c => c.name.toLowerCase() === cityName.toLowerCase());
        if (foundIdx >= 0) {
            selectCityByIndex(foundIdx);
            renderCitiesList();
            renderMapTab();
            return true;
        }
        return false;
    }

    // Universal Global Search Engine
    function setupRobustSearch(inputEl, submitBtn, spinnerEl, dropdownEl) {
        if (!inputEl) return;
        let debounceTimer;

        function performSearch() {
            const query = inputEl.value.trim();
            if (!query) return;

            if (dropdownEl) dropdownEl.classList.add('hidden');

            if (selectCityByName(query)) return;

            const partial = worldCities.find(c => c.name.toLowerCase().includes(query.toLowerCase()) || c.country.toLowerCase().includes(query.toLowerCase()));
            if (partial) {
                selectCityByName(partial.name);
                return;
            }

            if (spinnerEl) spinnerEl.classList.remove('hidden');
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language=en&format=json`)
                .then(res => res.json())
                .then(geoData => {
                    if (geoData.results && geoData.results.length > 0) {
                        const loc = geoData.results[0];
                        fetchLiveWeather(loc.name, loc.latitude, loc.longitude, loc.country || 'Global', loc.timezone);
                    } else {
                        showToast(`⚠️ City "${query}" not found.`);
                    }
                })
                .catch(err => console.error(err))
                .finally(() => {
                    if (spinnerEl) spinnerEl.classList.add('hidden');
                });
        }

        inputEl.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(debounceTimer);

            if (inputEl === citiesSearchInput) {
                renderCitiesList(query);
            }

            if (query.length < 1) {
                if (dropdownEl) dropdownEl.classList.add('hidden');
                return;
            }

            const localMatches = worldCities.filter(c =>
                c.name.toLowerCase().includes(query.toLowerCase()) ||
                c.country.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 6);

            if (localMatches.length > 0) {
                dropdownEl.innerHTML = localMatches.map(loc => `
                    <div class="search-dropdown-item" data-name="${loc.name}">
                        <span>${loc.flag || '🌐'} <strong>${loc.name}</strong>, ${loc.country}</span>
                        <span style="color: var(--brand-blue); font-weight: 700;">${formatTemp(loc.tempVal)}</span>
                    </div>
                `).join('');
                dropdownEl.classList.remove('hidden');

                dropdownEl.querySelectorAll('.search-dropdown-item').forEach(item => {
                    item.addEventListener('click', () => {
                        const cName = item.dataset.name;
                        inputEl.value = cName;
                        dropdownEl.classList.add('hidden');
                        selectCityByName(cName);
                    });
                });
            }

            debounceTimer = setTimeout(async () => {
                if (query.length >= 2) {
                    try {
                        const geoRes = await fetch(
                            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
                        );
                        const geoData = await geoRes.json();

                        if (geoData.results && geoData.results.length > 0) {
                            const apiResults = geoData.results;
                            dropdownEl.innerHTML = apiResults.map(loc => `
                                <div class="search-dropdown-item" data-name="${loc.name}" data-lat="${loc.latitude}" data-lon="${loc.longitude}" data-country="${loc.country || ''}" data-tz="${loc.timezone || ''}">
                                    <span>🌐 <strong>${loc.name}</strong>${loc.admin1 ? ', ' + loc.admin1 : ''}</span>
                                    <small style="color: var(--text-secondary); font-size: 0.78rem;">${loc.country || ''}</small>
                                </div>
                            `).join('');
                            dropdownEl.classList.remove('hidden');

                            dropdownEl.querySelectorAll('.search-dropdown-item').forEach(item => {
                                item.addEventListener('click', () => {
                                    const cName = item.dataset.name;
                                    const lat = item.dataset.lat;
                                    const lon = item.dataset.lon;
                                    const countryName = item.dataset.country;
                                    const tz = item.dataset.tz;
                                    inputEl.value = cName;
                                    dropdownEl.classList.add('hidden');
                                    fetchLiveWeather(cName, lat, lon, countryName, tz);
                                });
                            });
                        }
                    } catch (err) { }
                }
            }, 350);
        });

        inputEl.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                performSearch();
            });
        }
    }

    setupRobustSearch(searchInput, searchSubmitBtn, searchSpinner, searchDropdown);
    setupRobustSearch(citiesSearchInput, citiesSearchSubmitBtn, citiesSearchSpinner, citiesSearchDropdown);
    setupRobustSearch(mapSearchInput, mapSearchSubmitBtn, mapSearchSpinner, mapSearchDropdown);
    setupRobustSearch(settingsSearchInput, settingsSearchSubmitBtn, settingsSearchSpinner, settingsSearchDropdown);

    document.addEventListener('click', (e) => {
        if (searchDropdown && !e.target.closest('.search-wrapper')) {
            searchDropdown.classList.add('hidden');
        }
        if (citiesSearchDropdown && !e.target.closest('.search-wrapper')) {
            citiesSearchDropdown.classList.add('hidden');
        }
        if (mapSearchDropdown && !e.target.closest('.search-wrapper')) {
            mapSearchDropdown.classList.add('hidden');
        }
        if (settingsSearchDropdown && !e.target.closest('.search-wrapper')) {
            settingsSearchDropdown.classList.add('hidden');
        }
    });

    // Start Live Clocks
    startLiveClocks();

    // ==========================================
    // 5. SUBSCRIPTION & MODAL LOGIC
    // ==========================================
    function openSubscriptionModal() {
        if (subscriptionModal) subscriptionModal.classList.remove('hidden');
    }

    function closeSubscriptionModal() {
        if (subscriptionModal) subscriptionModal.classList.add('hidden');
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeSubscriptionModal);
    }

    if (subscriptionModal) {
        subscriptionModal.addEventListener('click', (e) => {
            if (e.target === subscriptionModal) closeSubscriptionModal();
        });
    }

    if (btnUnlockMapPro) btnUnlockMapPro.addEventListener('click', openSubscriptionModal);
    if (btnSignupPremium) {
        btnSignupPremium.addEventListener('click', () => {
            if (isProUser) {
                showToast('🎉 You are already a Breeze PRO member!');
            } else {
                openSubscriptionModal();
            }
        });
    }

    // Plan Selection Logic
    let selectedPlanPrice = '$5.99/mo';
    planCards.forEach(card => {
        card.addEventListener('click', () => {
            planCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            if (card.id === 'plan-monthly') {
                selectedPlanPrice = '$5.99/mo';
            } else {
                selectedPlanPrice = '$49.99/yr';
            }
            if (btnCheckoutText) {
                btnCheckoutText.textContent = `Start 7-Day Free Trial & Unlock (${selectedPlanPrice})`;
            }
        });
    });

    // Form Submission (Simulate Checkout)
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Simulate processing
            const originalText = btnCheckoutText.textContent;
            btnCheckoutText.textContent = 'Processing Securely...';
            btnCheckoutSubmit.style.opacity = '0.8';
            btnCheckoutSubmit.style.pointerEvents = 'none';

            setTimeout(() => {
                btnCheckoutText.textContent = originalText;
                btnCheckoutSubmit.style.opacity = '1';
                btnCheckoutSubmit.style.pointerEvents = 'auto';

                // Activate Pro
                saveProState(true);

                // Sync settings toggle if it exists
                if (testProModeToggle) testProModeToggle.checked = true;

                closeSubscriptionModal();
                showToast('🎉 <strong>Welcome to Breeze PRO!</strong> All features are now unlocked.', 4500);
            }, 1200);
        });
    }

    // Settings Pro Mode Switch (For easy testing)
    if (testProModeToggle) {
        testProModeToggle.checked = isProUser;
        const statusBadge = document.getElementById('settings-pro-badge');

        function updateStatusBadge() {
            if (!statusBadge) return;
            if (isProUser) {
                statusBadge.textContent = 'PRO ACTIVE';
                statusBadge.classList.remove('free');
                statusBadge.classList.add('active');
            } else {
                statusBadge.textContent = 'FREE TIER';
                statusBadge.classList.remove('active');
                statusBadge.classList.add('free');
            }
        }

        // Initial setup
        updateStatusBadge();

        testProModeToggle.addEventListener('change', (e) => {
            saveProState(e.target.checked);
            updateStatusBadge();
            if (isProUser) {
                showToast('🧪 Pro Mode Activated (Demo)');
            } else {
                showToast('🧪 Free Mode Activated (Demo)');
            }
        });
    }

    // Initial Sync & Render
    syncSettingsUI();
    rerenderAllViews();
});
