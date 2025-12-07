import express from 'express'
import cors from 'cors'
import { api } from './api.js'

// Export the Express app as a named export
// This is required by vite3-plugin-express
export const app = express()

// Global error handlers
process.on('uncaughtException', error => {
  console.error('💥 Uncaught Exception:', error)
  console.error((error as Error).stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise)
  console.error('Reason:', reason)
  process.exit(1)
})

app.set('trust proxy', true)

// Middleware - ORDER MATTERS!
// 1. CORS must be first
app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || true
        : 'http://localhost:5173',
    credentials: true,
  })
)

// 2. JSON parsing
app.use(express.json())

// 3. Health check endpoint
app.get('/health', async (_, res) => {
  try {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3002,
      version: '1.0.0',
      service: 'mail-builder',
    }
    res.status(200).json(healthData)
  } catch (error: unknown) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})

// 4. Remult API
app.use(api)

// Only start the server when not running in Vite dev mode
if (!process.env['VITE']) {
  const port = parseInt(process.env['PORT'] || '3002', 10)

  // Serve static files from dist
  app.use(express.static('dist'))

  // SPA fallback - serve index.html for non-API routes
  app.use((req, res, next) => {
    if (!req.path.startsWith('/api') && !req.path.includes('.')) {
      res.sendFile('dist/index.html', { root: process.cwd() })
    } else {
      next()
    }
  })

  app.listen(port, '0.0.0.0', () => {
    console.log('='.repeat(50))
    console.log('🚀 Server started successfully!')
    console.log(`📡 Port: ${port}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🏥 Health check: http://localhost:${port}/health`)
    console.log(`🔗 API endpoint: http://localhost:${port}/api`)
    console.log('='.repeat(50))
  })
}
