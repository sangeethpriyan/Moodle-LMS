# Quick Start Guide

Get your Moodle LMS Wrapper up and running in minutes!

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 16+ installed and running
- A Moodle instance with REST API access
- Git (optional)

## Step 1: Install Dependencies

### Backend
```bash
cd backend
npm install
```

### Frontend
```bash
cd frontend
npm install
```

## Step 2: Configure Environment

### Backend Configuration

Create `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=moodle_wrapper

# JWT
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRATION=7d

# Moodle API
MOODLE_BASE_URL=https://your-moodle-instance.com
MOODLE_WS_TOKEN=your_moodle_webservice_token

# File Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend Configuration

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Step 3: Setup Database

```bash
# Create the database
createdb moodle_wrapper

# Or using psql
psql -U postgres -c "CREATE DATABASE moodle_wrapper;"
```

## Step 4: Configure Moodle Web Services

1. Log into your Moodle as admin
2. Navigate to: **Site Administration > Plugins > Web services > Overview**
3. Follow these steps:

   **a) Enable web services**
   - Check "Enable web services"
   - Save

   **b) Enable REST protocol**
   - Go to "Manage protocols"
   - Enable "REST protocol"

   **c) Create a service**
   - Go to "External services"
   - Add a new service:
     - Name: `Moodle Wrapper Service`
     - Short name: `moodle_wrapper`
     - Enabled: Yes
     - Authorized users only: No (or create specific user)

   **d) Add functions to service**
   
   Click "Add functions" and add these:
   ```
   core_webservice_get_site_info
   core_user_get_users
   core_course_get_courses
   core_course_get_contents
   core_enrol_get_enrolled_users
   mod_assign_get_assignments
   mod_assign_submit_for_grading
   mod_assign_save_grade
   mod_quiz_get_quizzes_by_courses
   mod_quiz_start_attempt
   mod_quiz_process_attempt
   core_grades_get_grades
   mod_forum_get_forums_by_courses
   mod_forum_add_discussion
   mod_forum_add_discussion_post
   ```

   **e) Create a service user (optional but recommended)**
   - Create a new user account for the wrapper
   - Assign appropriate role

   **f) Generate token**
   - Go to "Manage tokens"
   - Create token for your user with the service
   - Copy the token (this is your `MOODLE_WS_TOKEN`)

## Step 5: Test Moodle Connection

Test your Moodle token:

```bash
curl "https://your-moodle-instance.com/webservice/rest/server.php?wstoken=YOUR_TOKEN&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json"
```

You should get a JSON response with site information.

## Step 6: Start the Application

### Option A: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option B: Use Docker Compose (Recommended)

```bash
# From project root
docker-compose up -d

# View logs
docker-compose logs -f
```

## Step 7: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api

## Step 8: Create Your First User

### Option 1: Register via UI

1. Navigate to http://localhost:3000
2. Click "Get Started" or "Login"
3. Click "Create Account"
4. Fill in registration form:
   - Email
   - Password
   - First Name
   - Last Name
   - Moodle User ID (from your Moodle instance)
5. Select role (STUDENT, TEACHER, or ADMIN)

### Option 2: Create via API

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "Password123!",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "moodleUserId": 2
  }'
```

## Step 9: Login and Explore

1. Login with your credentials
2. You'll be redirected to your role-specific dashboard
3. Explore the various features:
   - **Students**: View courses, submit assignments, take quizzes
   - **Teachers**: Manage courses, grade assignments, view student progress
   - **Admins**: Manage users, payments, view activity logs

## Common Issues & Solutions

### Issue: "Cannot connect to database"
**Solution**: 
- Ensure PostgreSQL is running: `pg_isready`
- Verify credentials in `.env`
- Check if database exists: `psql -l | grep moodle_wrapper`

### Issue: "Moodle API errors"
**Solution**:
- Verify `MOODLE_WS_TOKEN` is correct
- Test token with curl command (Step 5)
- Check if web services are enabled in Moodle
- Verify all required functions are added to the service

### Issue: "CORS errors in browser"
**Solution**:
- Check `CORS_ORIGIN` in backend `.env` matches frontend URL
- Restart backend after changing `.env`

### Issue: "Port already in use"
**Solution**:
- Change `PORT` in backend `.env` (e.g., 5001)
- Update `VITE_API_URL` in frontend `.env` to match
- Or stop the process using the port:
  ```bash
  # Find process
  lsof -i :5000
  # Kill process
  kill -9 <PID>
  ```

## Next Steps

1. **Customize Styling**: Modify Tailwind config in `frontend/tailwind.config.js`
2. **Add Users**: Use admin panel to manage users and permissions
3. **Configure Payment Restrictions**: Set up payment-based access via admin dashboard
4. **Review Logs**: Monitor student activity in the logs section
5. **Deploy**: Follow deployment guide in README.md for production setup

## Development Tips

### Hot Reload
Both backend and frontend support hot reload:
- Backend uses `nodemon` - changes auto-restart server
- Frontend uses Vite HMR - instant updates in browser

### Database Management
```bash
# View TypeORM logs
# Set in backend/.env:
# TYPEORM_LOGGING=true

# Reset database (development only!)
# This will drop all tables and recreate
# Add to backend/src/database.ts:
# synchronize: true,
# dropSchema: true,
```

### Debugging
- Backend: Uses Winston logger, check console output
- Frontend: Uses React DevTools, check browser console
- API: Use tools like Postman or Thunder Client for testing endpoints

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format

# View logs (Docker)
docker-compose logs -f backend
docker-compose logs -f frontend

# Restart services (Docker)
docker-compose restart

# Stop all services (Docker)
docker-compose down
```

## Getting Help

- Check the [README.md](README.md) for detailed documentation
- Review [Moodle API Documentation](https://docs.moodle.org/dev/Web_services)
- Open an issue on GitHub
- Check backend logs for error details

---

**Ready to build amazing educational experiences! 🚀**
