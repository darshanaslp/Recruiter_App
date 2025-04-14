module.exports = {
    jwtSecret: process.env.JWT_SECRET || 'default_secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '86400', // in seconds
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '2592000', // 30 days in seconds
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    videoApiBaseUrl: process.env.VIDEO_API_BASE_URL || 'https://meet.jit.si',
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  };
  