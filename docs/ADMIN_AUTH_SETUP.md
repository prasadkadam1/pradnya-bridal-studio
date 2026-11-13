# Admin Authentication Setup

Admin access uses Firebase Authentication for identity and a Firestore role document for authorization. The browser app does not create users or grant roles.

## Configure Firebase

Set all six required Vite variables in the deployment environment:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

The app treats missing or placeholder values as an unconfigured Firebase setup. Demo login is available only in Vite development mode; production admin access fails closed until Firebase is configured.

## Provision an administrator

1. In Firebase Console, enable Email/Password under Authentication providers.
2. Create the administrator account in Firebase Authentication. Do not add public sign-up to the website.
3. Copy that account's Firebase UID.
4. In Firestore, create `users/{UID}` with at least `{ "role": "admin" }`.
5. Deploy `firestore.rules` and `storage.rules` for the same Firebase project.

The Firestore document ID must exactly match the Authentication UID. The app signs in with Firebase, reads that user's role document, and signs the session back out if the document is missing or its role is not `admin`.

## Access controls

- Admin routes wait for session and role verification and redirect other users to `/admin/login`.
- Firestore and Storage rules independently require the authenticated UID's `users/{uid}.role` to be `admin` for administrative writes and reads.
- The local demo credentials are for development preview only. They are not a production authentication method or a security boundary.

