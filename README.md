<p align="center">
  <img src="https://res.cloudinary.com/dnl6b6gaq/image/upload/v1777422337/Screenshot_2026-04-29_at_12.24.42_PM_nfryib.png" width="100%">
</p>

# WatGig - Event Discovery & Management

WatGig is a full-stack platform for discovering, saving, and managing live music events. It features a modern, cinematic interface with a focus on visual impact and user-centric features like a personal event calendar.

## 🚀 Features

### Event Discovery
- **Dynamic Hero Sections**: Visually rich headers with cinematic gradients that blend seamlessly into the content.
- **Filter System**: Filter events by category (Featured, This Week, This Month) and musical genre.
- **Historical Labels**: Clear visual indicators (amber badges) for events that have already occurred.
- **Interactive Maps**: View event locations using integrated Leaflet maps.

### User Experience
- **Notification System**: In-app alerts when a followed user creates a new event.
- **Personal Event Calendar**: A custom monthly calendar for users to view and manage their saved events.
- **Responsive Design**: Fully optimized for mobile with a custom purple hamburger menu and fullscreen overlay.
- **Smooth Navigation**: Global scroll-to-top behavior ensuring a seamless transition between views.

### Management & Authentication
- **Secure Auth**: Full authentication integration using Auth0.
- **Event Management**: Create, edit, and delete events with dedicated forms and validation.
- **Profile Customization**: Users can manage their roles (User, Band, Venue), bios, and profile images.
- **Image Uploads**: Secure image hosting via Cloudinary integration.

## 🛠️ Tech Stack

### Frontend
- **React 18** (TypeScript)
- **Vite** for fast development and bundling
- **Tailwind CSS** for modern, utility-first styling
- **TanStack Query (React Query)** for robust server-state management
- **React Router 7** for declarative routing
- **date-fns** for precise date manipulation and calendar logic

### Backend
- **Node.js & Express**
- **Knex.js** for query building and migrations
- **SQLite3** for lightweight local development and **PostgreSQL** in production
- **Auth0** for identity management and API protection

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js 22.12 or later in the Node 22 release line**
- **npm**
- An **Auth0** account and application credentials
- A **Cloudinary** account for image uploads

## 🏁 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd watgig
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory and add your credentials:
   ```env
   # Auth0
   VITE_AUTH0_DOMAIN=your-domain.auth0.com
   VITE_AUTH0_CLIENT_ID=your-client-id
   VITE_AUTH0_AUDIENCE=your-api-audience

   # Cloudinary
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-preset

   # Production database (Render supplies DATABASE_URL for managed PostgreSQL)
   DATABASE_URL=postgresql://user:password@host:5432/database
   # Leave certificate verification enabled. Only disable it for a database
   # provider that explicitly requires an unverified TLS connection.
   DB_SSL_REJECT_UNAUTHORIZED=true
   ```

4. **Initialize the Database**
   Run the migrations and seeds to set up the SQLite database:
   ```bash
   npm run knex migrate:latest
   npm run knex seed:run
   ```

5. **Run the Development Server**
   Start both the frontend and backend concurrently:
   ```bash
   npm run dev
   ```
   The client will be available at `http://localhost:5173` and the server at `http://localhost:3000`.

## 🧪 Testing

The project uses **Vitest** for unit and integration testing.
```bash
# Run all tests once
npm test -- --run

# Run tests in watch mode
npm test
```

## 📜 Scripts

- `npm run dev`: Starts the dev server for both client and server.
- `npm run build`: Bundles the project for production.
- `npm run typecheck`: Checks TypeScript types without generating files.
- `npm start`: Runs the production server.
- `npm run lint`: Checks for code style issues.
- `npm run knex`: Helper for Knex CLI commands.

## Render deployment

Use Node 22 and configure the web service with these commands:

```text
Build command:      npm run render:build
Pre-deploy command: npm run render:migrate
Start command:      npm run render:start
```

The pre-deploy command applies database migrations before the new version starts serving traffic. Do not run production seeds automatically. Configure `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`, the Cloudinary variables, and `DATABASE_URL` in Render. Keep `DB_SSL_REJECT_UNAUTHORIZED=true` unless your database provider documents otherwise.

As a defence against accidental data loss, the Knex command wrapper refuses to run seeds when `NODE_ENV=production`. The Render start command also applies any pending migrations before starting the server, which provides a fallback for plans without pre-deploy commands.

---
Built with ❤️ for the live music community.
