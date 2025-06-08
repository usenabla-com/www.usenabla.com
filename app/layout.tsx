import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import ProfileModalProvider from "@/components/profile-modal-provider"

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })

export const metadata: Metadata = {
  title: "Atelier Logos | LLM Solutions Studio",
  description: "",
  generator: 'v0.dev',
  manifest: '/manifest.json'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Atelier Logos" />
      </head>
      <body className={cormorant.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ProfileModalProvider>
            {children}
          </ProfileModalProvider>
        </ThemeProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              console.log('🔔 Push notification script loading...');
              
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  console.log('🔄 Registering service worker...');
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('✅ ServiceWorker registration successful');
                      
                      // Check if we should show notification modal for new users
                      setTimeout(() => {
                        checkAndShowNotificationModal();
                      }, 2000);
                    })
                    .catch(function(err) {
                      console.error('❌ ServiceWorker registration failed:', err);
                    });
                });
              }

              // Listen for custom event to show user info modal (from auth callback)
              window.addEventListener('showUserInfoModal', function() {
                console.log('📱 Showing user info modal from auth callback');
                window.dispatchEvent(new CustomEvent('openProfileModal'));
              });

              function urlBase64ToUint8Array(base64String) {
                const padding = '='.repeat((4 - base64String.length % 4) % 4);
                const base64 = (base64String + padding)
                  .replace(/-/g, '+')
                  .replace(/_/g, '/');

                const rawData = window.atob(base64);
                const outputArray = new Uint8Array(rawData.length);

                for (let i = 0; i < rawData.length; ++i) {
                  outputArray[i] = rawData.charCodeAt(i);
                }
                return outputArray;
              }

              async function checkAndShowNotificationModal() {
                console.log('🔍 Checking if we should show notification modal...');
                
                if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                  console.log('❌ Push notifications not supported');
                  return;
                }

                const currentPermission = Notification.permission;
                console.log('🔐 Current permission status:', currentPermission);

                // Only show modal for new users (permission not determined)
                if (currentPermission === 'default') {
                  try {
                    const registration = await navigator.serviceWorker.ready;
                    const existingSubscription = await registration.pushManager.getSubscription();
                    
                    if (!existingSubscription) {
                      console.log('📱 New user detected - showing notification modal');
                      showNotificationModal();
                    }
                  } catch (error) {
                    console.error('❌ Error checking subscription status:', error);
                  }
                } else {
                  console.log('👤 Returning user - no modal needed');
                }
              }

              function showNotificationModal() {
                // Create modal overlay
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px);';

                // Create modal content
                const modal = document.createElement('div');
                modal.style.cssText = 'background: white; border-radius: 16px; padding: 32px; max-width: 400px; margin: 20px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); text-align: center; position: relative;';

                modal.innerHTML = '<div style="font-size: 48px; margin-bottom: 16px;">🔔</div>' +
                  '<h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #1f2937;">Stay Updated</h2>' +
                  '<p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.5;">Get notified about new features, updates, and important announcements from Atelier Logos.</p>' +
                  '<div style="display: flex; gap: 12px; justify-content: center;">' +
                    '<button id="enableNotifications" style="background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Enable Notifications</button>' +
                    '<button id="skipNotifications" style="background: #f3f4f6; color: #6b7280; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Maybe Later</button>' +
                  '</div>';

                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                // Add hover effects
                const enableBtn = modal.querySelector('#enableNotifications');
                const skipBtn = modal.querySelector('#skipNotifications');

                enableBtn.addEventListener('mouseenter', () => {
                  enableBtn.style.background = '#2563eb';
                  enableBtn.style.transform = 'translateY(-1px)';
                });
                enableBtn.addEventListener('mouseleave', () => {
                  enableBtn.style.background = '#3b82f6';
                  enableBtn.style.transform = 'translateY(0)';
                });

                skipBtn.addEventListener('mouseenter', () => {
                  skipBtn.style.background = '#e5e7eb';
                });
                skipBtn.addEventListener('mouseleave', () => {
                  skipBtn.style.background = '#f3f4f6';
                });

                // Handle enable notifications
                enableBtn.addEventListener('click', async () => {
                  enableBtn.innerHTML = '⏳ Requesting...';
                  enableBtn.disabled = true;
                  skipBtn.disabled = true;

                  try {
                    console.log('🔐 User chose to enable notifications');
                    const permission = await Notification.requestPermission();
                    console.log('🔐 Permission result:', permission);
                    
                    if (permission === 'granted') {
                      console.log('✅ Permission granted! Setting up push notifications...');
                      await setupPushNotifications();
                      
                      // Show success state briefly then move to user info collection
                      modal.innerHTML = '<div style="font-size: 48px; margin-bottom: 16px;">✅</div>' +
                        '<h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #059669;">Notifications Enabled!</h2>' +
                        '<p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.5;">Setting up your profile...</p>';
                      
                      // After 1.5 seconds, trigger the React modal
                      setTimeout(() => {
                        overlay.remove();
                        window.dispatchEvent(new CustomEvent('openProfileModal'));
                      }, 1500);
                    } else {
                      console.log('❌ Permission denied');
                      modal.innerHTML = '<div style="font-size: 48px; margin-bottom: 16px;">❌</div>' +
                        '<h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #dc2626;">Permission Denied</h2>' +
                        '<p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.5;">Notifications are blocked. You can enable them later in your browser settings.</p>' +
                        '<button id="continueBtn" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">Continue</button>';
                      
                      modal.querySelector('#continueBtn').addEventListener('click', () => {
                        overlay.remove();
                      });
                    }
                  } catch (error) {
                    console.error('❌ Error requesting permission:', error);
                    modal.innerHTML = '<div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>' +
                      '<h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #dc2626;">Something went wrong</h2>' +
                      '<p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.5;">Unable to enable notifications. Please try again later.</p>' +
                      '<button id="continueErrorBtn" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">Continue</button>';
                    
                    modal.querySelector('#continueErrorBtn').addEventListener('click', () => {
                      overlay.remove();
                    });
                  }
                });

                // Handle skip
                skipBtn.addEventListener('click', () => {
                  console.log('👤 User chose to skip notifications');
                  overlay.remove();
                });

                // Close on overlay click
                overlay.addEventListener('click', (e) => {
                  if (e.target === overlay) {
                    overlay.remove();
                  }
                });
              }

              async function setupPushNotifications() {
                try {
                  console.log('📋 Setting up push notifications...');
                  const registration = await navigator.serviceWorker.ready;

                  console.log('🔑 Fetching VAPID public key...');
                  const response = await fetch('/api/push');
                  
                  if (!response.ok) {
                    throw new Error('Failed to fetch VAPID key: ' + response.status);
                  }
                  
                  const data = await response.json();
                  console.log('🔑 VAPID key received');

                  console.log('📝 Subscribing to push notifications...');
                  const subscription = await registration.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlBase64ToUint8Array(data.publicKey)
                  });

                  console.log('📤 Saving subscription to API...');
                  
                  // Save to API endpoint
                  const subscribeResponse = await fetch('/api/push', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      action: 'subscribe',
                      subscription: subscription
                    })
                  });

                  if (!subscribeResponse.ok) {
                    throw new Error('Failed to save subscription');
                  }

                  console.log('✅ Successfully subscribed to push notifications');
                  
                } catch (error) {
                  console.error('❌ Error setting up push notifications:', error);
                  throw error;
                }
              }
            `,
          }}
        />
      </body>
    </html>
  )
}
