# 🚀 AGENTBUY - ТӨСЛИЙН БҮТЭЦ БА ХӨГЖҮҮЛЭЛТИЙН ТӨЛӨВЛӨГӨӨ

## 📋 Төслийн тойм

**AgentBuy** - Хэрэглэгч болон агентуудыг холбосон захиалга удирдах систем. Хэрэглэгчид захиалга үүсгэж, агентууд захиалгыг хүлээн авч гүйцэтгэдэг платформ.

---

## 🎯 Үндсэн хэрэглэгчдийн урсгал (User Flow)

### 👤 ХЭРЭГЛЭГЧ (User)

```
1. Нүүр хуудас → "Хэрэглэгч" товч дарах
   ↓
2. Clerk Sign In/Sign Up
   ↓
3. Шинэ хэрэглэгч бол → Профайл үүсгэх форм
   ↓
4. Dashboard:
   - Захиалга үүсгэх
   - Өөрийн захиалгууд харах
   - Захиалгын статус харах
   - Агентийн тайлан харах
   - Чатлах
```

### 👨‍💼 АГЕНТ (Agent)

```
1. Нүүр хуудас → "Агент" товч дарах
   ↓
2. Clerk Sign In
   ↓
3. Имэйл шалгах (админ зөвшөөрсөн эсэх)
   ↓
4. Агент Dashboard (Зөвшөөрөгдсөн бол):
   - Нээлттэй захиалгууд харах
   - Захиалга дээр "Түгжих" (Lock)
   - Тайлан илгээх
   - Чатлах
```

### 👨‍💼 АДМИН (Admin)

```
1. Admin Dashboard
   ↓
2. Функцууд:
   - Бүх захиалга харах
   - Агентуудыг зөвшөөрөх/цуцлах
   - Статистик харах
```

---

## 🗄️ Database Schema

### 1. Users Collection

```typescript
{
  _id: ObjectId,
  email: string,              // Unique
  role: "user" | "agent" | "admin",
  isApproved: boolean,        // Агент зөвшөөрөгдсөн эсэх
  approvedAt?: Date,
  approvedBy?: string,        // Admin ID
  agentReward?: number,       // Агентын урамшуулал
  createdAt: Date,
  updatedAt: Date
}
```

### 2. Profiles Collection

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // User-тай холбох (unique)
  name: string,
  phone: string,
  email: string,
  cargo?: string,             // Ачааны мэдээлэл
  accountNumber?: string,     // Дансны дугаар
  createdAt: Date,
  updatedAt: Date
}
```

### 3. Orders Collection (Шинэ)

```typescript
{
  _id: ObjectId,
  userId: ObjectId,           // Захиалга үүсгэсэн хэрэглэгч
  agentId?: ObjectId,         // Захиалгыг авсан агент
  title: string,              // Захиалгын гарчиг
  description: string,        // Дэлгэрэнгүй
  category: string,           // Категори (электроникс, хувцас, гэх мэт)
  productUrl?: string,        // Бүтээгдэхүүний холбоос
  estimatedPrice?: number,    // Тооцоолсон үнэ
  status: "open" | "locked" | "in_progress" | "completed" | "cancelled",
  lockedAt?: Date,            // Агент түгжисэн огноо
  completedAt?: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4. Reports Collection (Шинэ)

```typescript
{
  _id: ObjectId,
  orderId: ObjectId,          // Захиалгатай холбох
  agentId: ObjectId,          // Тайлан илгээсэн агент
  content: string,            // Тайлангийн агуулга
  attachments?: string[],     // Зургийн URL-ууд
  status: "submitted" | "reviewed",
  createdAt: Date,
  updatedAt: Date
}
```

### 5. Messages Collection (Шинэ)

```typescript
{
  _id: ObjectId,
  orderId: ObjectId,          // Захиалгатай холбох
  senderId: ObjectId,         // Мессеж илгээсэн хүн (user эсвэл agent)
  senderRole: "user" | "agent",
  message: string,
  isRead: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🏗️ Backend API Endpoints

### 🔐 Authentication (Clerk Webhook)

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| POST | `/api/webhooks/clerk` | Clerk webhook handler |

### 👤 Users & Profiles

| Method | Endpoint | Тайлбар |
|--------|----------|---------|
| GET | `/api/users/me` | Одоогийн хэрэглэгчийн мэдээлэл |
| PUT | `/api/users/me` | Хэрэглэгчийн мэдээлэл шинэчлэх |
| POST | `/api/profiles` | Профайл үүсгэх |
| GET | `/api/profiles/me` | Өөрийн профайл авах |
| PUT | `/api/profiles/me` | Профайл шинэчлэх |

### 📦 Orders

| Method | Endpoint | Тайлбар | Эрх |
|--------|----------|---------|-----|
| POST | `/api/orders` | Захиалга үүсгэх | User |
| GET | `/api/orders` | Захиалгын жагсаалт | User (өөрийнх), Agent (нээлттэй) |
| GET | `/api/orders/:id` | Нэг захиалгын дэлгэрэнгүй | User, Agent |
| PUT | `/api/orders/:id/lock` | Захиалга түгжих | Agent |
| PUT | `/api/orders/:id/status` | Статус өөрчлөх | Agent |
| DELETE | `/api/orders/:id` | Захиалга устгах | User |

### 📊 Reports

| Method | Endpoint | Тайлбар | Эрх |
|--------|----------|---------|-----|
| POST | `/api/orders/:id/reports` | Тайлан илгээх | Agent |
| GET | `/api/orders/:id/reports` | Захиалгын тайлангууд | User, Agent |
| PUT | `/api/reports/:id` | Тайлан шинэчлэх | Agent |

### 💬 Messages (Chat)

| Method | Endpoint | Тайлбар | Эрх |
|--------|----------|---------|-----|
| POST | `/api/orders/:id/messages` | Мессеж илгээх | User, Agent |
| GET | `/api/orders/:id/messages` | Чатын түүх | User, Agent |
| PUT | `/api/messages/:id/read` | Мессеж уншсан тэмдэглэх | User, Agent |

### 👨‍💼 Admin

| Method | Endpoint | Тайлбар | Эрх |
|--------|----------|---------|-----|
| GET | `/api/admin/agents/pending` | Зөвшөөрөл хүлээж буй агентууд | Admin |
| PUT | `/api/admin/agents/:id/approve` | Агент зөвшөөрөх | Admin |
| PUT | `/api/admin/agents/:id/reject` | Агент татгалзах | Admin |
| GET | `/api/admin/orders` | Бүх захиалга | Admin |
| GET | `/api/admin/stats` | Статистик | Admin |

---

## 🎨 Frontend Pages

### Public Pages
- `/` - Landing page (Хэрэглэгч / Агент товчлуур)
- `/sign-in` - Нэвтрэх
- `/sign-up` - Бүртгүүлэх

### User Pages
- `/user/dashboard` - Хэрэглэгчийн дашбоард
- `/user/orders/new` - Захиалга үүсгэх
- `/user/orders` - Миний захиалгууд
- `/user/orders/:id` - Захиалгын дэлгэрэнгүй
- `/user/profile` - Профайл тохируулах

### Agent Pages
- `/agent/dashboard` - Агентийн дашбоард (Нээлттэй захиалгууд)
- `/agent/orders/:id` - Захиалгын дэлгэрэнгүй + Тайлан илгээх
- `/agent/my-orders` - Миний авсан захиалгууд
- `/agent/profile` - Профайл

### Admin Pages
- `/admin/dashboard` - Админ дашбоард
- `/admin/agents` - Агентуудын удирдлага
- `/admin/orders` - Бүх захиалга
- `/admin/stats` - Статистик

---

## 📝 Хөгжүүлэлтийн дараалал (Development Roadmap)

### 🔴 PHASE 1: Үндсэн суурь (1-2 долоо хоног)

#### Backend
- [x] MongoDB Models (User, Profile)
- [ ] Order Model үүсгэх
- [ ] Report Model үүсгэх
- [ ] Message Model үүсгэх
- [ ] Clerk Webhook хэрэгжүүлэх
- [ ] Authentication Middleware
- [ ] Role-based authorization middleware

#### Frontend
- [ ] Next.js Project эхлүүлэх
- [ ] Clerk Provider тохируулах
- [ ] Landing page (Хэрэглэгч/Агент товчлуур)
- [ ] Sign In/Sign Up pages
- [ ] Profile үүсгэх форм

---

### 🟠 PHASE 2: Захиалгын систем (1-2 долоо хоног)

#### Backend
- [ ] POST `/api/orders` - Захиалга үүсгэх
- [ ] GET `/api/orders` - Захиалгын жагсаалт (Role-based)
- [ ] GET `/api/orders/:id` - Захиалгын дэлгэрэнгүй
- [ ] PUT `/api/orders/:id/lock` - Захиалга түгжих
- [ ] PUT `/api/orders/:id/status` - Статус өөрчлөх

#### Frontend
- [ ] User Dashboard
- [ ] Захиалга үүсгэх форм
- [ ] Захиалгын жагсаалт (User view)
- [ ] Захиалгын дэлгэрэнгүй хуудас

---

### 🟡 PHASE 3: Агентийн функц (1 долоо хоног)

#### Backend
- [ ] Agent dashboard API (нээлттэй захиалгууд)
- [ ] POST `/api/orders/:id/reports` - Тайлан илгээх
- [ ] GET `/api/orders/:id/reports` - Тайлангууд авах
- [ ] File upload (зураг хавсаргах)

#### Frontend
- [ ] Agent Dashboard (нээлттэй захиалгууд)
- [ ] Захиалга түгжих товчлуур
- [ ] Тайлан илгээх форм
- [ ] Тайлан харах (User талаас)

---

### 🟢 PHASE 4: Чат систем (1 долоо хоног)

#### Backend
- [ ] POST `/api/orders/:id/messages` - Мессеж илгээх
- [ ] GET `/api/orders/:id/messages` - Чатын түүх
- [ ] PUT `/api/messages/:id/read` - Уншсан тэмдэглэх
- [ ] WebSocket эсвэл Socket.io (Real-time chat)

#### Frontend
- [ ] Chat компонент (Захиалгын хуудас дээр)
- [ ] Real-time мессеж харуулах
- [ ] Уншсан/уншаагүй тэмдэглэгээ
- [ ] Notification систем

---

### 🔵 PHASE 5: Админ систем (1 долоо хоног)

#### Backend
- [ ] GET `/api/admin/agents/pending` - Pending агентууд
- [ ] PUT `/api/admin/agents/:id/approve` - Агент зөвшөөрөх
- [ ] GET `/api/admin/orders` - Бүх захиалга
- [ ] GET `/api/admin/stats` - Статистик

#### Frontend
- [ ] Admin Dashboard
- [ ] Агент зөвшөөрөх хуудас
- [ ] Бүх захиалгын жагсаалт
- [ ] Статистик хуудас

---

### 🟣 PHASE 6: Сайжруулалт (1-2 долоо хоног)

- [ ] Email notifications (Resend эсвэл SendGrid)
- [ ] Push notifications
- [ ] File upload optimization (AWS S3 эсвэл Cloudinary)
- [ ] Search & Filter (захиалга хайх)
- [ ] Pagination
- [ ] Rate limiting
- [ ] Error logging (Sentry)
- [ ] Performance optimization
- [ ] Mobile responsive design
- [ ] Dark mode

---

## 🛠️ Технологийн сонголт

### Backend
- ✅ **Node.js + Express** - Web server
- ✅ **TypeScript** - Type safety
- ✅ **MongoDB + Mongoose** - Database
- ✅ **Clerk** - Authentication
- 🔲 **Socket.io** - Real-time chat
- 🔲 **Multer** - File uploads
- 🔲 **Sharp** - Image processing

### Frontend (Санал)
- 🔲 **Next.js 14/15** - React framework (App Router)
- 🔲 **TypeScript** - Type safety
- 🔲 **Tailwind CSS** - Styling
- 🔲 **Shadcn/ui** - UI components
- 🔲 **React Query (TanStack Query)** - Data fetching
- 🔲 **Zustand** - State management
- 🔲 **Socket.io-client** - Real-time

### DevOps
- 🔲 **Vercel** - Frontend hosting
- 🔲 **Railway/Render** - Backend hosting
- 🔲 **MongoDB Atlas** - Database
- 🔲 **Cloudinary** - File storage
- 🔲 **GitHub Actions** - CI/CD

---

## 🎯 Эхний ээлжинд хийх зүйлс (MVP)

### 1️⃣ Database Models бүрдүүлэх
- [x] User Model
- [x] Profile Model
- [ ] Order Model
- [ ] Report Model
- [ ] Message Model

### 2️⃣ Authentication суурь
- [ ] Clerk Webhook хэрэгжүүлэх
- [ ] Auth Middleware
- [ ] Role-based authorization

### 3️⃣ Захиалгын үндсэн CRUD
- [ ] Захиалга үүсгэх
- [ ] Захиалга харах
- [ ] Захиалга түгжих
- [ ] Статус өөрчлөх

### 4️⃣ Frontend суурь
- [ ] Landing page
- [ ] Sign up/Sign in
- [ ] User Dashboard
- [ ] Agent Dashboard (нээлттэй захиалгууд)

### 5️⃣ Тайлан систем
- [ ] Агент тайлан илгээх
- [ ] Хэрэглэгч тайлан харах

### 6️⃣ Чат (энгийн хувилбар)
- [ ] Text мессеж илгээх/хүлээн авах
- [ ] Чатын түүх харах

---

## 📊 Амжилтын хэмжүүр (Success Metrics)

- ✅ Хэрэглэгч профайл үүсгэж, захиалга үүсгэх
- ✅ Агент нээлттэй захиалга харж, түгжих
- ✅ Агент тайлан илгээх
- ✅ Хэрэглэгч тайлан харах
- ✅ Чат ажиллах
- ✅ Админ агент зөвшөөрөх

---

## 🚀 Дараагийн алхам

**Та одоо хаанаас эхлэхийг хүсэж байна?**

1. **Backend Models** - Order, Report, Message models үүсгэх
2. **Clerk Webhook** - Authentication суурийг бэхжүүлэх
3. **Order API** - Захиалгын CRUD endpoints
4. **Frontend Setup** - Next.js төсөл эхлүүлэх

---

**Төслийн хугацаа:** 6-8 долоо хоног (MVP)
**Багийн хэмжээ:** 1-2 хөгжүүлэгч

---

Хөгжүүлэлт амжилттай болсон! 🎉
