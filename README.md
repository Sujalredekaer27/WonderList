# 🏨 Wonderlist - Premium Airbnb Clone

![Version](https://img.shields.io/badge/version-1.0.0-fe424d.svg)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![GitHub followers](https://img.shields.io/github/followers/Sujalredekaer27?style=social)](https://github.com/Sujalredekaer27)

> **Status:** 🚀 **Core Engine Online!** Wonderlist is a high-performance web application designed for property discovery and management, featuring a seamless MVC architecture and robust error handling.

---

## 🎨 What's New in v1.0 (Initial Release)
* **Airbnb Aesthetic:** Clean card-based layouts with a focus on high-quality imagery and clear typography.
* **Seamless CRUD:** Optimized workflows for adding, viewing, editing, and deleting global property listings.
* **Advanced Error Handling:** Integrated `wrapAsync` and custom `ExpressError` classes to ensure server stability.
* **Unified Layout:** Consistent header/footer styling using `ejs-mate` for a professional, modular feel.

---

## 🛠️ Internal Logic & Flow
The app follows a strict **MVC (Model-View-Controller)** pattern to ensure the code remains scalable and maintainable.



1. **Client Request:** User visits a route (e.g., `/listings`).
2. **Express Route:** `app.js` receives the request and triggers the corresponding asynchronous handler.
3. **Mongoose Model:** The `Listing` model ensures data matches our schema (title, description, price, location, country).
4. **EJS Render:** The server injects the database results into `.ejs` templates and sends the styled HTML back to the user.

---

## 🚦 REST API Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| **GET** | `/listings` | **Index:** View all curated property listings |
| **GET** | `/listings/new` | **New:** Form to list a new property |
| **POST** | `/listings` | **Create:** Validate and save a new listing to MongoDB |
| **GET** | `/listings/:id` | **Show:** Detailed view of a specific property |
| **GET** | `/listings/:id/edit` | **Edit:** Form to modify an existing listing |
| **PUT** | `/listings/:id` | **Update:** Apply changes to a specific property |
| **DELETE** | `/listings/:id` | **Destroy:** Permanently remove a listing |

---

## 📂 Project Structure
```text
Wonderlist/
├── models/
│   └── listing.js        # Mongoose Schema & Validation
├── public/
│   └── css/             # Global Stylesheets & Assets
├── utils/
│   ├── wrapAsync.js      # Async error wrapper
│   └── ExpressError.js   # Custom error utility class
├── views/
│   ├── layouts/         # Boilerplate & UI Partials
│   ├── listing/         # CRUD EJS Templates
│   └── error.ejs        # Dynamic Error Feedback Page
├── app.js               # Main server & Route handlers
└── package.json         # Project dependencies
