import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    const error = new Error(
      'DATABASE_URL environment variable is not set. ' +
      'Please set it in your Vercel project settings or .env file.'
    )
    console.error('❌ Prisma Client Error:', error.message)
    if (process.env.NODE_ENV === 'production') {
      // In production, we should still create the client but it will fail on first query
      // This allows the app to build even if DATABASE_URL is missing
    }
  }

  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
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

export default prisma
export { prisma }
