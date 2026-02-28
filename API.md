# API Documentation

Complete REST API reference for the Moodle LMS Wrapper.

**Base URL:** `http://localhost:5000/api` (development)  
**Production:** `https://api.yourdomain.com/api`

---

## Authentication

All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "STUDENT",
  "moodleUserId": 123
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT",
      "moodleUserId": 123
    }
  }
}
```

---

### Login

**POST** `/auth/login`

Authenticate and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "STUDENT"
    }
  }
}
```

---

### Get Current User

**GET** `/auth/me`

Get authenticated user's profile.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "STUDENT",
    "moodleUserId": 123,
    "isRestricted": false
  }
}
```

---

## Courses

### Get User's Courses

**GET** `/courses/me`

Get all courses for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 101,
      "fullname": "Computer Science 101",
      "shortname": "CS101",
      "category": 1,
      "visible": 1
    }
  ]
}
```

---

### Get Course Content

**GET** `/courses/:courseId/content`

Get detailed content for a specific course.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Introduction",
      "visible": 1,
      "modules": [
        {
          "id": 10,
          "name": "Welcome Video",
          "modname": "resource"
        }
      ]
    }
  ]
}
```

---

### Get Enrolled Users

**GET** `/courses/:courseId/enrolled`

Get list of users enrolled in a course (Teacher/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "username": "student1",
      "firstname": "Jane",
      "lastname": "Smith",
      "email": "jane@example.com"
    }
  ]
}
```

---

## Assignments

### Get Course Assignments

**GET** `/assignments/course/:courseId`

Get all assignments for a course.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "cmid": 201,
      "name": "Assignment 1: Introduction",
      "duedate": 1709251200,
      "grade": 100
    }
  ]
}
```

---

### Submit Assignment

**POST** `/assignments/:assignmentId/submit`

Submit an assignment (with optional file upload).

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Form Data:**
- `file`: File upload (optional)
- `onlinetext`: Text submission (optional)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Assignment submitted successfully"
}
```

---

### Get Assignment Submissions

**GET** `/assignments/:assignmentId/submissions`

Get all submissions for an assignment (Teacher only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "userid": 2,
      "status": "submitted",
      "timecreated": 1709000000,
      "timemodified": 1709000000
    }
  ]
}
```

---

### Grade Assignment

**POST** `/assignments/:assignmentId/grade`

Grade a student's assignment (Teacher only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "userId": 2,
  "grade": 85,
  "feedback": "Good work! Consider improving..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Assignment graded successfully"
}
```

---

## Quizzes

### Get Course Quizzes

**GET** `/quizzes/course/:courseId`

Get all quizzes for a course.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 301,
      "course": 101,
      "name": "Midterm Quiz",
      "timeopen": 1709000000,
      "timeclose": 1709086400,
      "timelimit": 3600
    }
  ]
}
```

---

### Get Quiz Attempts

**GET** `/quizzes/:quizId/attempts`

Get user's attempts for a quiz.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 501,
      "quiz": 301,
      "userid": 1,
      "attempt": 1,
      "state": "finished",
      "sumgrades": 85
    }
  ]
}
```

---

### Start Quiz Attempt

**POST** `/quizzes/:quizId/attempt/start`

Start a new quiz attempt.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "attemptid": 502,
    "questions": [
      {
        "slot": 1,
        "type": "multichoice",
        "questiontext": "What is 2+2?"
      }
    ]
  }
}
```

---

### Submit Quiz

**POST** `/quizzes/:quizId/attempt/:attemptId/submit`

Submit answers for a quiz attempt.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "answers": [
    {
      "questionId": 1,
      "answer": "4"
    }
  ]
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Quiz submitted successfully",
  "data": {
    "grade": 90,
    "feedback": "Excellent work!"
  }
}
```

---

## Grades

### Get Course Grades

**GET** `/grades/course/:courseId`

Get all grades for a course.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "itemname": "Assignment 1",
      "graderaw": 85,
      "grademax": 100,
      "feedback": "Good work"
    }
  ]
}
```

---

### Get User Course Grades

**GET** `/grades/user/:userId/course/:courseId`

Get a specific user's grades (Teacher/Admin only).

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "itemname": "Midterm Exam",
      "graderaw": 92,
      "grademax": 100
    }
  ]
}
```

---

## Discussions

### Get Course Forums

**GET** `/discussions/forums/:courseId`

Get all forums for a course.

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 401,
      "course": 101,
      "name": "General Discussion",
      "intro": "Discuss course topics here"
    }
  ]
}
```

---

### Create Discussion Thread

**POST** `/discussions/forum/:forumId/thread`

Create a new discussion thread.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "subject": "Question about recursion",
  "message": "Can someone explain tail recursion?"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Thread created successfully",
  "data": {
    "discussionid": 601
  }
}
```

---

### Reply to Thread

**POST** `/discussions/thread/:threadId/reply`

Reply to a discussion thread.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "message": "Tail recursion is when the recursive call is the last operation..."
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Reply posted successfully"
}
```

---

## Admin Endpoints

All admin endpoints require ADMIN or SUPERADMIN role.

### Get All Users

**GET** `/admin/users`

Get paginated list of all users.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (optional)
- `role` (optional: STUDENT, TEACHER, ADMIN)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "email": "user@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "role": "STUDENT",
        "isActive": true,
        "isRestricted": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### Update User

**PUT** `/admin/users/:userId`

Update user information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "TEACHER",
  "isActive": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "User updated successfully"
}
```

---

### Toggle Payment Restriction

**POST** `/admin/payments/toggle/:userId`

Toggle payment restriction for a user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "isRestricted": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Payment status updated successfully"
}
```

---

### Get Activity Logs

**GET** `/admin/logs`

Get student activity logs with filtering.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `startDate` (ISO 8601 format)
- `endDate` (ISO 8601 format)
- `action` (LOGIN, COURSE_VIEW, ASSIGNMENT_SUBMIT, etc.)
- `userId` (optional)
- `page` (default: 1)
- `limit` (default: 50)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": 1,
        "userId": 2,
        "action": "COURSE_VIEW",
        "courseId": "CS101",
        "ipAddress": "192.168.1.1",
        "timestamp": "2026-02-28T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1250
    }
  }
}
```

---

### Export Logs to CSV

**GET** `/admin/logs/export`

Export activity logs as CSV file.

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:** (same as Get Activity Logs)

**Response:** `200 OK`
```csv
Content-Type: text/csv
Content-Disposition: attachment; filename="student-logs-20260228.csv"

id,userId,action,courseId,ipAddress,timestamp
1,2,COURSE_VIEW,CS101,192.168.1.1,2026-02-28T10:30:00Z
...
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `PAYMENT_REQUIRED` | 403 | User has payment restriction |
| `MOODLE_ERROR` | 502 | Moodle API error |
| `SERVER_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Window:** 15 minutes
- **Max Requests:** 100 per IP
- **Response:** `429 Too Many Requests`

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests, please try again later"
  }
}
```

---

## Testing with cURL

### Register and Login
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User",
    "role": "STUDENT",
    "moodleUserId": 2
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'

# Save token
TOKEN="your-jwt-token-here"
```

### Get Courses
```bash
curl -X GET http://localhost:5000/api/courses/me \
  -H "Authorization: Bearer $TOKEN"
```

### Submit Assignment
```bash
curl -X POST http://localhost:5000/api/assignments/123/submit \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@assignment.pdf" \
  -F "onlinetext=Here is my submission"
```

---

## Postman Collection

Import this collection into Postman:

[Download Postman Collection](./postman_collection.json)

Or use the Postman API:
```
https://www.getpostman.com/collections/your-collection-id
```

---

## GraphQL (Future)

GraphQL endpoint coming soon at `/graphql`

---

**Last Updated:** February 28, 2026  
**API Version:** 1.0.0
