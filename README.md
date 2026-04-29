# WatGig - Event Discovery & Management

WatGig is a full-stack platform for discovering, saving, and managing live music events. It features a modern, cinematic interface with a focus on visual impact and user-centric features like a personal event calendar.

## 🚀 Features

### Event Discovery
- **Dynamic Hero Sections**: Visually rich headers with cinematic gradients that blend seamlessly into the content.
- **Filter System**: Filter events by category (Featured, This Week, This Month) and musical genre.
- **Historical Labels**: Clear visual indicators (amber badges) for events that have already occurred.
- **Interactive Maps**: View event locations using integrated Leaflet maps.

### User Experience
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
- **SQLite3** for lightweight, local data storage
- **Auth0** for identity management and API protection

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (LTS version recommended)
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
- `npm start`: Runs the production server.
- `npm run lint`: Checks for code style issues.
- `npm run knex`: Helper for Knex CLI commands.

---
Built with ❤️ for the live music community.