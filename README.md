# FieldFlow — Home Repair & Field Service Booking Platform

FieldFlow is an enterprise-grade, multi-role Home Repair and Field Service Dispatch Platform connecting Customers, Technicians, Dispatchers, and Administrators in real-time. Built with Next.js (App Router), Node.js (Express ESM), PostgreSQL (Supabase), and JWT Role-Based Access Control (RBAC).

---

## 🌟 Key Platform Features

- **Multi-Role Authentication & Dynamic Routing**: Unified login page for Customer (`role_id: 1`), Technician (`role_id: 2`), Dispatcher (`role_id: 3`), and Admin (`role_id: 4`) with server-enforced JWT access control.
- **Customer Booking Flow**: Live service catalog, dynamic problem selection, emergency priority toggle (+₹300 charge), real-time status tracking, location view, and completion confirmation.
- **Handshake Completion & Feedback System**: Technicians mark work finished (`Waiting for Customer Confirmation`). The Customer app provides an explicit completion action to move status to `Completed` and triggers 5-star performance feedback for the technician.
- **Technician Field Operations**: Real-time job assignment queue, GPS ping updates, 5-point safety inspection checklist, status workflow (`Accepted` -> `On The Way` -> `Arrived` -> `Working` -> `Waiting Confirmation`), and emergency broadcast acceptance.
- **Dispatcher Operations & Intake Stream**: Live dispatch dashboard, manual phone booking creation, technician assignment engine, emergency priority broadcasting, and job status tracking.
- **Admin System Management**: Real-time KPI analytics, revenue tracking, audit logs, and account toggle controls (active/inactive status enforcement).
- **Persistent Supabase Database**: Zero mock data; all entities stored in Supabase PostgreSQL tables.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router, Tailwind CSS, Lucide React, React Icons) |
| **Backend Server** | Node.js, Express (Native ES Modules), CORS |
| **Database & Auth** | Supabase (PostgreSQL), `@supabase/supabase-js`, bcryptjs, jsonwebtoken |
| **State Management** | React Context (`AppStore`), Zustand (`technicianStore`) |
| **API Protocol** | RESTful JSON API with Bearer JWT Authorization |

---

## 📁 Repository Structure

```
fixibly-project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js             # Supabase client & admin client configuration
│   │   ├── controllers/
│   │   │   ├── adminController.js      # Admin analytics, user status toggle, audit logs
│   │   │   ├── authController.js       # Register, login, role routing & token issuance
│   │   │   ├── customerController.js   # Booking creation, tracking, cancel, handshake, feedback
│   │   │   ├── dispatcherController.js # Intake stream, tech assignment, manual booking
│   │   │   ├── notificationController.js# Notifications query & mark-read handlers
│   │   │   ├── profileController.js    # User profile management
│   │   │   └── technicianController.js # Tech jobs, status workflow, GPS, emergency accept
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js       # JWT validation & user attachment
│   │   │   └── roleMiddleware.js       # Role ID / name access guard
│   │   ├── routes/
│   │   │   ├── adminRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   ├── dispatcherRoutes.js
│   │   │   ├── notificationRoutes.js
│   │   │   ├── profileRoutes.js
│   │   │   └── technicianRoutes.js
│   │   ├── services/
│   │   │   ├── auditService.js         # Inserts logs to activity_logs table
│   │   │   └── notificationService.js  # Inserts notifications to notifications table
│   │   ├── utils/
│   │   │   ├── hashPassword.js         # bcrypt password hashing
│   │   │   ├── jwt.js                  # Token generation & verification
│   │   │   └── response.js             # Standardized API response format
│   │   ├── app.js                      # Express application setup & route mounting
│   │   └── server.js                   # Server entry point (Port 5000)
│   ├── package.json                    # Backend dependencies ("type": "module")
│   └── .env                            # Supabase URL & Service Key configuration
│
└── fixibly/                            # Next.js Frontend Application
    ├── app/
    │   ├── admin/                      # Admin dashboard & management views
    │   ├── authentication/             # Login & 4-role registration pages
    │   ├── components/                 # Reusable UI components per role
    │   ├── context/
    │   │   └── AppStore.js             # Shared application context & REST API sync
    │   ├── customer/                   # Customer dashboard, booking, tracking & feedback
    │   ├── dispatcher/                 # Dispatcher dashboard, intake, assignment & manual booking
    │   ├── technician/                 # Technician dashboard, job details & GPS tracker
    │   ├── utils/
    │   │   └── api.js                  # Centralized fetch wrapper with JWT bearer token
    │   └── layout.js / page.js
    └── package.json
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

- **`users`**: `user_id`, `full_name`, `email`, `phone`, `password_hash`, `role_id`, `is_active`, `created_at`
- **`roles`**: `role_id` (1: Customer, 2: Technician, 3: Dispatcher, 4: Admin), `role_name`
- **`service_categories`**: `category_id`, `category_name`, `description`, `icon_name`
- **`service_problems`**: `problem_id`, `category_id`, `problem_name`, `fixed_price`
- **`technicians`**: `technician_id`, `user_id`, `category_id`, `availability_status` (`Available`, `Busy`, `Offline`), `rating`, `experience`
- **`bookings`**: `booking_id`, `customer_id`, `technician_id`, `category_id`, `problem_id`, `booking_status`, `emergency_flag`, `emergency_reason`, `priority`, `street`, `area`, `city`, `pincode`, `created_at`
- **`technician_locations`**: `location_id`, `technician_id`, `latitude`, `longitude`, `updated_at`
- **`feedback`**: `feedback_id`, `booking_id`, `technician_id`, `customer_id`, `overall_rating`, `professional_behaviour`, `service_quality`, `timeliness`, `cleanliness`, `problem_resolution`, `comments`, `created_at`
- **`notifications`**: `notification_id`, `recipient_role`, `title`, `message`, `is_read`, `created_at`
- **`activity_logs`**: `log_id`, `user_id`, `action`, `details`, `created_at`

---

## 🔌 API Endpoint Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Create user with selected role (Customer, Technician, Dispatcher, Admin)
- `POST /api/auth/login`: Authenticate email/password and return JWT token + user profile

### Customer Operations (`/api/customer`)
- `GET /api/customer/services`: List service categories
- `GET /api/customer/services/:categoryId/problems`: List problems for category
- `POST /api/customer/bookings`: Create new service request
- `GET /api/customer/bookings/:bookingId`: Get booking details
- `GET /api/customer/bookings/:bookingId/tracking`: Live status & technician details
- `PATCH /api/customer/bookings/:bookingId/cancel`: Cancel booking
- `PATCH /api/customer/bookings/:bookingId/confirm-completion`: **Handshake completion confirmation**
- `GET /api/customer/bookings/history`: Fetch customer booking history
- `POST /api/customer/feedback`: Submit 5-star performance feedback

### Technician Operations (`/api/technician`)
- `GET /api/technician/profile`: Technician profile & rating
- `GET /api/technician/dashboard`: Active jobs & stats summary
- `GET /api/technician/jobs`: List assigned jobs
- `PATCH /api/technician/jobs/:id/status`: Transition job status (`Accepted`, `On The Way`, `Arrived`, `Working`, `Waiting for Customer Confirmation`)
- `PATCH /api/technician/jobs/:id/reject`: Reject/cancel assigned job
- `PATCH /api/technician/location`: Update technician GPS coordinates
- `GET /api/technician/emergency`: List broadcast emergency jobs
- `PATCH /api/technician/emergency/:id/accept`: Accept emergency broadcast

### Dispatcher Operations (`/api/dispatcher`)
- `GET /api/dispatcher/dashboard`: Intake stream & technician availability summary
- `PATCH /api/dispatcher/bookings/:bookingId/assign`: Assign technician to booking
- `POST /api/dispatcher/manual-booking`: Create walk-in or call booking

### Admin Operations (`/api/admin`)
- `GET /api/admin/dashboard`: Platform KPI statistics
- `GET /api/admin/users`: List all platform users across roles
- `PATCH /api/admin/users/:userId/toggle-status`: Enable or disable user account access

---

## 🚀 Setup & Run Instructions

### Prerequisites
- Node.js v18+
- npm or yarn

### 1. Start Backend Server
```bash
cd backend
npm install
node src/server.js
# Server running on http://localhost:5000
```

### 2. Start Next.js Frontend
```bash
cd fixibly
npm install
npm run dev
# App running on http://localhost:3000
```

### 3. Demo Credentials
Log in via `http://localhost:3000/authentication/login` using your registered credentials or select your role to register a new account.

---
*FieldFlow Platform — Built for reliable, high-performance home repair & field service management.*
