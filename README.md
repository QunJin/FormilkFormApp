# FormikFormsApp

## Backend
**Firebase** (Authentication + Firestore)

## Setup Steps

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root with your Firebase config:
   ```
   EXPO_PUBLIC_FIREBASE_API_KEY=...
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   EXPO_PUBLIC_FIREBASE_APP_ID=...
   ```
4. Start the app:
   ```bash
   npx expo start
   ```

## Test Account
You can create a new account from the Sign Up screen.

## Features Implemented (CRUD Checklist)

- [x] **Sign Up** — Create account with Firebase Auth
- [x] **Sign In** — Authenticate with email/password
- [x] **Sign Out** — Log out with confirmation
- [x] **Protected Routes** — Unauthenticated users redirected to Sign In
- [x] **Session Persistence** — Session restored on app launch
- [x] **Create** — Submit Employee Information Form → saved to Firestore
- [x] **Read** — View all submissions in a list screen (real-time updates)
- [x] **Read (Detail)** — View individual employee record details
- [x] **Delete** — Delete a record with confirmation modal
- [x] **Error Handling** — Network errors, auth errors, empty states
- [x] **Loading States** — Spinners during all async operations
- [x] **User-Scoped Data** — Each record linked to authenticated user's UID
- [x] **Environment Variables** — Firebase config stored in `.env`, not hardcoded

## Security
- Firestore Security Rules restrict read/write to authenticated users only
- API keys stored in environment variables (`.env` is in `.gitignore`)
