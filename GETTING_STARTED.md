# 🚀 Getting Started Checklist

Follow these steps to get your Moodle LMS Wrapper running!

## ✅ Pre-Deployment Checklist

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

**Status:** ⬜ Not Started

---

### Step 2: Setup Environment Files

#### Backend Environment

Create `backend/.env`:

```bash
cp backend/.env.example backend/.env
```

**Required values to update:**
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `DB_PASSWORD` - Your PostgreSQL password
- `MOODLE_BASE_URL` - Your Moodle instance URL
- `MOODLE_WS_TOKEN` - Generate from Moodle (see QUICKSTART.md)

**Status:** ⬜ Not Started

#### Frontend Environment

Create `frontend/.env`:

```bash
cp frontend/.env.example frontend/.env
```

**Required values:**
- `VITE_API_URL` - Your backend API URL (default: http://localhost:5000/api)

**Status:** ⬜ Not Started

---

### Step 3: Setup Database

```bash
# Create PostgreSQL database
createdb moodle_wrapper

# Or using psql
psql -U postgres -c "CREATE DATABASE moodle_wrapper;"
```

**Status:** ⬜ Not Started

---

### Step 4: Configure Moodle Web Services

Follow the guide in [QUICKSTART.md](QUICKSTART.md#step-4-configure-moodle-web-services) to:

1. Enable web services in Moodle
2. Enable REST protocol
3. Create a service with required functions
4. Generate API token

**Status:** ⬜ Not Started

---

### Step 5: Test Moodle Connection

```bash
# Test your Moodle token
curl "https://your-moodle-instance.com/webservice/rest/server.php?wstoken=YOUR_TOKEN&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json"
```

You should get a JSON response with site information.

**Status:** ⬜ Not Started

---

### Step 6: Start the Application

#### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

**Status:** ⬜ Not Started

#### Option B: Manual Start

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Status:** ⬜ Not Started

---

### Step 7: Verify Installation

Open your browser and test:

- ✅ Frontend: http://localhost:3000
  - Should see landing page with "Welcome to LMS Wrapper"
  
- ✅ Backend Health: http://localhost:5000/health
  - Should return: `{"success": true, "message": "Server is running"}`

- ✅ Database Connection: Check backend logs
  - Should see: "📦 Database connected successfully"

**Status:** ⬜ Not Started

---

### Step 8: Create First User

#### Via UI:
1. Go to http://localhost:3000
2. Click "Get Started"
3. Click "Create Account"
4. Fill in registration form
5. Select role (ADMIN recommended for first user)
6. Submit

**Status:** ⬜ Not Started

#### Via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN",
    "moodleUserId": 2
  }'
```

**Status:** ⬜ Not Started

---

### Step 9: Login and Explore

1. Login with your credentials
2. You'll be redirected to role-specific dashboard
3. Explore features:
   - Students: View courses, submit assignments
   - Teachers: Grade assignments, manage courses
   - Admins: Manage users, view activity logs

**Status:** ⬜ Not Started

---

### Step 10: Production Deployment (Optional)

When ready for production:

1. Update `.env` with production credentials
2. Generate SSL certificates
3. Deploy with `docker-compose -f docker-compose.prod.yml up -d`
4. See [DEPLOYMENT.md](DEPLOYMENT.md) for complete guide

**Status:** ⬜ Not Started

---

## 🆘 Troubleshooting Quick Reference

### Database Connection Error
```bash
# Check PostgreSQL is running
pg_isready

# Verify database exists
psql -l | grep moodle_wrapper

# Check credentials in backend/.env
```

### Moodle API Error
```bash
# Test token directly
curl "https://your-moodle.com/webservice/rest/server.php?wstoken=TOKEN&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json"

# Common issues:
# - Token expired or invalid
# - Web services not enabled
# - Required functions not added to service
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change port in backend/.env
PORT=5001
```

### Frontend Can't Connect to Backend
```bash
# Check CORS_ORIGIN in backend/.env matches frontend URL
CORS_ORIGIN=http://localhost:3000

# Check VITE_API_URL in frontend/.env
VITE_API_URL=http://localhost:5000/api

# Restart both after changing .env
```

---

## 📚 Documentation Reference

- **[README.md](README.md)** - Complete project overview
- **[QUICKSTART.md](QUICKSTART.md)** - Detailed setup guide
- **[API.md](API.md)** - API endpoint reference
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Technical details
- **[STATUS.md](STATUS.md)** - Feature completion status

---

## 🎯 Success Criteria

Your installation is successful when:

- ✅ Frontend loads at http://localhost:3000
- ✅ Backend health check returns success
- ✅ Database connection established
- ✅ Moodle API connection working
- ✅ Can register and login
- ✅ Can view courses from Moodle
- ✅ Can submit assignments (if applicable)
- ✅ Can view grades
- ✅ Admin can view user list
- ✅ Admin can view activity logs

---

## 💡 Quick Tips

1. **Keep terminals open** to see real-time logs
2. **Check logs first** when troubleshooting
3. **Use Docker** for easiest setup
4. **Test Moodle connection early** to avoid confusion
5. **Start with ADMIN role** for first user
6. **Read QUICKSTART.md** for detailed steps
7. **Check STATUS.md** to see all features

---

## 🎉 Ready to Go!

Once you complete all steps above, you'll have a fully functional Moodle LMS Wrapper with:

- ✨ Modern, responsive UI
- 🔐 Secure authentication
- 📚 Full Moodle integration
- 💳 Payment restrictions
- 📊 Activity tracking
- 👥 User management
- 🎯 Role-based access

**Happy Learning! 🚀**

---

Last updated: February 28, 2026
