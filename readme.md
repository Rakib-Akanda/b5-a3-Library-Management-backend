
## Getting Started

### Prerequisites

- Node.js
- MongoDB instance (local or cloud)

# Library Management API

A simple RESTful API for managing books and borrow records.

 **Base URL**: `/api`

> All responses are JSON and follow the shape:
>
> ```json
> {
>   "success": true | false,
>   "message": "human‑readable status message",
>   "data": <payload or null>
> }
> ```

---

##  Books

| Method & Path               | Purpose                                                   |
| --------------------------- | --------------------------------------------------------- |
| **POST** `/books`           | Create a new book                                         |
| **GET** `/books`            | List books (supports `filter`, `sortBy`, `sort`, `limit`) |
| **GET** `/books/:bookId`    | Get one book by ID                                        |
| **PATCH** `/books/:bookId`  | Update a book (increment `copies` or edit fields)         |
| **DELETE** `/books/:bookId` | Remove a book                                             |

### 1. Create a Book

```
POST /api/books
Content‑Type: application/json
```

```json
{
  "title": "1984",
  "author": "George Orwell",
  "genre": "FICTION",
  "isbn": "9780451524935",
  "description": "Dystopian classic",
  "copies": 10
}
```

**Success 201** → `data` holds the created book.

### 2. List Books

```
GET /api/books?filter=SCIENCE&sortBy=title&sort=asc&limit=5
```

| Query    | Meaning           | Default     |
| -------- | ----------------- | ----------- |
| `filter` | Filter by `genre` |  none       |
| `sortBy` | Field to sort on  | `createdAt` |
| `sort`   | `asc` or `desc`   | `desc`      |
| `limit`  | Max docs returned | `10`        |

### 3. Get One Book

```
GET /api/books/60fa…
```

Returns 404 if not found.

### 4. Update a Book

```
PATCH /api/books/:bookId
```

Body may contain **any** editable field. Special rule:

- If you include `copies` (number) it **adds** that number to current stock.

```json
{
  "copies": 3,           // adds 3 more copies
  "title": "1984 – 2nd Ed."
}
```

### 5. Delete a Book

```
DELETE /api/books/:bookId
```

Returns 404 if the book is missing.

---

###  Borrow

| Method & Path      | Purpose                        |
| ------------------ | ------------------------------ |
| **POST** `/borrow` | Borrow a book & decrease stock |
| **GET**  `/borrow` | Aggregate summary of borrows   |

### 1. Borrow a Book

```
POST /api/borrow
Content‑Type: application/json
```

```json
{
  "book": "60fa…",    // Book ObjectId
  "quantity": 2,
  "dueDate": "2025-07-20T01:00:00.000Z"
}
```

- Borrow fails if `copies` in stock are insufficient.

### 2. Borrow Summary

```
GET /api/borrow
```

Returns an array like:

```json
[
  {
    "book": {
      "title": "1984",
      "isbn": "9780451524935"
    },
    "totalQuantity": 3
  }
  ...
]
```

---

### Error Handling

- Validation errors → **400** with details.
- Duplicate ISBN → **409**.
- Not found → **404**.
- Unhandled server errors → **500**.

---

### Run Locally (dev)

```bash
npm install
npm run dev   # ts‑node‑dev
```

Happy coding!

