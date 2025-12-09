import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'DATABASE_URL environment variable is not set',
          database: 'not_configured',
        },
        { status: 500 }
      )
    }

    // Try to connect to the database
    await prisma.$connect()
    
    // Try a simple query
    await prisma.$queryRaw`SELECT 1`
    
    // Check if tables exist
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `
    
    const tableNames = tables.map(t => t.tablename)
    const hasPostTable = tableNames.includes('Post')
    const hasImageTable = tableNames.includes('Image')
    
    await prisma.$disconnect()

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      tables: {
        Post: hasPostTable,
        Image: hasImageTable,
        all: tableNames,
      },
      message: hasPostTable && hasImageTable 
        ? 'Database is connected and migrations are applied'
        : 'Database is connected but migrations may not be applied',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        status: 'error',
        message: error?.message || 'Database connection failed',
        database: 'error',
        error: process.env.NODE_ENV === 'development' ? error?.message : undefined,
      },
      { status: 500 }
    )
  }
}


