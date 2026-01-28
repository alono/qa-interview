# Part 1 - Test Design Solution

## Test Cases for POST /api/login

### Positive Cases

| # | Description | Input | Expected Result |
|---|-------------|-------|-----------------|
| 1 | Valid login with correct credentials | `{"email": "user@example.com", "password": "Password123!"}` | 200 OK, response contains `{"token": "<jwt>"}` |

### Negative Cases

| # | Description | Input | Expected Result |
|---|-------------|-------|-----------------|
| 2 | Wrong password | `{"email": "user@example.com", "password": "wrongpassword"}` | 401 Unauthorized |
| 3 | Non-existent user | `{"email": "nobody@example.com", "password": "Password123!"}` | 401 Unauthorized |
| 4 | Missing email field | `{"password": "Password123!"}` | 400 Bad Request |
| 5 | Missing password field | `{"email": "user@example.com"}` | 400 Bad Request |
| 6 | Invalid email format | `{"email": "notanemail", "password": "Password123!"}` | 400 Bad Request |

### Edge Cases

| # | Description | Input | Expected Result |
|---|-------------|-------|-----------------|
| 7 | Empty email string | `{"email": "", "password": "Password123!"}` | 400 Bad Request |
| 8 | Empty password string | `{"email": "user@example.com", "password": ""}` | 400 Bad Request |
| 9 | Both fields missing | `{}` | 400 Bad Request |
| 10 | Email with only whitespace | `{"email": "   ", "password": "Password123!"}` | 400 Bad Request |
| 11 | Case sensitivity - uppercase email | `{"email": "USER@EXAMPLE.COM", "password": "Password123!"}` | 401 Unauthorized (emails are case-sensitive) |
| 12 | Malformed JSON body | `{email: user@example.com}` | 400 Bad Request |
| 13 | SQL injection in email | `{"email": "' OR '1'='1", "password": "test"}` | 400 Bad Request (invalid email format) |
| 14 | Null values | `{"email": null, "password": null}` | 400 Bad Request |
| 15 | Wrong data types | `{"email": 12345, "password": true}` | 400 Bad Request |

### Additional Considerations

- **Security:** Verify error messages don't reveal whether email exists (both wrong email and wrong password should return same generic message)
- **Token validation:** Verify returned JWT is valid and contains expected claims
- **Response time:** Login should respond within acceptable time limits
- **Rate limiting:** Multiple failed attempts should be handled appropriately (if implemented)
