# MeuPet Backend - Deployment Guide

This project is configured for both development and production deployments with proper environment separation.

## 🏗️ Environment Structure

- **Development**: Local development with Docker Compose
- **Production**: Railway.app deployment with MySQL service
- **Docker Production**: Self-hosted with Docker Compose

## 📋 Environment Variables

### Required for All Environments
```bash
NODE_ENV=production|development|test
JWT_SECRET=your-secure-jwt-secret
```

### Database Configuration

#### Development (Local/Docker)
```bash
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=root
DATABASE_NAME=MeuPet
```

#### Railway Production (Automatic)
Railway automatically provides these variables when you add a MySQL service:
- `MYSQLHOST`
- `MYSQLPORT` 
- `MYSQLUSER`
- `MYSQLPASSWORD`
- `MYSQLDATABASE`

## 🚀 Deployment Options

### 1. Railway.app (Recommended for Production)

#### Setup Steps:
1. **Create Railway Account**: Sign up at [railway.app](https://railway.app)

2. **Connect Repository**: 
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

3. **Add MySQL Service**:
   - Go to your Railway dashboard
   - Click "Add Service" → "Database" → "MySQL"
   - Railway will automatically set the MYSQL* environment variables

4. **Set Environment Variables**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your-super-secure-jwt-secret-here
   ```

5. **Deploy**:
   ```bash
   railway up
   ```

#### Railway Configuration Files:
- `railway.json` - Railway deployment configuration
- `Dockerfile` - Production container setup

### 2. Local Development

#### Using Docker Compose (Recommended):
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up --build

# Stop and clean up
docker-compose -f docker-compose.dev.yml down -v
```

#### Direct npm:
```bash
# Copy environment file
cp .env.development .env

# Install dependencies
npm install

# Start development server
npm run start:dev
```

### 3. Production Docker Deployment

#### Setup:
```bash
# Copy and configure production environment
cp .env.production .env
# Edit .env with your production values

# Start production environment
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔧 Configuration Details

### Database Configuration
The app automatically detects the environment and configures the database:

- **Development**: Uses local MySQL or Docker container
- **Railway**: Uses Railway's MySQL service with SSL
- **Production Docker**: Uses Docker Compose MySQL service

### Security Features
- Environment-specific JWT secrets
- SSL connections for Railway
- Non-root Docker user in production
- Health checks for container monitoring

## 📊 Monitoring & Health Checks

### Health Check Endpoints:
- **Application**: `GET /` (returns app status)
- **Docker**: Built-in health check at `/healthcheck`

### Logs:
```bash
# Railway logs
railway logs

# Docker logs
docker-compose logs -f app

# Development logs
npm run start:dev
```

## 🔍 Troubleshooting

### Common Issues:

1. **Database Connection Failed**:
   - Check environment variables
   - Verify database service is running
   - Check network connectivity

2. **Railway Deployment Failed**:
   ```bash
   # Check build logs
   railway logs --deployment
   
   # Verify environment variables
   railway variables
   ```

3. **Docker Build Issues**:
   ```bash
   # Clean build
   docker-compose down -v
   docker system prune -f
   docker-compose up --build
   ```

## 🛡️ Security Checklist

- [ ] Set strong JWT_SECRET in production
- [ ] Use secure database passwords
- [ ] Enable SSL for database connections
- [ ] Review environment variable exposure
- [ ] Monitor application logs
- [ ] Set up regular database backups

## 📝 Scripts Reference

```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugger

# Production
npm run build             # Build application
npm run start:prod        # Start production server
npm run start:railway     # Railway-specific start

# Testing
npm run test              # Run unit tests
npm run test:e2e          # Run e2e tests
npm run test:cov          # Run with coverage

# Docker
docker-compose -f docker-compose.dev.yml up    # Development
docker-compose up                               # Production
```

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [NestJS Deployment](https://docs.nestjs.com/deployment)
- [TypeORM Production](https://typeorm.io/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)