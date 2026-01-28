# QA Automation Engineer - Technical Assessment

**Time:** 30-45 minutes
**Role:** QA Automation Engineer
**Focus:** Test design + automation implementation

---

## Part 1 - Test Design (10-15 minutes)

Write at least **6 test cases** for the `/api/login` endpoint.

Include:
- Positive case(s)
- Negative case(s)
- Edge case(s)

For each test case, provide:
- Short description
- Input
- Expected result

You can write this as a list, table, or plain text.

---

## Part 2 - Automation Task (15-25 minutes)

Implement **2-3 automated tests** for the login functionality using any language and framework you are comfortable with.

**Options:**
- **API tests:** Use tools like RestAssured, Jest, pytest, Supertest, etc.
- **UI tests:** Use Playwright, Cypress, Selenium, etc.

**Requirements:**
- Clear test name(s)
- Assertions on status code/response body (API) or UI elements (UI)
- Code readability over completeness

Pseudocode is acceptable if you run out of time, but real code is preferred.

---

## Part 3 - Short Questions (5 minutes)

Answer briefly:

1. How would you structure this test suite if it grows to 100+ tests?
2. What would you automate here, and what would you leave for manual testing?
3. How would you integrate these tests into a CI pipeline?

---
---

# Application Reference

## Setup

```bash
npm install
npm start
```

The server runs on `http://localhost:3000` by default (configurable via `PORT` environment variable).

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /` | Login UI (web page) |
| `POST /api/login` | Login API |
| `GET /health` | Health check |

## Test Credentials

```
Email: user@example.com
Password: Password123!
```

---

## UI Specification

The login page at `http://localhost:3000` contains:

| Element | Selector | Description |
|---------|----------|-------------|
| Login form | `[data-testid="login-form"]` | The main form element |
| Email input | `[data-testid="email-input"]` | Email text field |
| Password input | `[data-testid="password-input"]` | Password field |
| Submit button | `[data-testid="submit-button"]` | Login button |
| Error message | `[data-testid="error-message"]` | Displays validation/auth errors |
| Welcome container | `[data-testid="welcome-container"]` | Shown after successful login |
| Welcome message | `[data-testid="welcome-message"]` | Success message text |
| Logout button | `[data-testid="logout-button"]` | Returns to login form |

### UI Behavior

- **Successful login**: Form hides, welcome screen appears
- **Failed login**: Error message displays below the title
- **Empty fields**: Client-side validation shows error
- **Logout**: Clears token from localStorage, shows login form

---

## API Specification

### POST /api/login

Authenticates a user and returns a JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Responses:**

| Status | Description | Response Body |
|--------|-------------|---------------|
| 200 | Success | `{ "token": "<jwt>" }` |
| 400 | Bad Request (missing/invalid fields) | `{ "error": "Bad Request", "message": "<details>" }` |
| 401 | Unauthorized (invalid credentials) | `{ "error": "Unauthorized", "message": "Invalid credentials" }` |

### GET /health

Health check endpoint.

**Response:** `{ "status": "ok" }`

---

## Example API Usage

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "Password123!"}'
```
# qa-interview
