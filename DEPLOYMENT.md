# Deployment Guide

This guide covers deployment options for the Air Quality Prediction & Alert System.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Docker Deployment](#docker-deployment)
- [Manual Deployment](#manual-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Environment Configuration](#environment-configuration)

---

## Prerequisites

- Docker and Docker Compose (for containerized deployment)
- Node.js 18+ and npm (for manual deployment)
- Python 3.9+ (for manual deployment)
- OpenWeather API Key ([Get one here](https://openweathermap.org/api))

---

## Docker Deployment (Recommended)

### Quick Start

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd air-quality-prediction
```

2. **Configure environment variables**
```bash
# Backend configuration
cp backend/.env.example backend/.env
# Edit backend/.env and add your OpenWeather API key
```

3. **Build and run with Docker Compose**
```bash
docker-compose up --build
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Docker Compose Services

The `docker-compose.yml` includes:
- **frontend**: React + Vite application (port 3000)
- **backend**: FastAPI application (port 8000)

### Stopping the Application
```bash
docker-compose down
```

### Rebuilding After Changes
```bash
docker-compose up --build
```

---

## Manual Deployment

### Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment**
```bash
cp .env.example .env
# Edit .env and add your OpenWeather API key
```

5. **Run the backend**
```bash
python run.py
```

Backend will be available at http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment (optional)**
```bash
cp .env.example .env
# Edit if backend is not on localhost:8000
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at http://localhost:3000

### Production Build

**Frontend:**
```bash
cd frontend
npm run build
npm run preview  # Test production build
```

**Backend:**
```bash
cd backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## Cloud Deployment

### Option 1: Heroku

**Backend (FastAPI):**
1. Create `Procfile` in backend directory:
```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

2. Deploy:
```bash
heroku create your-app-backend
heroku config:set OPENWEATHER_API_KEY=your_key
git subtree push --prefix backend heroku main
```

**Frontend (React):**
1. Deploy to Vercel/Netlify:
```bash
cd frontend
npm run build
# Upload dist/ folder to hosting service
```

### Option 2: AWS

**Backend (EC2 or ECS):**
- Use the provided Dockerfile
- Push to ECR and deploy to ECS
- Or run directly on EC2 with Docker

**Frontend (S3 + CloudFront):**
```bash
cd frontend
npm run build
aws s3 sync dist/ s3://your-bucket-name
```

### Option 3: DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - **Backend**: Dockerfile in `backend/`
   - **Frontend**: Build command `npm run build`, Output `dist/`
3. Add environment variables
4. Deploy

### Option 4: Railway

1. Connect GitHub repository
2. Railway auto-detects Dockerfile
3. Add environment variables
4. Deploy with one click

---

## Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
# OpenWeather API Configuration
OPENWEATHER_API_KEY=your_api_key_here

# Database Configuration (SQLite by default)
DATABASE_URL=sqlite:///./airquality.db

# JWT Configuration
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

### Frontend Environment Variables

Create `frontend/.env` (optional):

```env
VITE_API_URL=http://localhost:8000
```

---

## Production Checklist

- [ ] Set strong `SECRET_KEY` in backend/.env
- [ ] Configure proper CORS origins
- [ ] Use production database (PostgreSQL recommended)
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Test all API endpoints
- [ ] Verify frontend-backend connectivity
- [ ] Set up CI/CD pipeline (optional)

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Docker Issues
```bash
# Clean up Docker
docker-compose down -v
docker system prune -a

# Rebuild from scratch
docker-compose up --build --force-recreate
```

### API Connection Issues
- Verify backend is running on correct port
- Check CORS configuration in backend
- Verify `VITE_API_URL` in frontend matches backend URL
- Check browser console for errors

### Database Issues
```bash
# Reset database
cd backend
rm airquality.db
python run.py  # Will recreate database
```

---

## Monitoring & Maintenance

### Health Checks

**Backend:**
```bash
curl http://localhost:8000/health
```

**Frontend:**
```bash
curl http://localhost:3000
```

### Logs

**Docker:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Manual:**
- Backend logs in terminal
- Frontend logs in browser console

---

## Security Recommendations

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Use strong SECRET_KEY** - Generate with `openssl rand -hex 32`
3. **Enable HTTPS** in production
4. **Implement rate limiting** for API endpoints
5. **Regular security updates** - Keep dependencies updated
6. **Database backups** - Schedule regular backups
7. **Monitor API usage** - Track OpenWeather API quota

---

## Support

For issues or questions:
- Check the [README.md](README.md) for basic setup
- Review API documentation at `/docs` endpoint
- Check application logs for errors

---

## License

See LICENSE file for details.
