# Kafe Ara Menu

This is a Next.js application for displaying a menu and managing it via an admin interface.

## Features

*   Bilingual menu (English and Turkish)
*   Admin panel for adding, editing, and deleting menu items
*   Menu data stored in a local JSON file (for this setup)
*   Responsive design

## Setup

1.  **Clone the repository:**
    ```bash
    git clone <your-github-repo-url>
    cd kafearamenu
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running Locally

To run the application locally with the admin panel and persistent data changes, you need to start the Next.js development server:

```bash
npm run dev
```

This will start the server at `http://localhost:3000`.

*   **Main Menu:** Access the public menu at `http://localhost:3000`
*   **Admin Login:** Access the admin login page at `http://localhost:3000/admin`

## Admin Panel

*   **Login Page:** `/admin`
*   **Default Credentials:**
    *   Username: `admin`
    *   Password: `admin123`

Once logged in, you can manage the menu categories and items. Changes made here will update the `data/menu-data.json` file in your project directory (when running locally or on a Node.js-compatible server like Vercel).

## Deployment

This project is configured to be easily deployed to platforms like Vercel, which support Next.js applications with API routes.

1.  Commit your changes to your GitHub repository.
2.  Link your GitHub repository to Vercel.
3.  Vercel will automatically detect it's a Next.js project and deploy it.

**Important:** Static hosting providers (like some free cPanel hosting) typically *do not* support the API routes needed for the admin panel's persistence. You need a hosting provider that supports Node.js/Next.js servers.

## Project Structure

*   `app/`: Contains your Next.js pages and API routes.
    *   `admin/`: Admin pages.\n    *   `api/`: API routes (e.g., `api/menu/route.ts`).
*   `components/`: Reusable React components.
*   `data/`: Contains your `menu-data.json` file.
*   `public/`: Static assets like images.
*   `styles/`: Global styles.
*   `lib/`: Utility functions.

## Contributing

Feel free to fork the repository and contribute!
