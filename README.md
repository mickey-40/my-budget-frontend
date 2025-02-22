Here's a **professional `README.md`** for your **React frontend**. This will help document your project for setup, deployment, and troubleshooting.  

---

### **📌 Create a `README.md` in the Frontend Folder**
Save the following content as `README.md` inside your **frontend/ directory**.

---

# **💰 Budget Tracker (React Frontend)**
### **A React-based web application to manage personal finances.**
---

## **📌 Features**
✅ **User Authentication** (Signup & Login with JWT)  
✅ **Add, Edit, and Delete Transactions**  
✅ **Track Income & Expenses with Charts**  
✅ **Secure JWT-based Authentication**  
✅ **Backend API Integration with Flask**  

---

## **🚀 Tech Stack**
- **Frontend:** React, Axios, TailwindCSS  
- **State Management:** useState, useEffect  
- **Charts:** Recharts  
- **Deployment:** Netlify (Frontend) + Render (Backend)  

---

## **📦 Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/budget-tracker-frontend.git
cd frontend
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Configure API Endpoint**
Modify `App.js` to use the **deployed backend URL**:
```js
const API_URL = "https://your-backend.onrender.com";  // ✅ Use Render backend URL
```

---

## **🔧 Running the App Locally**
### **1️⃣ Start the Development Server**
```bash
npm start
```
The app will be available at **`http://localhost:3000`**.

---

## **📡 Deploying to Netlify**
### **1️⃣ Push Code to GitHub**
```bash
git add .
git commit -m "Deploy frontend"
git push origin main
```

### **2️⃣ Deploy via Netlify Dashboard**
1. **Go to** [Netlify](https://app.netlify.com/)
2. **Click "New Site from Git"** and connect your **frontend GitHub repo**.
3. **Set the Build Settings**:
   - **Build Command:**  
     ```bash
     npm run build
     ```
   - **Publish Directory:**  
     ```
     build
     ```
4. Click **"Deploy Site"** 🚀

### **3️⃣ Set Environment Variables on Netlify**
1. **Go to Netlify Dashboard → Site Settings → Environment Variables**.
2. Add:
   ```
   REACT_APP_API_URL = https://your-backend.onrender.com
   ```
3. **Redeploy your app.**

---

## **📡 API Endpoints Used**
| Method | Endpoint         | Description                 | Auth Required |
|--------|-----------------|-----------------------------|--------------|
| `POST` | `/register`      | Register a new user        | ❌ No        |
| `POST` | `/login`         | Login & get JWT token      | ❌ No        |
| `POST` | `/transactions`  | Create a new transaction   | ✅ Yes       |
| `GET`  | `/transactions`  | Get user transactions      | ✅ Yes       |
| `PUT`  | `/transactions/:id` | Update transaction    | ✅ Yes       |
| `DELETE` | `/transactions/:id` | Delete transaction | ✅ Yes       |

---

## **🎯 Troubleshooting**
### **Login Issues (401 Unauthorized)**
- Ensure the **backend is running on Render**.
- Clear the browser’s **localStorage** and log in again:
  ```js
  localStorage.removeItem("token");
  ```
- Verify the **JWT_SECRET_KEY** in Render’s environment settings.

### **Transactions Not Saving (422 Error)**
- Ensure `Authorization` headers include `"Bearer <token>"`.
- Check that **your backend database is running**.

### **CORS Errors**
- Add this to Flask (`app.py`):
  ```python
  from flask_cors import CORS
  CORS(app, supports_credentials=True, origins=["https://your-netlify-app.netlify.app"])
  ```
- Redeploy backend.

---

## **👨‍💻 Author**
**Mickey Arnold**    
🔗 [GitHub](https://github.com/mickey-40) | [Netlify App](https://my-budget-ma.netlify.app/)  

---

## **🎉 Now Your Frontend Is Well-Documented!**
✅ **Setup guide for local & deployed environments**  
✅ **API documentation for backend integration**  
✅ **Troubleshooting common issues**  

🚀 **Now you're ready to share your project!** Let me know if you need any changes! 😊