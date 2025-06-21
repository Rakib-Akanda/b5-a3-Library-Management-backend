
## Getting Started

### Prerequisites

- Node.js
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository.
2. Install dependencies:

### API Endpoints

## Books

- POST /api/books — Create a new book
- GET /api/books — Get all books (supports filter, sort, limit)
- GET /api/books/:bookId — Get a single book by ID
- PATCH /api/books/:bookId — Update a book (increment copies or update fields)
- DELETE /api/books/:bookId — Delete a book
- Borrow
- POST /api/borrow — Borrow a book (decreases available copies)
- GET /api/borrow — Get summary of borrowed books