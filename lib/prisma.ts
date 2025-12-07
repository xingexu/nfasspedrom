import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  // Validate DATABASE_URL before creating client
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL environment variable is not set. Please check your .env file.'
    )
  }

  const dbUrl = process.env.DATABASE_URL
  const isValidUrl =
    dbUrl.startsWith('postgresql://') ||
    dbUrl.startsWith('postgres://') ||
    dbUrl.startsWith('file:') ||
    dbUrl.startsWith('sqlite:')

  if (!isValidUrl) {
    throw new Error(
      `Invalid DATABASE_URL format. Expected postgresql://, postgres://, file:, or sqlite:, got: ${dbUrl.substring(0, 30)}...`
    )
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  })
}

// Cache Prisma client in both development and production (important for serverless)
export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
