# BioStar API Examples

## 1. Health Check
```bash
curl -X GET http://localhost:5000/health
```

## 2. Get Data by Date (Success)
```bash
curl -X POST http://localhost:5000/api/biostar/data \
  -H "Content-Type: application/json" \
  -H "username: admin" \
  -H "password: admin123" \
  -d '{"date": "2026-02-15"}'
```

## 3. Invalid Credentials (401)
```bash
curl -X POST http://localhost:5000/api/biostar/data \
  -H "Content-Type: application/json" \
  -H "username: invalid" \
  -H "password: wrong" \
  -d '{"date": "2026-02-15"}'
```

## 4. Missing Headers (401)
```bash
curl -X POST http://localhost:5000/api/biostar/data \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-02-15"}'
```

## 5. Invalid Date Format (400)
```bash
curl -X POST http://localhost:5000/api/biostar/data \
  -H "Content-Type: application/json" \
  -H "username: admin" \
  -H "password: admin123" \
  -d '{"date": "invalid-date"}'
```

## Postman Collection
```json
{
  "info": {
    "name": "BioStar API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get Data by Date",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "username",
            "value": "admin"
          },
          {
            "key": "password",
            "value": "admin123"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"date\": \"2026-02-15\"}"
        },
        "url": {
          "raw": "http://localhost:5000/api/biostar/data",
          "protocol": "http",
          "host": ["localhost"],
          "port": "5000",
          "path": ["api", "biostar", "data"]
        }
      }
    }
  ]
}
```