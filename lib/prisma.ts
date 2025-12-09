import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ Prisma Client Error: DATABASE_URL environment variable is not set.')
    if (process.env.NODE_ENV === 'production') {
      // In production, we should still create the client but it will fail on first query
      // This allows the app to build even if DATABASE_URL is missing
    }
  }

  try {
    // Optimize Prisma Client for performance
    // Only log errors in development, not queries (too slow)
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error"] : ["error"],
      // Connection pool settings for better performance
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  } catch (error) {
    console.error("Failed to create Prisma Client:", error)
    throw error
  }
}

// Cache Prisma client in both development and production (important for serverless)
const prisma = globalForPrisma.prisma || createPrismaClient()

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

// Don't connect eagerly - let it connect on first query
// This prevents connection errors on startup

export default prisma
export { prisma }
