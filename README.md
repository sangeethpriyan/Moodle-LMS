# Moodle LMS Wrapper

A comprehensive full-stack web application that wraps Moodle LMS functionality with a modern, role-based user interface and payment-based access control.

## Features

### Role-Based Access Control
- **Student**: View courses, submit assignments, take quizzes, view grades, participate in discussions
- **Teacher**: Manage courses, grade assignments, monitor student progress, participate in discussions
- **Admin/Super Admin**: User management, payment restrictions, activity logs, system administration

### Core Functionality
- 🔐 JWT-based authentication with secure password hashing
- 📚 Full Moodle REST API integration (courses, assignments, quizzes, grades, discussions)
- 💳 Payment-based access restrictions
- 📊 Student activity logging with CSV export
- 🎨 Responsive, mobile-first UI with Tailwind CSS
- 🔄 Real-time data synchronization with Moodle
- 📈 Dashboard analytics for all roles

## Tech Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 4.18
- **Language**: TypeScript 5.3
- **Database**: PostgreSQL 16
- **ORM**: TypeORM 0.3
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **File Upload**: Multer
- **Logging**: Winston
- **API Client**: Axios

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5.3
- **Build Tool**: Vite 5
- **Routing**: React Router 6
- **State Management**: Zustand 4
- **Data Fetching**: React Query 3
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide React

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 16 Alpine

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- PostgreSQL 16+
- Docker and Docker Compose (optional)
- Access to a Moodle instance with REST API enabled

### Environment Configuration

#### Backend (.env)
Create `/workspaces/Moodle-LMS/backend/.env`:

\`\`\`env
# Server
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=moodle_wrapper

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d

# Moodle API
MOODLE_BASE_URL=https://your-moodle-instance.com
MOODLE_WS_TOKEN=your-moodle-webservice-token

# Uploads
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
\`\`\`

#### Frontend (.env)
Create `/workspaces/Moodle-LMS/frontend/.env`:

\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`

### Installation

#### Option 1: Docker Compose (Recommended)

\`\`\`bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
\`\`\`

#### Option 2: Manual Setup

**Backend:**
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

**Frontend:**
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

**Database:**
\`\`\`bash
# Create PostgreSQL database
createdb moodle_wrapper

# TypeORM will auto-sync schema in development
\`\`\`

## API Documentation

### Authentication Endpoints

- POST \`/api/auth/register\` - Register new user
- POST \`/api/auth/login\` - Login and get JWT token
- GET \`/api/auth/me\` - Get current user profile

### Course Endpoints

- GET \`/api/courses/me\` - Get user's enrolled courses
- GET \`/api/courses/:courseId/content\` - Get course content

### Assignment Endpoints

- GET \`/api/assignments/course/:courseId\` - Get course assignments
- POST \`/api/assignments/:assignmentId/submit\` - Submit assignment
- POST \`/api/assignments/:assignmentId/grade\` - Grade assignment (Teacher)

### Quiz Endpoints

- GET \`/api/quizzes/:quizId/attempts\` - Get quiz attempts
- POST \`/api/quizzes/:quizId/attempt/start\` - Start quiz attempt
- POST \`/api/quizzes/:quizId/attempt/:attemptId/submit\` - Submit quiz

### Grade Endpoints

- GET \`/api/grades/course/:courseId\` - Get course grades

### Discussion Endpoints

- GET \`/api/discussions/forums/:courseId\` - Get course forums
- POST \`/api/discussions/forum/:forumId/thread\` - Create discussion thread
- POST \`/api/discussions/thread/:threadId/reply\` - Reply to thread

### Admin Endpoints (Admin/SuperAdmin only)

- GET \`/api/admin/users\` - Get all users (with pagination, search, filters)
- POST \`/api/admin/payments/toggle/:userId\` - Toggle payment restriction
- GET \`/api/admin/logs\` - Get student activity logs
- GET \`/api/admin/logs/export\` - Export logs as CSV

## Moodle Configuration

### Enable Web Services

1. Navigate to **Site Administration > Plugins > Web services > Overview**
2. Enable web services
3. Enable REST protocol
4. Create a service with required functions:
   - \`core_webservice_get_site_info\`
   - \`core_course_get_courses\`
   - \`core_course_get_contents\`
   - \`mod_assign_get_assignments\`
   - \`mod_assign_submit_for_grading\`
   - \`mod_quiz_get_quizzes_by_courses\`
   - \`core_grades_get_grades\`
   - \`mod_forum_get_forums_by_courses\`
5. Generate token for the service user

## Deployment

### Production Build

\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start production services
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## Security Considerations

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configured
- ✅ Helmet.js security headers
- ✅ SQL injection prevention via TypeORM
- ⚠️ TODO: Implement refresh tokens
- ⚠️ TODO: Add CSRF protection
- ⚠️ TODO: Configure SSL/TLS for production

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check connection credentials in \`.env\`
- Ensure database exists

### Moodle API Errors
- Verify \`MOODLE_WS_TOKEN\` is valid
- Check Moodle web services are enabled
- Verify required functions are added to service

## License

MIT License

---

**Built with ❤️ for modern education**
