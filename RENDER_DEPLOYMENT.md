# Deploy Backend to Render (No Docker)

## 📋 Project Overview

- **Backend Framework:** FastAPI (Python)
- **Frontend:** React + Vite
- **Database:** PostgreSQL
- **ML Model:** ARIMA(1,1,1) for AQI forecasting
- **API Integration:** OpenWeather API

---

## 🚀 Part 1: Deploy Backend to Render

### Step 1: Prepare Backend Files

#### 1.1 Create `render.yaml` (Optional - for Infrastructure as Code)

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: airquality-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHON_VERSION
        value: 3.11.0
      - key: DATABASE_URL
        fromDatabase:
          name: airquality-db
          property: connectionString
      - key: OPENWEATHER_API_KEY
        sync: false
      - key: SECRET_KEY
        generateValue: true
      - key: API_HOST
        value: 0.0.0.0
      - key: API_PORT
        fromGroup: web

databases:
  - name: airquality-db
    databaseName: airquality
    user: airquality
```

#### 1.2 Update `backend/config.py` for Render

The current config should work, but ensure it reads from environment variables:

```python
# Already correct - no changes needed
database_url: str = "postgresql://..."  # Will be overridden by env var
```

#### 1.3 Create `backend/runtime.txt` (Optional)

```
python-3.11.0
```

---

### Step 2: Push Code to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Render deployment"

# Create GitHub repository and push
git remote add origin https://github.com/YOUR_USERNAME/airquality-prediction.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy on Render

#### 3.1 Create Render Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

#### 3.2 Create PostgreSQL Database

1. Click **"New +"** → **"PostgreSQL"**
2. Configure:
   - **Name:** `airquality-db`
   - **Database:** `airquality`
   - **User:** `airquality`
   - **Region:** Choose closest to you
   - **Plan:** Free (or paid for better performance)
3. Click **"Create Database"**
4. Wait for database to be ready (2-3 minutes)
5. **Copy the Internal Database URL** (starts with `postgresql://`)

#### 3.3 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:

**Basic Settings:**
- **Name:** `airquality-backend`
- **Region:** Same as database
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`

**Build & Deploy:**
- **Build Command:**
  ```bash
  pip install -r requirements.txt
  ```

- **Start Command:**
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

**Environment Variables:**
Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Paste the Internal Database URL from Step 3.2 |
| `OPENWEATHER_API_KEY` | Your OpenWeather API key |
| `SECRET_KEY` | Generate with: `openssl rand -hex 32` |
| `API_HOST` | `0.0.0.0` |
| `API_PORT` | `10000` (Render default) |
| `PYTHON_VERSION` | `3.11.0` |

**Plan:**
- Select **Free** (or paid for better performance)

4. Click **"Create Web Service"**

#### 3.4 Wait for Deployment

- Render will:
  1. Clone your repository
  2. Install dependencies (takes 3-5 minutes)
  3. Start the application
  4. Assign a URL like: `https://airquality-backend.onrender.com`

- Monitor logs in real-time on Render dashboard

#### 3.5 Verify Backend is Running

Once deployed, test these URLs:

```bash
# Root endpoint
https://airquality-backend.onrender.com/

# API docs
https://airquality-backend.onrender.com/docs

# Health check
https://airquality-backend.onrender.com/health
```

---

### Step 4: Update Frontend API URL

Update `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://airquality-backend.onrender.com'
```

Or set environment variable in Vercel (next section).

---

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Frontend Files

#### 1.1 Create `vercel.json` in `frontend/` folder

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

#### 1.2 Update `frontend/.env.example`

```env
VITE_API_URL=https://airquality-backend.onrender.com
```

---

### Step 2: Deploy on Vercel

#### 2.1 Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

#### 2.2 Import Project

1. Click **"Add New..."** → **"Project"**
2. Select your GitHub repository
3. Configure:

**Project Settings:**
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

**Environment Variables:**
Add this variable:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://airquality-backend.onrender.com` |

(Replace with your actual Render backend URL)

4. Click **"Deploy"**

#### 2.3 Wait for Deployment

- Vercel will:
  1. Clone your repository
  2. Install dependencies (1-2 minutes)
  3. Build the React app
  4. Deploy to CDN
  5. Assign a URL like: `https://airquality-prediction.vercel.app`

#### 2.4 Verify Frontend is Running

Open your Vercel URL in browser:
```
https://airquality-prediction.vercel.app
```

You should see your Air Quality Prediction homepage!

---

## 🔧 Part 3: Configure CORS (Important!)

### Update Backend CORS Settings

Since your frontend is now on a different domain, update `backend/main.py`:

```python
# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://airquality-prediction.vercel.app",  # Your Vercel URL
        "http://localhost:3000",  # Local development
        "http://localhost:5173",  # Vite dev server
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Commit and push changes:**
```bash
git add backend/main.py
git commit -m "Update CORS for Vercel deployment"
git push
```

Render will automatically redeploy with the new changes.

---

## 📊 Part 4: Database Setup

### Option A: Use Render PostgreSQL (Recommended)

Already done in Step 3.2! The database is automatically connected.

### Option B: Use External PostgreSQL (e.g., Supabase, ElephantSQL)

1. Create a PostgreSQL database on your preferred provider
2. Get the connection string
3. Update `DATABASE_URL` environment variable on Render

---

## ✅ Part 5: Verify Full Deployment

### Test Complete Flow

1. **Open Frontend:** https://airquality-prediction.vercel.app
2. **Click "Try as Guest"**
3. **Select a city** (e.g., "London")
4. **Click "Predict AQI"**
5. **Verify:**
   - Current AQI is fetched from OpenWeather
   - Prediction is generated
   - Graph is displayed
   - Alert level is shown

### Check Backend Logs

On Render dashboard:
- Go to your web service
- Click **"Logs"** tab
- Monitor for any errors

---

## 🐛 Common Issues & Fixes

### Issue 1: "Site can't be reached" on Render

**Cause:** Service is sleeping (free tier)

**Fix:** 
- Free tier services sleep after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Upgrade to paid plan for always-on service

### Issue 2: Database Connection Error

**Symptoms:**
```
sqlalchemy.exc.OperationalError: connection failed
```

**Fix:**
1. Check `DATABASE_URL` environment variable on Render
2. Ensure it's the **Internal Database URL** (not External)
3. Format: `postgresql://user:password@host:5432/database`

### Issue 3: CORS Error in Browser

**Symptoms:**
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS
```

**Fix:**
1. Update `backend/main.py` CORS settings (see Part 3)
2. Add your Vercel URL to `allow_origins`
3. Push changes to trigger redeployment

### Issue 4: OpenWeather API Not Working

**Symptoms:**
- Current AQI shows as `null`
- Empty data in dashboard

**Fix:**
1. Verify `OPENWEATHER_API_KEY` is set on Render
2. Check API key is valid at https://openweathermap.org/api
3. Check Render logs for API errors

### Issue 5: Build Fails on Render

**Symptoms:**
```
ERROR: Could not find a version that satisfies the requirement...
```

**Fix:**
1. Check `requirements.txt` has correct versions
2. Add `runtime.txt` with Python version
3. Try pinning specific versions

### Issue 6: Frontend Shows Blank Page

**Symptoms:**
- Vercel deployment succeeds
- But page is blank

**Fix:**
1. Check browser console for errors
2. Verify `VITE_API_URL` is set correctly
3. Check if API is accessible from browser
4. Rebuild and redeploy on Vercel

---

## 💰 Cost Breakdown

### Free Tier Limits

**Render (Free):**
- ✅ 750 hours/month
- ✅ 512 MB RAM
- ✅ Shared CPU
- ❌ Sleeps after 15 min inactivity
- ❌ Slower cold starts

**Vercel (Free):**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Always on
- ✅ Fast CDN

**Render PostgreSQL (Free):**
- ✅ 1 GB storage
- ✅ 90 days retention
- ❌ Expires after 90 days (need to recreate)

### Recommended Upgrades

For production use:
- **Render:** $7/month (always on, 512 MB RAM)
- **Render PostgreSQL:** $7/month (persistent, 1 GB)
- **Vercel:** Free tier is sufficient

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Render and Vercel support automatic deployments:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Automatic Triggers:**
   - Render: Redeploys backend automatically
   - Vercel: Redeploys frontend automatically

3. **Monitor:**
   - Check deployment status on dashboards
   - View logs for any errors

---

## 📝 Final Checklist

- [ ] Backend deployed on Render
- [ ] PostgreSQL database created
- [ ] Environment variables configured
- [ ] Backend URL accessible
- [ ] Frontend deployed on Vercel
- [ ] Frontend environment variables set
- [ ] CORS configured correctly
- [ ] Full flow tested (signup, login, prediction)
- [ ] OpenWeather API working
- [ ] Database saving predictions
- [ ] History page showing data

---

## 🎉 Success!

Your Air Quality Prediction System is now live:

- **Frontend:** https://airquality-prediction.vercel.app
- **Backend API:** https://airquality-backend.onrender.com
- **API Docs:** https://airquality-backend.onrender.com/docs

Share your live links and enjoy your deployed application! 🚀

---

## 📚 Additional Resources

- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment Guide](https://fastapi.tiangolo.com/deployment/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

## 🆘 Need Help?

If you encounter issues:
1. Check Render logs for backend errors
2. Check browser console for frontend errors
3. Verify all environment variables are set
4. Test API endpoints directly with curl or Postman
5. Check database connection string format
