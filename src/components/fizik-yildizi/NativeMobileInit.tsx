'use client';

import { useEffect } from 'react';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications } from '@capacitor/push-notifications';
import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';
import { Capacitor } from '@capacitor/core';

export default function NativeMobileInit() {
  useEffect(() => {
    const initMobile = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          // Set status bar to dark since our app is dark themed
          await StatusBar.setStyle({ style: Style.Dark });
          await StatusBar.setBackgroundColor({ color: '#09090b' });
          
          // Hide splash screen after our app has loaded
          await SplashScreen.hide();

          // Initialize RevenueCat (Premium Subscriptions)
          await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
          if (Capacitor.getPlatform() === 'ios') {
            // await Purchases.configure({ apiKey: "appl_api_key_here" });
          } else if (Capacitor.getPlatform() === 'android') {
            // await Purchases.configure({ apiKey: "goog_api_key_here" });
          }

          // Request Push Notification permissions
          let permStatus = await PushNotifications.checkPermissions();
          if (permStatus.receive === 'prompt') {
            permStatus = await PushNotifications.requestPermissions();
          }
          if (permStatus.receive === 'granted') {
            await PushNotifications.register();
          }

        } catch (err) {
          console.error("Native init error:", err);
        }
      }
    };

    initMobile();
  }, []);

  return null; // This component doesn't render anything
}
