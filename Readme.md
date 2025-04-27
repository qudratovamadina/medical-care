# Medical Care Application

## Description
The **Medical Care Application** is a web-based platform designed to streamline the process of booking medical consultations, managing appointments, and accessing healthcare services. Built with **React**, **Tailwind CSS**, and **Supabase**, the app supports both guest and authenticated users, offering a seamless and secure experience for patients and healthcare providers.

---

## Key Features
- **User Authentication**: Secure login and registration for patients and doctors.
- **Appointment Booking**: Book appointments with doctors and manage schedules.
- **Consultation Management**: Upload notes and attachments for consultations.
- **Notifications**: Real-time notifications for updates and reminders.
- **Responsive Design**: Fully responsive UI built with Tailwind CSS.
- **Data Storage**: Secure file uploads and data management using Supabase.

---

## Technologies Used
- **Frontend**: React, Tailwind CSS
- **Backend**: Supabase (Database and Storage)
- **State Management**: React Context API
- **Routing**: React Router

---

## Prerequisites and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account and project setup

### Installation Steps
1. Clone the repository:
  ```bash
  git clone https://github.com/qudratovamadina/medical-care.git
  cd medical-care
  ```
2. Install dependencies:
  ```bash
  npm install
  ```

---

## Folder and File Structure

```
src/
├── App.jsx                # Main application component
├── index.css              # Global styles
├── main.jsx               # Entry point for React
├── api/                   # API service files
│   ├── auth.js            # Authentication API
│   ├── consultations.js   # Consultation-related API
│   ├── doctor.js          # Doctor-related API
│   ├── feedbacks.js       # Feedback-related API
│   ├── notifier.js        # Notification API
│   └── patient.js         # Patient-related API
├── components/            # Reusable UI components
│   ├── Dropdown.jsx       # Dropdown component
│   ├── Sidebar.jsx        # Sidebar navigation
│   ├── Support.jsx        # Support widget
│   ├── TopNavbar.jsx      # Top navigation bar
│   ├── booking/           # Booking-related components
│   │   └── DoctorCard.jsx # Doctor card component
│   ├── consultation/      # Consultation-related components
│   │   └── ConsultationForm.jsx # Form for consultations
│   ├── dashboard/         # Dashboard components
│   ├── landing/           # Landing page components
│   └── utils/             # Utility functions
├── pages/                 # Page components
│   ├── BookAppointments.jsx # Appointment booking page
│   ├── BookDoctors.jsx      # Doctor booking page
│   ├── ConsultationsList.jsx # List of consultations
│   ├── LandingPage.jsx      # Landing page
│   ├── MyAppointments.jsx   # User's appointments
│   ├── Notifications.jsx    # Notifications page
│   ├── Profile.jsx          # User profile page
│   ├── UserDashboard.jsx    # Dashboard for users
│   └── Register/            # Registration-related components
├── provider/              # Context providers
│   ├── AuthProvider.jsx   # Authentication context
│   ├── NotificationProvider.jsx # Notification context
│   └── ProtectedRoute.jsx # Route protection
```

---

## How the App Works

1. **Authentication**: Users can register or log in. Authentication is handled via Supabase.
2. **Booking**: Users can browse available doctors and book appointments.
3. **Consultations**: Patients and doctors can upload notes and attachments for consultations.
4. **Notifications**: Users receive real-time updates for appointments and consultations.
5. **Dashboard**: Provides an overview of appointments, consultations, and notifications.

---

## Running the App

### Development
Start the development server:
```bash
npm run dev
```

### Production
1. Build the app:
  ```bash
  npm run build
  ```
2. Serve the production build:
  ```bash
  npm run serve
  ```

## Authentication
Authentication is managed using Supabase's authentication service. Users can log in or register using their email and password. Protected routes are implemented using the `ProtectedRoute` component, ensuring only authenticated users can access certain pages.

---

## How to Contribute
1. Fork the repository.
2. Create a new branch:
  ```bash
  git checkout -b feature-name
  ```
3. Make your changes and commit:
  ```bash
  git commit -m "Add feature-name"
  ```
4. Push to your branch:
  ```bash
  git push origin feature-name
  ```
5. Open a pull request.
