# BioStar Date Query API

A Node.js Express API that queries BioStar monthly tables based on date input with MySQL authentication.

## 🏗️ Architecture

```
├── db/
│   ├── connection.js     # MySQL connection
│   └── schema.sql        # Database schema
├── middleware/
│   ├── auth.js          # Header authentication
│   └── errorHandler.js  # Centralized error handling
├── routes/
│   └── biostar.js       # API routes
├── controllers/
│   └── biostarController.js  # Request handlers
├── services/
│   └── biostarService.js     # Business logic
├── server.js            # Express app
└── .env                 # Environment variables
```

## 🔧 Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment:**
```bash
# Update .env file
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=biostar
```

3. **Setup database:**
```bash
mysql -u root -p < db/schema.sql
```

4. **Start server:**
```bash
npm start
# or for development
npm run dev
```

## 📡 API Endpoints

### POST /api/biostar/data

**Headers:**
- `username`: MySQL username
- `password`: MySQL password

**Request Body:**
```json
{
  "date": "YYYY-MM-DD"
}
```

**Success Response (200):**
```json
{
  "status": "success",
  "date": "2026-02-15",
  "table": "T_LG202602",
  "data": [...]
}
```

**Error Response (401/400/500):**
```json
{
  "status": "error",
  "message": "Error description"
}
```

## 🗓️ Date → Table Mapping Logic

| Input Date | Year | Month | Table Name |
|------------|------|-------|------------|
| 2026-02-15 | 2026 | 02    | T_LG202602 |
| 2025-12-01 | 2025 | 12    | T_LG202512 |
| 2024-01-30 | 2024 | 01    | T_LG202401 |

**Logic:**
1. Parse date: `"2026-02-15"` → `Date object`
2. Extract: `year = 2026`, `month = 02`
3. Generate: `T_LG${year}${month}` → `T_LG202602`
4. Query: `SELECT * FROM T_LG202602 WHERE DATE(created_at) = '2026-02-15'`

## 🔒 Security Features

- Header-based authentication
- Prepared statements (SQL injection prevention)
- Input validation
- Error handling without data exposure

## 🧪 Testing

See `examples.md` for curl commands and Postman collection.