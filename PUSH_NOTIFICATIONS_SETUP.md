# Web Push Notifications Setup

This project now includes complete Web Push notification support. Follow these steps to get it working:

## 1. Environment Variables

Create a `.env.local` file in your project root and add the following VAPID keys:

```env
# VAPID Keys for Web Push Notifications
VAPID_PUBLIC_KEY=BLE7qLVw-YrcZqGFI8fmIWBlYVD2tGvoOrYMDcY4n84S8Ef6hsh5qUBfHl4dnC3-yV4Q3pQ-4gE19MVll_ayoEo
VAPID_PRIVATE_KEY=G-kjKIedYJQgnjVRFOdcFM0L8LreGiD0rb-y9F_PCgY
VAPID_SUBJECT=mailto:contact@atelierlogos.studio
```

**Note**: Replace the email address with your actual contact email.

## 2. Generate New VAPID Keys (Optional)

If you want to generate your own VAPID keys, run:

```bash
node scripts/generate-vapid-keys.js
```

## 3. Files Created

The following files have been created/modified:

### API Route
- `app/api/push/route.ts` - Handles subscription management and sending notifications

### Service Worker & Manifest
- `public/sw.js` - Service worker for handling push notifications
- `public/manifest.json` - Web app manifest for PWA support

### React Components & Hooks
- `hooks/use-push-notifications.ts` - Custom hook for push notification management
- `components/push-notification-demo.tsx` - Demo component to test notifications

### Layout Updates
- `app/layout.tsx` - Updated to register service worker and include manifest

## 4. Usage

Import and use the demo component in any page:

```tsx
import { PushNotificationDemo } from '@/components/push-notification-demo'

export default function Page() {
  return (
    <div>
      <PushNotificationDemo />
    </div>
  )
}
```

## 5. API Endpoints

### GET /api/push
Returns the public VAPID key and subscription count.

### POST /api/push
Handles three actions:

1. **Subscribe**: `{ action: 'subscribe', subscription: PushSubscription }`
2. **Unsubscribe**: `{ action: 'unsubscribe', subscription: PushSubscription }`
3. **Send**: `{ action: 'send', message: { title: string, body: string, data?: any } }`

## 6. Testing

1. Start your development server: `bun dev`
2. Open your app in a browser (must be HTTPS in production)
3. Use the demo component to subscribe to notifications
4. Send test notifications to verify everything works

## 7. Production Notes

- Replace the in-memory subscription storage with a database
- Ensure your domain supports HTTPS
- Consider implementing user authentication for subscription management
- Monitor and handle failed notification deliveries
- Implement proper error logging and monitoring

## 8. Browser Support

Push notifications are supported in:
- Chrome 42+
- Firefox 44+
- Safari 16+
- Edge 17+

The service worker will gracefully handle unsupported browsers. 