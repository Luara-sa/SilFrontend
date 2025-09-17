# Company vs Student Endpoint Access Guide

## ✅ Company Available Endpoints

### Authentication
- `POST /company/login` - Login
- `POST /company/logout` - Logout

### Profile Management
- `GET /company/profile` - Get profile
- `POST /company/update-profile` - Update profile (first_name, profile_img, cv_file)

### Notifications
- `GET /company/notifications` - List notifications
- `GET /company/notifications/read/{id}` - Mark notification as read
- `DELETE /company/notifications/delete/{id}` - Delete notification
- `GET /company/notifications/read-all` - Mark all as read

### Courses (View Only)
- `GET /company/courses` - List courses with filtering
  - Supports filters: search, category_id, target_audience_id, is_free, is_paid, price, rating, duration, level_id, created_this_week/month/year
  - Pagination support

### Students Management
- `GET /company/students` - List students with search
- `GET /company/students/{id}` - Get specific student details

## ❌ Company NOT Available (Student Only)

### Categories
- All category endpoints

### Placement Tests
- All placement test endpoints

### Quizzes
- All quiz endpoints

### Course Features (Student Only)
- My enrolled courses
- Course enrollment
- Course curriculum access
- Course content (videos, reading, quizzes)
- Course reviews
- Course interest
- Course delegation
- Topic progress tracking
- Checkout/Payment

### LMS Features
- All learning management features
- Progress tracking
- Certificates
- Test results

## Implementation Notes

1. **ApiUtils.isEndpointAvailable()** - Checks if endpoint is available for current user
2. **Service methods throw errors** - Company users get clear error messages
3. **UI should hide/disable** - Features not available to companies
4. **Navigation menus** - Should be different for company vs student users

## UI Components That Need Company-Specific Handling

### Navigation/Sidebar
- Hide: Categories, My Courses, Tests, Certificates
- Show: Courses (view only), Students, Profile, Notifications

### Course Pages
- Company: View course list only, no enrollment buttons
- Student: Full course interaction

### Dashboard
- Company: Student management, course overview
- Student: Learning progress, enrolled courses

### Profile
- Company: Basic profile (name, image, CV)
- Student: Full profile with learning preferences
