import type { Request } from 'express'
import { remultApi } from 'remult/remult-express'
import { createKnexDataProvider } from 'remult/remult-knex'
import { SavedWidgetEntity, TemplateEntity } from './entities/index.js'

interface SessionUser {
  id: string
  name?: string
  email?: string
}

interface SessionWithUser {
  user?: SessionUser
}

// Function to get user from request
const getUserFromRequest = async (req: Request) => {
  try {
    // Check if user is in request session
    const session = req.session as SessionWithUser
    if (session?.user) {
      return session.user
    }
    return undefined
  } catch (error) {
    console.error('Error getting user from request:', error)
    return undefined
  }
}

// Support DATABASE_URL (Railway's preferred format) or individual env vars
const getDbConnection = () => {
  if (process.env['DATABASE_URL']) {
    return process.env['DATABASE_URL']
  }

  return {
    host: process.env['PGHOST'] || process.env['POSTGRES_HOST'] || 'localhost',
    database: process.env['PGDATABASE'] || process.env['POSTGRES_DATABASE'] || 'mail_builder',
    user: process.env['PGUSER'] || process.env['POSTGRES_USER'] || 'postgres',
    password: process.env['PGPASSWORD'] || process.env['POSTGRES_PASSWORD'] || 'password',
    port: Number(process.env['PGPORT'] || process.env['POSTGRES_PORT'] || 5432),
  }
}

export const dataProvider = createKnexDataProvider({
  client: 'pg',
  connection: getDbConnection(),
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 30000,
    createTimeoutMillis: 30000,
    destroyTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },
})

export const api = remultApi({
  entities: [TemplateEntity, SavedWidgetEntity],
  dataProvider,
  getUser: getUserFromRequest,
  logApiEndPoints: true,
  initApi: async (remult) => {
    console.log('🔧 Database Configuration:', {
      host: process.env['POSTGRES_HOST'] || 'localhost',
      database: process.env['POSTGRES_DATABASE'] || 'mail_builder',
      user: process.env['POSTGRES_USER'] || 'postgres',
      port: process.env['POSTGRES_PORT'] ? Number(process.env['POSTGRES_PORT']) : 5432,
      hasPassword: !!process.env['POSTGRES_PASSWORD'],
      nodeEnv: process.env.NODE_ENV,
    })
    console.log('🚀 Remult API initialized')
    console.log('📊 Database provider:', remult.dataProvider.constructor.name)
  },
})
