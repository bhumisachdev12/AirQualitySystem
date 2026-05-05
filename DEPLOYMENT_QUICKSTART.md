# 🚀 Quick Deployment Guide (No Docker)

## ⚡ 5-Minute Setup

### Prerequisites
- GitHub account
- Render account (free)
- Vercel account (free)

---

## Step 1: Push to GitHub (2 minutes)

```bash
# Initialize git
git init
git add .
git commit -m "Initial commit for deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/airquality-prediction.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Render (3 minutes)

### A. Create Database
1. Go to https://render.com/dashboard
2. Click **New +** → **PostgreSQL**
3. Name: `airquality-db`
4. Click **Create Database**
5. **Copy Internal Database URL** (save for next step)

### B. Create Web Service
1. Click **New +** → **Web Service**
2. Connect your GitHub repo
3. Settings:
   - **Name:** `airquality-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. **Environment Variables:**
   ```
   DATABASE_URL = <paste Internal Database URL>
   OPENWEATHER_API_KEY = <your-openweather-api-key>
   SECRET_KEY = <generate with: openssl rand -hex 32>
   API_HOST = 0.0.0.0
   ```

5. Click **Create Web Service**
6. Wait 3-5 minutes for deployment
7. **Copy your backend URL** (e.g., `https://airquality-backend.onrender.com`)

---

## Step 3: Deploy Frontend on Vercel (2 minutes)

1. Go to https://vercel.com/dashboard
2. Click **Add New...** → **Project**
3. Import your GitHub repo
4. Settings:
   - **Framework:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. **Environment Variable:**
   ```
   VITE_API_URL = <paste your Render backend URL>
   ```

6. Click **Deploy**
7. Wait 1-2 minutes
8. **Your app is live!** 🎉

---

## Step 4: Update CORS (1 minute)

1. Open `backend/main.py`
2. Update CORS:
   ```python
   allow_origins=[
       "https://your-app.vercel.app",  # Your Vercel URL
       "http://localhost:3000",
   ]
   ```
3. Push changes:
   ```bash
   git add backend/main.py
   git commit -m "Update CORS"
   git push
   ```

Render will auto-redeploy!

---

## ✅ Test Your Deployment

1. Open your Vercel URL
2. Click "Try as Guest"
3. Select a city
4. Click "Predict AQI"
5. See results! 🎊

---

## 🐛 Quick Fixes

**Backend sleeping?**
- Free tier sleeps after 15 min
- First request takes 30-60 seconds

**CORS error?**
- Check Step 4 above
- Ensure Vercel URL is in `allow_origins`

**Database error?**
- Use **Internal Database URL** (not External)
- Check it starts with `postgresql://`

---

## 📊 Your Live URLs

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://airquality-backend.onrender.com
- **API Docs:** https://airquality-backend.onrender.com/docs

---

## 💡 Pro Tips

1. **Keep services awake:** Use UptimeRobot to ping your backend every 5 minutes
2. **Monitor logs:** Check Render dashboard for errors
3. **Auto-deploy:** Push to GitHub = automatic deployment
4. **Custom domain:** Add your own domain on Vercel (free)

---

See `RENDER_DEPLOYMENT.md` for detailed instructions and troubleshooting!
