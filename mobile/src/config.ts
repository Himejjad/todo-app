import Constants from 'expo-constants';

// Allow overriding via environment variable at build time or runtime extra
const manifestExtra: any = Constants.expoConfig?.extra || (Constants as any).manifest?.extra || {};

export const API_BASE_URL = (manifestExtra.apiBaseUrl as string) || 'http://localhost:5000/api';
export const OFFLINE_MODE: boolean = manifestExtra.offlineMode === true;
