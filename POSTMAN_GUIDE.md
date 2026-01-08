# Postman Туршилтын Гарын Авлага

## Эхлэхээс өмнө

1. **Server асаах:**
```bash
npm run dev
```

2. **Clerk Token авах:**
   - Clerk Dashboard руу орох
   - Testing → Generate Token хэсэгт очих
   - Эсвэл frontend-аас login хийж token авах

---

## 📍 Боломжтой API Endpoints

### 1️⃣ GET /api/users/me
**Өөрийн хэрэглэгчийн мэдээлэл авах**

**Headers:**
```
Authorization: Bearer YOUR_CLERK_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "id": "mongodbId123",
  "email": "user@example.com",
  "clerkUserId": "user_abc123",
  "role": "user",
  "isApproved": true,
  "agentReward": 0,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

### 2️⃣ GET /api/users
**Бүх хэрэглэгчдийн жагсаалт (Admin only)**

**Headers:**
```
Authorization: Bearer ADMIN_CLERK_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "users": [
    {
      "_id": "mongoId1",
      "email": "user1@example.com",
      "role": "agent",
      "isApproved": false
    }
  ],
  "count": 1
}
```

---

### 3️⃣ PATCH /api/users/:userId/approve
**Agent-ийг зөвшөөрөх (Admin only)**

**URL:** `http://localhost:4000/api/users/65abc123.../approve`

**Headers:**
```
Authorization: Bearer ADMIN_CLERK_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "message": "Agent approved successfully",
  "user": {
    "_id": "65abc123...",
    "role": "agent",
    "isApproved": true,
    "approvedAt": "2024-01-08T12:00:00.000Z",
    "approvedBy": "user_adminClerkId"
  }
}
```

---

### 4️⃣ PATCH /api/users/role
**Хэрэглэгчийн role өөрчлөх (Admin only)**

**Headers:**
```
Authorization: Bearer ADMIN_CLERK_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "userId": "65abc123...",
  "newRole": "agent"
}
```

**Response:**
```json
{
  "message": "User role updated successfully",
  "user": {
    "_id": "65abc123...",
    "role": "agent",
    "isApproved": false
  }
}
```

---

## 🧪 Туршилтын дараалал

### Тест 1: Анхны хэрэглэгч үүсгэх
1. Postman дээр **GET /api/users/me** request илгээ
2. Clerk token ашиглах
3. Хэрэв DB-д хэрэглэгч байхгүй бол автоматаар үүснэ
4. Response дээр шинэ хэрэглэгчийн мэдээлэл харагдана

### Тест 2: Admin эрх туршиж үзэх
1. MongoDB Compass эсвэл CLI ашиглан өөрийн хэрэглэгчийн role-ийг `"admin"` болго:
```javascript
db.users.updateOne(
  { clerkUserId: "user_YOUR_CLERK_ID" },
  { $set: { role: "admin" } }
)
```
2. **GET /api/users** request илгээ
3. Бүх хэрэглэгчдийн жагсаалт харагдах ёстой

### Тест 3: Agent зөвшөөрөл
1. Өөр хэрэглэгчийн role-ийг `"agent"` болго
2. Admin token ашиглан **PATCH /api/users/:userId/approve** request илгээ
3. Agent зөвшөөрөгдсөн эсэхийг шалга

---

## ⚠️ Алдаа шийдвэрлэлт

### 401 Unauthorized
- Token буруу байна
- Token хугацаа дууссан байж болно
- `CLERK_SECRET_KEY` .env дээр зөв тохируулсан эсэхээ шалга

### 403 Forbidden
- Admin эрх шаардлагатай
- DB дээр role-ийг шалга

### 500 Server Error
- MongoDB холболт шалгах
- Server logs харах: `console.error` гэсэн алдаа хайх

---

## 🔧 .env Тохиргоо

Таны `.env` файл дараах байдалтай байх ёстой:

```env
MONGODB_URI=mongodb://localhost:27017/agentbuy
PORT=4000
CLERK_SECRET_KEY=sk_test_...
CLERK_ISSUER=https://your-clerk-domain.clerk.accounts.dev
```

---

## 📝 Нэмэлт тэмдэглэл

- Бүх route автоматаар `clerkAuth` middleware ашиглана
- Анхны хэрэглэгч автоматаар үүснэ (auto-create)
- Admin эрх шаардлагатай route-ууд автоматаар шалгана
- Token байнга шинэчлэх шаардлагатай (15-60 минут ихэвчлэн)
