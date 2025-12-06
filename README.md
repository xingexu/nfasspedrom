# n/fäss - Personal Blog

A production-quality personal blog for Pedrom Basidj built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and TipTap.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up the database:**
   ```bash
   npx prisma db push
   ```

3. **Add the logo:**
   - Place your logo image at `/public/nfass-logo.png`
   - The logo should be the "n/fäss" wordmark in bright red (#FF0033) on white

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login
   - Admin credentials:
     - Username: `pedrombasidj`
     - Password: `bigguy !RY7!@gak`

## Features

- **Rich Text Editor**: TipTap editor with syntax highlighting, images, links, and more
- **Image Uploads**: Drag and drop or paste images directly into posts
- **Admin Panel**: Full CRUD operations for blog posts
- **Filtering**: Filter posts by year and month
- **Responsive Design**: Modern, clean UI with Tailwind CSS
- **Authentication**: JWT-based authentication with httpOnly cookies

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM with PostgreSQL (production) / SQLite (development)
- TipTap Rich Text Editor
- JWT Authentication (jose)
- Lowlight for syntax highlighting

## Project Structure

```
app/
  ├── layout.tsx          # Root layout with fonts
  ├── page.tsx            # Home page with post list
  ├── blog/[slug]/        # Individual blog post pages
  ├── journal/            # Journal page (redirects to home)
  └── admin/              # Admin panel
      ├── login/          # Login page
      └── posts/          # Post management
components/
  ├── Navbar.tsx          # Navigation bar
  ├── Footer.tsx          # Footer
  ├── PostCard.tsx        # Post card component
  ├── PostListFilters.tsx # Year/month filters
  ├── PostEditor.tsx      # Post editor form
  ├── AdminShell.tsx      # Admin layout wrapper
  ├── ImageUploadZone.tsx # Image upload component
  └── Editor/
      └── TipTapEditor.tsx # Rich text editor
lib/
  ├── prisma.ts           # Prisma client
  ├── auth.ts             # Authentication utilities
  ├── slug.ts             # Slug generation
  └── filters.ts           # Filter utilities
api/
  ├── auth/               # Authentication endpoints
  ├── posts/              # Post CRUD endpoints
  └── uploads/            # Image upload endpoint
```

## Environment Variables

Create a `.env` file in the root directory:

**For Local Development (SQLite):**
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
```

**For Production (PostgreSQL):**
```
DATABASE_URL="postgresql://user:password@host:port/database"
JWT_SECRET="your-secret-key-change-in-production"
```

## Vercel Deployment

This project is configured for deployment on Vercel:

1. **Connect your GitHub repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect Next.js

2. **Set up a PostgreSQL database**
   - Use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (recommended)
   - Or use [Supabase](https://supabase.com), [Neon](https://neon.tech), or any PostgreSQL provider
   - Copy the connection string to your `DATABASE_URL` environment variable

3. **Configure Environment Variables in Vercel**
   - Go to your project settings → Environment Variables
   - Add `DATABASE_URL` with your PostgreSQL connection string
   - Add `JWT_SECRET` with a secure random string

4. **Deploy**
   - Push to your main branch or use Vercel's deploy button
   - Vercel will automatically run `prisma generate` and `next build`
   - After deployment, run `npx prisma db push` via Vercel CLI or connect to your database directly to set up the schema

5. **Run database migrations**
   ```bash
   npx prisma db push
   ```
   Or use Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Notes

- Images are stored in `/public/uploads/` (for local development)
- For production, consider using a cloud storage service like Vercel Blob, AWS S3, or Cloudinary
- The database schema is defined in `prisma/schema.prisma`
- Make sure to add your logo image at `/public/nfass-logo.JPG` before running the app



