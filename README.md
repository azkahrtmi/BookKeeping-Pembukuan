# FinTrack - Personal Bookkeeping Application

A beautiful, user-friendly application for tracking personal finances, built with modern web technologies.

## Features

- **User Authentication:** Secure signup and login functionality
- **Dashboard:** Visual summary of income, expenses, and balance with interactive charts
- **Income & Expense Management:** Add, view, and manage all transactions
- **Categorization:** Organize transactions with predefined and custom categories
- **Date Filtering:** Filter transactions and reports by different time periods
- **Responsive Design:** Works beautifully on all devices

## Tech Stack

- **Frontend:** React.js, TypeScript, Tailwind CSS, Chart.js, Zustand, React Router
- **Backend:** Supabase (Authentication, Database)
- **Styling:** Tailwind CSS with custom components
- **Notifications:** React Hot Toast

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and update with your Supabase credentials
4. Start the development server:
   ```
   npm run dev
   ```

## Database Setup

1. Create a new project in Supabase
2. Connect to Supabase by clicking the "Connect to Supabase" button
3. Run the migrations from the `supabase/migrations` folder to set up the database schema

## Deployment

The application can be deployed to any static hosting service like Netlify, Vercel, or GitHub Pages.
