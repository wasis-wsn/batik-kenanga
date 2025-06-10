import { useState, useEffect } from 'react';
import { settingsService } from '../services/supabaseService';

export const useSettings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await settingsService.getSettings();
      
      // Convert array to object for easier access
      const settingsObj = {};
      data.forEach(setting => {
        try {
          // Try to parse JSON values
          settingsObj[setting.key] = typeof setting.value === 'string' 
            ? JSON.parse(setting.value)
            : setting.value;
        } catch {
          // If not JSON, store as is
          settingsObj[setting.key] = setting.value;
        }
      });
      
      setSettings(settingsObj);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key, defaultValue = null) => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  const updateSetting = async (key, value) => {
    try {
      const result = await settingsService.updateSetting(key, typeof value === 'object' ? JSON.stringify(value) : value);
      setSettings(prev => ({ ...prev, [key]: value }));
      return result;
    } catch (err) {
      console.error('Error updating setting:', err);
      setError(err);
      throw err;
    }
  };

  const updateMultipleSettings = async (settingsObj) => {
    try {
      const result = await settingsService.updateMultipleSettings(settingsObj);
      setSettings(prev => ({ ...prev, ...settingsObj }));
      return result;
    } catch (err) {
      console.error('Error updating multiple settings:', err);
      setError(err);
      throw err;
    }
  };

  const refresh = () => {
    fetchSettings();
  };

  return {
    settings,
    loading,
    error,
    getSetting,
    updateSetting,
    updateMultipleSettings,
    refresh
  };
};
