import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.annur.listenquran',
  appName: 'quranic-audio',
  webDir: 'dist',
  server: {
    url: 'https://a1583c4d-6881-4f80-840b-e1060d10ae8c.lovableproject.com?forceHideBadge=true',
    cleartext: true,
  },
};

export default config;
