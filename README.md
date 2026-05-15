# Urbanova - Green Mobility Dashboard

**Urbanova** is a high-performance Full-Stack platform engineered for sustainable mobility management within a Smart City ecosystem. The system facilitates real-time monitoring of bike-sharing fleets and municipal electric vehicles, integrated with traffic flow analytics and environmental impact assessment.

## Key Features

- **Live Fleet Tracking:** Real-time geolocated monitoring of stations and vehicles via an interactive map interface.
- **Maintenance Management:** A specialized multi-step workflow for fault reporting and technical intervention scheduling.
- **Green Analytics:** Interactive data visualization highlighting real-time $CO_2$ savings and fleet utilization trends.
- **Smart Filtering:** Advanced search and filter engine for vehicle status, category, and battery health.

## Setup Environment Variables

To run the map correctly, you need a Mapbox Access Token:

1. Create a `.env` file in the root directory.
2. Add your token like this:
   `VITE_MAPBOX_TOKEN=pk.eyJ1Ijoia2F3ZWFzd2VsbCIsImEiOiJjbW9jbW53OWYwMmVxMzFxb3Y0YTQ4eDh2In0.nKAYZb-IEYEOLvfHTuntdw`

## Tech Stack

### Frontend

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **State Management:** TanStack Query (React Query)
- **Routing:** React Router DOM
- **Charts:** Recharts / Tremor

### Backend & Infrastructure (Expected)

- **Runtime:** Node.js + TypeScript
- **Database:** PostgreSQL (with PostGIS for geospatial queries)
- **ORM:** Prisma
- **Authentication:** Supabase Auth (or NextAuth.js / Clerk)
- **Cloud Services:** Supabase (Database, Auth, and Real-time)

## Project Structure (Atomic Design)

```text
src/
├── components/
│   ├── atoms/       # Base components (Buttons, Badges, Inputs)
│   ├── molecules/   # Compound components (FormField, StatCard, MapMarker)
│   ├── organisms/   # Complex structures (Navbar, MaintenanceForm, FleetTable)
│   └── templates/   # Page-level layouts
├── pages/           # View layer (Overview, Map, Analytics)
├── hooks/           # Custom state and fetching logic
├── services/        # API clients and Supabase configuration
└── utils/           # Helper functions for CO2 calculations and formatting
```

## Add new routes with react-router:

In routes.ts:

```
{
path: '/your-path',
component: YourPage,
name: 'Your Page Name',
},
```

Features:

Lazy loading - pages are loaded on demand for better performance
Dynamic URL generation - use generateUrl('/path/:id', { id: '123' }) helper
Type-safe routes - full TypeScript support
Auto-generated sidebar - navigation updates automatically
404 handling - wildcard route catches unmatched paths
