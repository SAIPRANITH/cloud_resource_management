# Cloud Resource Management Platform

A full-stack cloud resource provisioning and monitoring platform. This application allows users to allocate virtual machines, databases, and storage instances while tracking real-time telemetry and managing automated billing.

## Features

- **Role-Based Access Control**: Distinct Admin and Customer portals.
- **Resource Allocation**: Provision Virtual Machines, Databases, Storage, and Load Balancers.
- **Telemetry & Monitoring**: Real-time visualizations for CPU, RAM, and network throughput using Recharts.
- **Billing Engine**: Automated invoice generation based on resource usage and pricing tiers.
- **Theme Support**: Fully integrated dark and light mode UI.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Recharts, Lucide React
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: SQLite
- **Authentication**: JWT & bcrypt

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/SAIPRANITH/cloud_resource_management.git
   cd cloud_resource_management
   ```

2. Setup the Backend:
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   node seed.js
   ```

3. Setup the Frontend:
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

If needed, create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
JWT_SECRET=your_jwt_secret_key
DATABASE_URL="file:./dev.db"
```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

### Demo Credentials

- **Admin Account**: `admin@cloud.local` / `password123`
- **Customer Account**: `demo@cloud.local` / `password123`

## License

MIT
