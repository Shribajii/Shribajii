# 🚀 How to Run ExamPro Locally in VS Code

## 📋 Prerequisites

Before starting, make sure you have these installed on your computer:

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Check: `node --version`

2. **Python** (v3.11 or higher)
   - Download: https://www.python.org/
   - Check: `python --version`

3. **MongoDB** (Local or Cloud)
   - Option 1: Install MongoDB locally from https://www.mongodb.com/
   - Option 2: Use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas

4. **Visual Studio Code**
   - Download: https://code.visualstudio.com/

5. **Git** (to clone the project)
   - Download: https://git-scm.com/

---

## 📦 Step 1: Get Your Project Files

### Option A: If you have GitHub access
```bash
# If you saved to GitHub, clone the repository
git clone YOUR_GITHUB_URL
cd your-project-folder
```

### Option B: Manual Setup
If you can't download from Emergent, you'll need to manually create the project structure:

**Create this folder structure:**
```
ExamPro/
├── backend/
│   ├── server.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    ├── public/
    ├── package.json
    └── .env
```

Then copy the code from these files (available in your Emergent chat):
- `/app/backend/server.py`
- `/app/backend/requirements.txt`
- `/app/frontend/src/App.js`
- `/app/frontend/src/pages/*.js` (all page files)
- `/app/frontend/package.json`
- `/app/frontend/tailwind.config.js`
- etc.

---

## ⚙️ Step 2: Setup Backend

### 1. Open Terminal in VS Code
Press `` Ctrl + ` `` (backtick) or go to Terminal > New Terminal

### 2. Navigate to backend folder
```bash
cd backend
```

### 3. Create Python Virtual Environment
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Python Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- FastAPI
- Uvicorn
- Motor (MongoDB)
- PyJWT
- Bcrypt
- WeasyPrint
- And other dependencies

### 5. Configure Backend Environment

Edit `backend/.env` file:
```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="exam_system_db"
CORS_ORIGINS="*"
JWT_SECRET_KEY="your-secret-key-change-this"
```

**If using MongoDB Atlas (cloud):**
Replace MONGO_URL with your connection string:
```env
MONGO_URL="mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority"
```

### 6. Start Backend Server
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Application startup complete.
```

**Keep this terminal open!** The backend is now running.

---

## 🎨 Step 3: Setup Frontend

### 1. Open NEW Terminal
Press `` Ctrl + Shift + ` `` for a new terminal

### 2. Navigate to frontend folder
```bash
cd frontend
```

### 3. Install Node Dependencies
```bash
npm install
# OR if you prefer yarn
yarn install
```

This will install:
- React
- React Router
- Axios
- Tailwind CSS
- Shadcn UI components
- Framer Motion
- And other dependencies

### 4. Configure Frontend Environment

Edit `frontend/.env` file:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

**Important:** Make sure backend URL points to localhost:8001

### 5. Start Frontend Development Server
```bash
npm start
# OR
yarn start
```

You should see:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

Your browser will automatically open to http://localhost:3000

---

## 🎉 Step 4: Access Your Application

1. **Frontend:** http://localhost:3000
2. **Backend API:** http://localhost:8001
3. **API Documentation:** http://localhost:8001/docs

---

## 🔧 VS Code Extensions (Recommended)

Install these VS Code extensions for better experience:

1. **Python** (Microsoft)
2. **Pylance** (Microsoft)
3. **ES7+ React/Redux/React-Native snippets**
4. **Tailwind CSS IntelliSense**
5. **ESLint**
6. **Prettier - Code formatter**

---

## 🐛 Common Issues & Solutions

### Issue 1: "Module not found" error (Backend)
```bash
# Make sure virtual environment is activated
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Issue 2: "Cannot find module" error (Frontend)
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: MongoDB Connection Error
```
Error: MongoServerError: Authentication failed
```
**Solution:**
- Check MONGO_URL in backend/.env
- If using local MongoDB, start MongoDB service:
  - Windows: `net start MongoDB`
  - Mac: `brew services start mongodb-community`
  - Linux: `sudo systemctl start mongod`

### Issue 4: Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:**
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Issue 5: WeasyPrint Installation Error
**Windows:**
Download and install GTK3 runtime from:
https://github.com/tschoonj/GTK-for-Windows-Runtime-Environment-Installer/releases

**Mac:**
```bash
brew install cairo pango gdk-pixbuf libffi
```

**Linux:**
```bash
sudo apt-get install libpango-1.0-0 libpangocairo-1.0-0
```

---

## 📁 Project Structure in VS Code

```
ExamPro/
├── backend/
│   ├── venv/                  # Virtual environment (don't edit)
│   ├── server.py             # Main FastAPI application
│   ├── requirements.txt      # Python dependencies
│   └── .env                  # Environment variables
│
└── frontend/
    ├── node_modules/         # Node packages (don't edit)
    ├── public/
    │   └── index.html        # HTML template (Emergent badge removed!)
    ├── src/
    │   ├── App.js            # Main router
    │   ├── App.css           # App styles
    │   ├── index.js          # Entry point
    │   ├── index.css         # Global styles
    │   ├── pages/            # All page components
    │   │   ├── Login.js
    │   │   ├── StudentDashboard.js
    │   │   ├── TeacherDashboard.js
    │   │   ├── AdminDashboard.js
    │   │   ├── TakeExam.js
    │   │   └── ViewResult.js
    │   └── components/
    │       └── ui/           # Shadcn components
    ├── package.json          # Node dependencies
    ├── tailwind.config.js    # Tailwind config
    └── .env                  # Environment variables
```

---

## 🎯 Development Workflow

### 1. Make Changes
- Edit files in VS Code
- Save changes (Ctrl+S)
- Both frontend and backend have hot-reload enabled
- Changes appear automatically in browser

### 2. Test Changes
- Frontend: Check in browser at http://localhost:3000
- Backend: Check API at http://localhost:8001/docs

### 3. Debug
- Frontend: Use Chrome DevTools (F12)
- Backend: Check terminal for error messages

---

## 🔄 Restarting Services

### Restart Backend:
1. Go to backend terminal
2. Press `Ctrl + C` to stop
3. Run again: `uvicorn server:app --reload --host 0.0.0.0 --port 8001`

### Restart Frontend:
1. Go to frontend terminal
2. Press `Ctrl + C` to stop
3. Run again: `npm start`

---

## 💾 Saving Your Changes

After making changes:

```bash
# Stage all changes
git add .

# Commit with message
git commit -m "Updated ExamPro features"

# Push to GitHub (if connected)
git push origin main
```

---

## 📦 Building for Production

### Backend:
Backend runs as-is with uvicorn in production.

### Frontend:
```bash
cd frontend
npm run build
# Creates optimized build in 'build' folder
```

---

## 🎓 Tips for Your Exam Demo

1. **Before Demo:**
   - Run both backend and frontend
   - Open http://localhost:3000 in browser
   - Test all features once

2. **During Demo:**
   - Use localhost:3000
   - Have VS Code open showing code
   - Show both frontend and backend terminals

3. **Show These Files:**
   - `backend/server.py` (show API endpoints)
   - `frontend/src/pages/TakeExam.js` (show timer logic)
   - `frontend/src/App.js` (show routing)

---

## ✅ Checklist for Local Setup

- [ ] Node.js installed
- [ ] Python installed
- [ ] MongoDB installed/configured
- [ ] VS Code installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running on port 8001
- [ ] Frontend running on port 3000
- [ ] Can register and login
- [ ] Can create exam as teacher
- [ ] Can take exam as student
- [ ] Emergent branding removed from website

---

## 🆘 Need Help?

If you encounter issues:

1. Check error message in terminal
2. Google the specific error
3. Check MongoDB connection
4. Verify .env files are correct
5. Try restarting both servers

---

## 🎉 You're Done!

Your ExamPro system is now running locally in VS Code!
- Frontend: http://localhost:3000 (with NO Emergent branding!)
- Backend API: http://localhost:8001
- Ready for development and customization!

**Now you can:**
✅ Modify any code in VS Code
✅ Test locally before deploying
✅ Show in exam without "Made with Emergent" badge
✅ Add your own features
✅ Package for submission
