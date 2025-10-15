module.exports = {
  apps: [
    {
      name: 'sil-frontend',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production',
        PORT: 3003,
        HOST: '0.0.0.0',
        NEXT_PUBLIC_BACKEND_URL: 'https://backend.sil-sa.com',
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: '801196929391-r8do46k5fqrn2eifrd1333hgphkh2n0b.apps.googleusercontent.com'
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3003,
        HOST: 'localhost',
        NEXT_PUBLIC_BACKEND_URL: 'https://backend.sil-sa.com',
        NEXT_PUBLIC_GOOGLE_CLIENT_ID: '801196929391-r8do46k5fqrn2eifrd1333hgphkh2n0b.apps.googleusercontent.com'
      }
    }
  ]
};


