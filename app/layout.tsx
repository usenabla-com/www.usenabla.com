import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

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
          {children}
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
                      
                      // After 1.5 seconds, show the user info modal
                      setTimeout(() => {
                        overlay.remove();
                        showUserInfoModal();
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

              function showUserInfoModal() {
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px); padding: 20px; box-sizing: border-box;';

                const modal = document.createElement('div');
                modal.style.cssText = 'background: white; border-radius: 16px; padding: 32px; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); position: relative;';

                modal.innerHTML = '<div style="text-align: center; margin-bottom: 24px;">' +
                  '<div style="font-size: 48px; margin-bottom: 16px;">👤</div>' +
                  '<h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #1f2937;">Complete Your Profile</h2>' +
                  '<p style="margin: 0; color: #6b7280; font-size: 14px;">Join the Atelier Logos community</p>' +
                '</div>' +
                '<form id="userInfoForm" style="display: flex; flex-direction: column; gap: 16px;">' +
                  '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">' +
                    '<div>' +
                      '<label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 14px;">First Name</label>' +
                      '<input type="text" name="firstName" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />' +
                    '</div>' +
                    '<div>' +
                      '<label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 14px;">Last Name</label>' +
                      '<input type="text" name="lastName" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />' +
                    '</div>' +
                  '</div>' +
                  '<div>' +
                    '<label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 14px;">Email <span style="color: #dc2626;">*</span></label>' +
                    '<input type="email" name="email" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />' +
                  '</div>' +
                  '<div>' +
                    '<label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 14px;">Company Name</label>' +
                    '<input type="text" name="company" style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />' +
                  '</div>' +
                  '<div>' +
                    '<label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 14px;">LinkedIn URL</label>' +
                    '<input type="url" name="linkedin" placeholder="https://linkedin.com/in/..." style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />' +
                  '</div>' +
                  '<div>' +
                    '<label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 14px;">Curation Prompt <span style="color: #dc2626;">*</span></label>' +
                    '<textarea name="curationPrompt" required placeholder="Tell us what kind of content you would like to see in your feed..." style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; min-height: 80px; resize: vertical; box-sizing: border-box;"></textarea>' +
                  '</div>' +
                  '<div>' +
                    '<label style="display: block; margin-bottom: 4px; font-weight: 500; color: #374151; font-size: 14px;">Profile Picture <span style="color: #dc2626;">*</span></label>' +
                    '<input type="file" name="profilePic" accept="image/*" required style="width: 100%; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; box-sizing: border-box;" />' +
                    '<div id="imagePreview" style="margin-top: 8px; text-align: center;"></div>' +
                  '</div>' +
                  '<div style="display: flex; gap: 12px; margin-top: 8px;">' +
                    '<button type="button" id="cancelUserInfo" style="flex: 1; background: #f3f4f6; color: #6b7280; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Cancel</button>' +
                    '<button type="submit" style="flex: 1; background: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Continue</button>' +
                  '</div>' +
                '</form>';

                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                // Handle image preview
                const fileInput = modal.querySelector('input[name="profilePic"]');
                const imagePreview = modal.querySelector('#imagePreview');
                let selectedImageFile = null;

                fileInput.addEventListener('change', (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    selectedImageFile = file;
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      imagePreview.innerHTML = '<img src="' + e.target.result + '" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid #e5e7eb;" />';
                    };
                    reader.readAsDataURL(file);
                  }
                });

                // Handle form submission
                const form = modal.querySelector('#userInfoForm');
                form.addEventListener('submit', (e) => {
                  e.preventDefault();
                  
                  const formData = new FormData(form);
                  const userData = {
                    firstName: formData.get('firstName'),
                    lastName: formData.get('lastName'),
                    email: formData.get('email'),
                    company: formData.get('company'),
                    linkedin: formData.get('linkedin'),
                    curationPrompt: formData.get('curationPrompt'),
                    profilePic: selectedImageFile
                  };

                  // Convert image to base64 for preview
                  if (selectedImageFile) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      userData.profilePicUrl = e.target.result;
                      overlay.remove();
                      showConfirmationModal(userData);
                    };
                    reader.readAsDataURL(selectedImageFile);
                  } else {
                    overlay.remove();
                    showConfirmationModal(userData);
                  }
                });

                // Handle cancel
                modal.querySelector('#cancelUserInfo').addEventListener('click', () => {
                  overlay.remove();
                });

                // Close on overlay click
                overlay.addEventListener('click', (e) => {
                  if (e.target === overlay) {
                    overlay.remove();
                  }
                });
              }

              function showConfirmationModal(userData) {
                const overlay = document.createElement('div');
                overlay.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; backdrop-filter: blur(4px); padding: 20px; box-sizing: border-box;';

                const modal = document.createElement('div');
                modal.style.cssText = 'background: white; border-radius: 16px; padding: 32px; max-width: 450px; width: 100%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); position: relative;';

                const displayName = [userData.firstName, userData.lastName].filter(Boolean).join(' ') || 'Member';
                const profileImage = userData.profilePicUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiNmM2Y0ZjYiLz48Y2lyY2xlIGN4PSI1MCIgY3k9IjM3IiByPSIxMiIgZmlsbD0iIzZiNzI4MCIvPjxwYXRoIGQ9Im0yNSA3NWMwLTEzLjggMTEuMi0yNSAyNS0yNXMyNSAxMS4yIDI1IDI1IiBmaWxsPSIjNmI3MjgwIi8+PC9zdmc+';

                modal.innerHTML = '<div style="text-align: center; margin-bottom: 24px;">' +
                  '<div style="font-size: 48px; margin-bottom: 16px;">🎉</div>' +
                  '<h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 600; color: #1f2937;">Welcome to Atelier Logos!</h2>' +
                  '<p style="margin: 0; color: #6b7280; font-size: 14px;">Please confirm your membership details</p>' +
                '</div>' +
                '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; color: white; position: relative; overflow: hidden;">' +
                  '<div style="position: absolute; top: -20px; right: -20px; width: 80px; height: 80px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>' +
                  '<div style="position: absolute; bottom: -10px; left: -10px; width: 40px; height: 40px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>' +
                  '<div style="display: flex; align-items: center; gap: 16px; position: relative;">' +
                    '<img src="' + profileImage + '" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; border: 3px solid rgba(255,255,255,0.3);" />' +
                    '<div style="flex: 1;">' +
                      '<h3 style="margin: 0 0 4px 0; font-size: 18px; font-weight: 600;">' + displayName + '</h3>' +
                      '<p style="margin: 0 0 2px 0; opacity: 0.9; font-size: 14px;">' + userData.email + '</p>' +
                      (userData.company ? '<p style="margin: 0; opacity: 0.8; font-size: 12px;">' + userData.company + '</p>' : '') +
                    '</div>' +
                  '</div>' +
                  '<div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.2);">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                      '<span style="font-size: 12px; opacity: 0.8;">MEMBER SINCE</span>' +
                      '<span style="font-size: 12px; font-weight: 600;">' + new Date().getFullYear() + '</span>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
                '<div style="display: flex; gap: 12px;">' +
                  '<button id="editProfile" style="flex: 1; background: #f3f4f6; color: #6b7280; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Edit</button>' +
                  '<button id="confirmProfile" style="flex: 1; background: #059669; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s ease;">Confirm & Join</button>' +
                '</div>';

                overlay.appendChild(modal);
                document.body.appendChild(overlay);

                // Handle edit
                modal.querySelector('#editProfile').addEventListener('click', () => {
                  overlay.remove();
                  showUserInfoModal();
                });

                // Handle confirm
                modal.querySelector('#confirmProfile').addEventListener('click', async () => {
                  const confirmBtn = modal.querySelector('#confirmProfile');
                  confirmBtn.innerHTML = '⏳ Creating Profile...';
                  confirmBtn.disabled = true;

                  try {
                    // Save to Supabase (stub)
                    await saveUserProfile(userData);
                    
                    // Show final success
                    modal.innerHTML = '<div style="text-align: center;">' +
                      '<div style="font-size: 64px; margin-bottom: 16px;">✅</div>' +
                      '<h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #059669;">Welcome Aboard!</h2>' +
                      '<p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.5;">Your Atelier Logos profile has been created successfully. You will start receiving curated content based on your preferences.</p>' +
                      '<button id="getStartedBtn" style="background: #059669; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-weight: 600; cursor: pointer;">Get Started</button>' +
                    '</div>';
                    
                    modal.querySelector('#getStartedBtn').addEventListener('click', () => {
                      overlay.remove();
                    });
                  } catch (error) {
                    console.error('Error saving profile:', error);
                    modal.innerHTML = '<div style="text-align: center;">' +
                      '<div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>' +
                      '<h2 style="margin: 0 0 16px 0; font-size: 24px; font-weight: 600; color: #dc2626;">Something went wrong</h2>' +
                      '<p style="margin: 0 0 24px 0; color: #6b7280; line-height: 1.5;">Unable to create your profile. Please try again later.</p>' +
                      '<button id="continueProfileErrorBtn" style="background: #6b7280; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">Continue</button>' +
                    '</div>';
                    
                    modal.querySelector('#continueProfileErrorBtn').addEventListener('click', () => {
                      overlay.remove();
                    });
                  }
                });

                // Close on overlay click
                overlay.addEventListener('click', (e) => {
                  if (e.target === overlay) {
                    overlay.remove();
                  }
                });
              }

              async function saveUserProfile(userData) {
                // Supabase integration stub
                console.log('💾 Saving user profile to Supabase:', userData);
                
                // Simulate API call
                return new Promise((resolve, reject) => {
                  setTimeout(() => {
                    // Simulate success/failure
                    if (Math.random() > 0.1) { // 90% success rate
                      console.log('✅ Profile saved successfully');
                      resolve({ success: true, id: 'user_' + Date.now() });
                    } else {
                      console.error('❌ Failed to save profile');
                      reject(new Error('Database error'));
                    }
                  }, 2000);
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

                  console.log('📤 Sending subscription to server...');
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
