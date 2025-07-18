# 🏪 Inventory Management System (IMS)

The **Inventory Management System (IMS)** is a full-stack application developed to efficiently manage stock, sales, and supplier interactions within an organization. It features real-time stock tracking, secure user management, and streamlined order handling to improve operational efficiency.

---

## 🚀 Features

- 🔐 Role-Based Access (Admin, Supplier, Sales Person)
- 📦 Product Management (Add/Update/Delete)
- 🧾 Billing and Invoice Generation
- 📊 Reports & Analytics
- 📥 Supplier Order Management
- 📈 Real-Time Dashboard with Low Stock Alerts
- 🔔 Notification System
- 🛡️ Secure Authentication & Session Management

---

## 👤 User Roles

| Role         | Permissions |
|--------------|-------------|
| **Admin**     | Manage products, suppliers, stock, users, view reports, and approve orders |
| **Supplier**  | View & fulfill orders, manage supply status and delivery |
| **Sales Person** | Generate invoices, bill products, and update stock |

---

## 🔑 Default Credentials


| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@gmail.com` | `Admin@!123` |
| Supplier | `supplier@gmail.com` | `Supplier@!123` |
| Sales Person | `sales@gmail.com` | `Sales@!123` |

---

## 📂 Project Modules

1. **Dashboard Module**
2. **Product Management**
3. **Supplier Management**
4. **Order Management**
5. **Inventory Tracking**
6. **Billing & Sales**
7. **User Management**
8. **Reports & Analytics**
9. **Authentication & Security**

---

## 🛠️ Setup Instructions

### 1. 📦 Clone & Extract
```bash
git clone <your-repo-url>
# OR
Extract the provided `i_m_s.zip` file.
```

### 2. 💻 Frontend Setup (Angular 19+)

```bash
cd ims-frontend
npm install
ng serve
```

### 3. 🖥️ Backend Setup (Node.js/Express or Spring Boot etc.)

```bash
cd ims-backend
npm install
npm start
```

### 4. 🛢️ Database Setup (MySQL/MongoDB)
- Create database `inventory_db`
- Run the SQL dump provided in `/db/` (or `init.sql` file)
- Configure `.env` or `application.properties` with DB credentials

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=inventory_db
```

---


## 🧭 Navigation Guide

- `/login` → Login with appropriate role
- `/dashboard` → Role-specific dashboard
- `/products` → Add/update/delete (Admin only)
- `/orders` → View, approve, fulfill orders
- `/billing` → Sales person can generate invoice
- `/suppliers` → Admin manages suppliers
- `/analytics` → Admin views reports

---

## 🔐 Security

- Role-based routing
- Session management
- Logout functionality
- Credential update option for all users

---



