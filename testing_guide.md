# Flight Management System - Testing Guide

The system is fully operational. Here is how you can perform an end-to-end test of the features we've built.

## 1. Initial Setup
The project is already running:
- **Frontend**: `http://localhost:5173/`
- **Backend**: `http://localhost:5000/`

## 2. Testing as a User
1. **Register**: Go to the Sign Up page and create a new account.
2. **Browse**: On the Home page, look at the seeded flights (New York to London, etc.).
3. **Search**: Use the search bar to filter by origin or destination.
4. **Book**: Click "Book Now" on a flight. (You will be prompted to login if you haven't already).
5. **Dashboard**: Visit your dashboard to see your confirmed booking.

## 3. Testing as an Admin
By default, the registration creates "user" roles. To test the Admin features (Managing Flights & seeing all bookings):

### Create an Admin Account
1. Go to **Sign Up**.
2. Create an account with any email.
3. **IMPORTANT**: Since this is a development build, you can manually change your role in the database or simply create another account. Alternatively, I can provide a script to promote a user to admin.

### Admin Features
Once logged in as an Admin:
- You will see a **"Manage Flights"** link in the Navbar.
- You can **Add New Flights** via the modal.
- You can **Delete Flights**.
- Your **Dashboard** will show all bookings made by *all* users in the system.

## 4. Troubleshooting
- **MongoDB**: Ensure your local MongoDB instance is running at `mongodb://127.0.0.1:27017/`.
- **Environment**: If you change the `JWT_SECRET` in `.env`, remember to restart the backend server.
