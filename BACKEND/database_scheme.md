CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(30) UNIQUE NOT NULL
);

INSERT INTO roles (role_name)
VALUES
('Customer'),
('Technician'),
('Dispatcher'),
('Admin');

SELECT * FROM roles;

CREATE TABLE users (
    user_id BIGSERIAL PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(100) NOT NULL UNIQUE,

    phone VARCHAR(15) UNIQUE,

    address TEXT,

    password_hash TEXT NOT NULL,

    role_id INTEGER NOT NULL,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_role
        FOREIGN KEY (role_id)
        REFERENCES roles(role_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
);

// Service 

CREATE TABLE service_categories (
    category_id SERIAL PRIMARY KEY,

    category_name VARCHAR(100) NOT NULL UNIQUE,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO service_categories (category_name)
VALUES
('Plumbing'),
('Electrical'),
('HVAC'),
('House Cleaning'),
('Exterior Cleaning'),
('Handyman'),
('Landscaping'),
('Pest Control'),
('Home Remodeling'),
('Painting & Decoration');

SELECT * FROM service_categories;


CREATE TABLE service_problems (
    problem_id SERIAL PRIMARY KEY,

    category_id INTEGER NOT NULL,

    problem_name VARCHAR(100) NOT NULL,

    fixed_price DECIMAL(10,2),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_problem_category
        FOREIGN KEY (category_id)
        REFERENCES service_categories(category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT uq_category_problem
        UNIQUE (category_id, problem_name)
);

INSERT INTO service_problems (category_id, problem_name, fixed_price)
VALUES
(1, 'Tap Leakage', 250),
(1, 'Pipe Burst', 600),
(1, 'Sink Blockage', NULL),
(1, 'Water Heater Repair', 1200),
(1, 'Toilet Repair', NULL),
(1, 'Low Water Pressure', NULL),
(1, 'Others', NULL);

SELECT * FROM service_problems;

CREATE TABLE bookings (
    booking_id BIGSERIAL PRIMARY KEY,

    customer_id BIGINT NOT NULL,

    category_id INTEGER NOT NULL,

    problem_id INTEGER,

    issue_description TEXT,

    emergency_flag BOOLEAN DEFAULT FALSE,

    emergency_reason TEXT,

    priority VARCHAR(20) NOT NULL,

    preferred_date DATE,

    preferred_time TIME,

    anytime_service BOOLEAN DEFAULT FALSE,

    booking_status VARCHAR(30) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_booking_category
        FOREIGN KEY (category_id)
        REFERENCES service_categories(category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_booking_problem
        FOREIGN KEY (problem_id)
        REFERENCES service_problems(problem_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_priority
        CHECK (priority IN ('Normal', 'Emergency')),

    CONSTRAINT chk_booking_status
        CHECK (
            booking_status IN (
                'Pending',
                'Assigned',
                'Accepted',
                'On The Way',
                'Arrived',
                'Working',
                'Completed',
                'Cancelled'
            )
        )
);

SELECT * FROM bookings;


ALTER TABLE bookings
ADD COLUMN house_number VARCHAR(50);

ALTER TABLE bookings
ADD COLUMN apartment_name VARCHAR(100);

ALTER TABLE bookings
ADD COLUMN street VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE bookings
ADD COLUMN area VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE bookings
ADD COLUMN city VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE bookings
ADD COLUMN state VARCHAR(100) NOT NULL DEFAULT '';

ALTER TABLE bookings
ADD COLUMN pincode VARCHAR(10) NOT NULL DEFAULT '';


CREATE TABLE notifications (
    notification_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    booking_id BIGINT,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL,

    notification_type VARCHAR(30) NOT NULL,

    priority VARCHAR(20) NOT NULL,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_notification_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT fk_notification_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_notification_type
        CHECK (
            notification_type IN (
                'Booking',
                'Assignment',
                'Emergency',
                'Cancellation',
                'System'
            )
        ),

    CONSTRAINT chk_notification_priority
        CHECK (
            priority IN (
                'Low',
                'Medium',
                'High'
            )
        )
);

SELECT * FROM notifications;


CREATE TABLE payments (
    payment_id BIGSERIAL PRIMARY KEY,

    booking_id BIGINT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    payment_status VARCHAR(20) NOT NULL,

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_payment_status
        CHECK (
            payment_status IN (
                'Pending',
                'Successful',
                'Failed'
            )
        )
);


CREATE TABLE booking_status_history (
    status_history_id BIGSERIAL PRIMARY KEY,

    booking_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_status_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    CONSTRAINT chk_status
        CHECK (
            status IN (
                'Pending',
                'Assigned',
                'Accepted',
                'On The Way',
                'Arrived',
                'Working',
                'Completed',
                'Cancelled'
            )
        )
);

CREATE TABLE technicians (
    technician_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL UNIQUE,

    category_id INTEGER NOT NULL,

    experience INTEGER,

    rating DECIMAL(2,1),

    availability_status VARCHAR(20) NOT NULL DEFAULT 'Offline',

    profile_picture TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_technician_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_technician_category
        FOREIGN KEY (category_id)
        REFERENCES service_categories(category_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_availability
        CHECK (
            availability_status IN (
                'Available',
                'Busy',
                'Offline'
            )
        ),

    CONSTRAINT chk_rating
        CHECK (
            rating >= 0 AND rating <= 5
        )
);

ALTER TABLE bookings
ADD COLUMN technician_id BIGINT;

ALTER TABLE bookings
ADD CONSTRAINT fk_booking_technician
FOREIGN KEY (technician_id)
REFERENCES technicians(technician_id)
ON UPDATE CASCADE
ON DELETE SET NULL;



CREATE TABLE technician_locations (
    location_id BIGSERIAL PRIMARY KEY,

    technician_id BIGINT NOT NULL,

    latitude DECIMAL(10,8) NOT NULL,

    longitude DECIMAL(11,8) NOT NULL,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_location_technician
        FOREIGN KEY (technician_id)
        REFERENCES technicians(technician_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);



CREATE TABLE feedback (
    feedback_id BIGSERIAL PRIMARY KEY,

    booking_id BIGINT NOT NULL,

    customer_id BIGINT NOT NULL,

    technician_id BIGINT NOT NULL,

    overall_rating INTEGER NOT NULL,

    professional_behaviour INTEGER NOT NULL,

    service_quality INTEGER NOT NULL,

    timeliness INTEGER NOT NULL,

    cleanliness INTEGER NOT NULL,

    problem_resolution INTEGER NOT NULL,

    comments TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_feedback_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_feedback_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_feedback_technician
        FOREIGN KEY (technician_id)
        REFERENCES technicians(technician_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_overall_rating
        CHECK (overall_rating BETWEEN 1 AND 5),

    CONSTRAINT chk_professional_behaviour
        CHECK (professional_behaviour BETWEEN 1 AND 5),

    CONSTRAINT chk_service_quality
        CHECK (service_quality BETWEEN 1 AND 5),

    CONSTRAINT chk_timeliness
        CHECK (timeliness BETWEEN 1 AND 5),

    CONSTRAINT chk_cleanliness
        CHECK (cleanliness BETWEEN 1 AND 5),

    CONSTRAINT chk_problem_resolution
        CHECK (problem_resolution BETWEEN 1 AND 5)
);



CREATE TABLE activity_logs (
    activity_id BIGSERIAL PRIMARY KEY,

    user_id BIGINT NOT NULL,

    booking_id BIGINT,

    activity_type VARCHAR(50) NOT NULL,

    activity_description TEXT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_activity_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT fk_activity_booking
        FOREIGN KEY (booking_id)
        REFERENCES bookings(booking_id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT chk_activity_type
        CHECK (
            activity_type IN (
                'Booking Creation',
                'Technician Assignment',
                'Emergency Downgrade',
                'Reassignment',
                'Status Update',
                'User Account Change',
                'Login',
                'Administrative Action'
            )
        )
);


ALTER TABLE feedback
ADD CONSTRAINT uq_feedback_booking
UNIQUE (booking_id);






SELECT * FROM notifications LIMIT 5;

SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'notifications';

ALTER TABLE notifications
ADD COLUMN recipient_role VARCHAR(50);

ALTER TABLE notifications
ALTER COLUMN user_id DROP NOT NULL;


SELECT column_name, is_nullable, data_type
FROM information_schema.columns
WHERE table_name = 'notifications';


ALTER TABLE notifications
ADD CONSTRAINT check_recipient_role
CHECK (
recipient_role IN 
(
'DISPATCHER',
'ADMIN',
'TECHNICIAN',
'CUSTOMER',
'ALL'
)
);


INSERT INTO notifications
(
title,
description,
notification_type,
priority,
recipient_role
)
VALUES
(
'Emergency Booking',
'New emergency service request available',
'Emergency',
'High',
'TECHNICIAN'
);


SELECT 
    conname,
    pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'notifications'::regclass;


SELECT DISTINCT priority
FROM notifications;


ALTER TABLE service_categories 
ADD COLUMN IF NOT EXISTS category_image_url TEXT;

-- 2. Work completed photo URL & handshake completion flags
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS work_completed_image_url TEXT,
ADD COLUMN IF NOT EXISTS customer_completed_flag BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS technician_completed_flag BOOLEAN DEFAULT FALSE;

UPDATE service_categories 
SET category_image_url = 'https://YOUR_SUPABASE_PROJECT_ID.supabase.co/storage/v1/object/public/service-category-images/plumbing.jpg'
WHERE category_name = 'Plumbing';
CREATE TABLE app_feedback (
    app_feedback_id BIGSERIAL PRIMARY KEY,

    customer_id BIGINT NOT NULL,

    rating INTEGER NOT NULL,

    comments TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_app_feedback_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    CONSTRAINT chk_app_feedback_rating
        CHECK (rating BETWEEN 1 AND 5)
);


ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
ADD COLUMN IF NOT EXISTS cancelled_by BIGINT;

ALTER TABLE bookings
ADD CONSTRAINT fk_booking_cancelled_by
FOREIGN KEY (cancelled_by)
REFERENCES users(user_id)
ON UPDATE CASCADE
ON DELETE SET NULL;

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS estimated_arrival TIMESTAMP;

ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS estimated_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS final_amount DECIMAL(10,2);

ALTER TABLE payments
ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20)
DEFAULT 'Final';

ALTER TABLE payments
ADD CONSTRAINT chk_payment_type
CHECK (
    payment_type IN (
        'Advance',
        'Final'
    )
);

ALTER TABLE app_feedback
ADD CONSTRAINT uq_app_feedback_customer
UNIQUE (customer_id);



INSERT INTO users(full_name,email,phone,address,password_hash,role_id) VALUES
('Aarav Sharma','aarav@example.com','9000000001','Bengaluru','hash1',1),
('Priya Nair','priya@example.com','9000000002','Mysuru','hash2',1),
('Rahul Verma','rahul@example.com','9000000003','Mangaluru','hash3',1),
('Sneha Rao','sneha@example.com','9000000004','Udupi','hash4',1),
('Vikram Pai','vikram@example.com','9000000005','Hubballi','hash5',1),
('Kiran Shetty','kiran.tech@example.com','9000000006','Mangaluru','hash6',2),
('Anjali Das','anjali.tech@example.com','9000000007','Bengaluru','hash7',2),
('Mohan Kumar','mohan.tech@example.com','9000000008','Mysuru','hash8',2),
('Dispatcher One','dispatcher@example.com','9000000009','HQ','hash9',3),
('Admin User','admin@example.com','9000000010','HQ','hash10',4);

-- SERVICE CATEGORIES
INSERT INTO service_categories(category_name)
VALUES
('Plumbing'),('Electrical'),('HVAC'),('House Cleaning'),('Exterior Cleaning'),
('Handyman'),('Landscaping'),('Pest Control'),('Home Remodeling'),('Painting & Decoration')
ON CONFLICT DO NOTHING;

-- SERVICE PROBLEMS
INSERT INTO service_problems(category_id,problem_name,fixed_price) VALUES
(1,'Tap Leakage',250),(2,'Switch Replacement',350),(3,'AC Not Cooling',800),
(4,'Deep Cleaning',1500),(5,'Wall Wash',1200),
(6,'Furniture Repair',900),(7,'Grass Cutting',700),(8,'Termite Control',1800),
(9,'Tile Repair',2200),(10,'Wall Painting',3500)
ON CONFLICT DO NOTHING;

-- TECHNICIANS
INSERT INTO technicians(user_id,category_id,experience,rating,availability_status,profile_picture) VALUES
(6,1,5,4.8,'Available',NULL),
(7,2,3,4.5,'Busy',NULL),
(8,3,7,4.9,'Available',NULL);

-- BOOKINGS
INSERT INTO bookings
(customer_id,category_id,problem_id,issue_description,emergency_flag,priority,preferred_date,preferred_time,booking_status,house_number,street,area,city,state,pincode,technician_id)
VALUES
(1,1,1,'Kitchen tap leaking',false,'Normal','2026-08-01','10:00','Assigned','12','MG Road','Central','Bengaluru','Karnataka','560001',1),
(2,2,2,'Switch not working',true,'Emergency','2026-08-02','11:00','Accepted','45','Temple Rd','North','Mysuru','Karnataka','570001',2),
(3,3,3,'AC not cooling',false,'Normal','2026-08-03','14:00','Working','9','Market Rd','East','Mangaluru','Karnataka','575001',3),
(4,4,4,'Need deep cleaning',false,'Normal','2026-08-04','09:00','Completed','18','Lake Rd','West','Udupi','Karnataka','576101',NULL),
(5,5,5,'Exterior wall dirty',false,'Normal','2026-08-05','15:00','Pending','27','Hill Rd','South','Hubballi','Karnataka','580020',NULL);

-- STATUS HISTORY
INSERT INTO booking_status_history(booking_id,status) VALUES
(1,'Assigned'),(2,'Accepted'),(3,'Working'),(4,'Completed'),(5,'Pending');

-- PAYMENTS
INSERT INTO payments(booking_id,amount,payment_status,payment_type) VALUES
(1,250,'Pending','Advance'),
(2,350,'Successful','Final'),
(3,800,'Pending','Advance'),
(4,1500,'Successful','Final'),
(5,1200,'Failed','Advance');

-- NOTIFICATIONS
INSERT INTO notifications(user_id,booking_id,title,description,notification_type,priority)
VALUES
(1,1,'Booking Created','Your booking is created','Booking','Low'),
(2,2,'Emergency Assigned','Technician assigned','Assignment','High'),
(3,3,'Technician On Way','Technician is coming','Booking','Medium'),
(4,4,'Work Completed','Please review service','System','Low'),
(5,5,'Booking Pending','Waiting for technician','Booking','Medium');

-- TECHNICIAN LOCATIONS
INSERT INTO technician_locations(technician_id,latitude,longitude) VALUES
(1,12.9716,77.5946),
(2,12.2958,76.6394),
(3,12.9141,74.8560),
(1,12.9720,77.5950),
(2,12.2962,76.6400);

-- FEEDBACK
INSERT INTO feedback
(booking_id,customer_id,technician_id,overall_rating,professional_behaviour,service_quality,timeliness,cleanliness,problem_resolution,comments)
VALUES
(4,4,1,5,5,5,5,5,5,'Excellent service');

-- ACTIVITY LOGS
INSERT INTO activity_logs(user_id,booking_id,activity_type,activity_description) VALUES
(1,1,'Booking Creation','Customer created booking'),
(9,1,'Technician Assignment','Assigned technician'),
(6,1,'Status Update','Accepted booking'),
(10,NULL,'Administrative Action','Updated system settings'),
(2,2,'Login','Customer logged in');

-- APP FEEDBACK
INSERT INTO app_feedback(customer_id,rating,comments) VALUES
(1,5,'Great app'),
(2,4,'Easy to use'),
(3,5,'Excellent'),
(4,4,'Nice UI'),
(5,5,'Loved the experience');

SELECT COUNT(*) FROM bookings;

SELECT booking_id, booking_status
FROM bookings;

SELECT technician_id, availability_status
FROM technicians;


SELECT conname
FROM pg_constraint
WHERE conrelid = 'bookings'::regclass;

SELECT conname
FROM pg_constraint
WHERE conrelid = 'technicians'::regclass;

SELECT *
FROM notifications
ORDER BY created_at DESC;

SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT * from bookings;

INSERT INTO bookings (
customer_id,
category_id,
problem_id,
technician_id,
issue_description,
house_number,
street,
area,
city,
state,
pincode,
priority,
booking_status,
emergency_flag,
created_at
)
VALUES
(1,1,1,1,'AC not cooling','12','MG Road','Indiranagar','Bengaluru','Karnataka','560038','High','Assigned',false,NOW()-INTERVAL '2 days'),

(2,2,2,2,'Kitchen sink leakage','45','Temple Road','JP Nagar','Bengaluru','Karnataka','560078','Normal','Completed',false,NOW()-INTERVAL '6 days'),

(3,3,3,3,'Main door lock broken','8','Market Road','Whitefield','Bengaluru','Karnataka','560066','High','Working',false,NOW()-INTERVAL '5 hours'),

(4,1,2,NULL,'Emergency AC spark','33','Ring Road','HSR Layout','Bengaluru','Karnataka','560102','Emergency','Pending',true,NOW()),

(5,4,4,NULL,'No electricity','71','Lake View','RR Nagar','Bengaluru','Karnataka','560098','Emergency','Pending',true,NOW());