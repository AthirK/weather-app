import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_API_KEY;

export default function HomeScreen() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEmojiForWeather = (main: string) => {
    if (!main) return '❓';
    const lower = main.toLowerCase();
    if (lower.includes('clear')) return '☀️';
    if (lower.includes('cloud')) return '☁️';
    if (lower.includes('rain') || lower.includes('drizzle')) return '🌧️';
    if (lower.includes('thunder')) return '⛈️';
    if (lower.includes('snow')) return '❄️';
    return '🌤️';
  };

  const handleSearch = async () => {
    if (!city.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError(null);
    setWeather(null);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        city,
      )}&appid=${API_KEY}&units=metric&lang=en`;

      const res = await fetch(url);

      if (!res.ok) {
        if (res.status === 404) throw new Error('City not found.');
        throw new Error('Failed to fetch weather data.');
      }

      const data = await res.json();

      setWeather({
        name: data.name,
        temp: Math.round(data.main.temp),
        description: data.weather[0].description,
        main: data.weather[0].main,
      });

      Keyboard.dismiss();
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather App</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name..."
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.resultContainer}>
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
        {error && !loading && <Text style={styles.error}>{error}</Text>}

        {weather && !loading && (
          <View style={styles.weatherBox}>
            <Text style={styles.icon}>{getEmojiForWeather(weather.main)}</Text>
            <Text style={styles.city}>
              {weather.name}
            </Text>
            <Text style={styles.temp}>{weather.temp}°C</Text>
            <Text style={styles.desc}>{weather.description}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  weatherBox: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
  },
  city: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 8,
  },
  temp: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  desc: {
    fontSize: 18,
    textTransform: 'capitalize',
    marginTop: 4,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});