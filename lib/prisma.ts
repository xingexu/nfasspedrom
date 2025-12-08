import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
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
