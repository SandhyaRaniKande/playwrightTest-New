# Swagger Petstore - OpenAPI 3.0

This is a sample Pet Store Server based on the OpenAPI 3.0 specification.  You can find out more about
Swagger at [https://swagger.io](https://swagger.io). In the third iteration of the pet store, we've switched to the design first approach!
You can now help us improve the API whether it's by making changes to the definition itself or to the code.
That way, with time, we can improve the API in general, and expose some of the new features in OAS3.

Some useful links:
- [The Pet Store repository](https://github.com/swagger-api/swagger-petstore)
- [The source API definition for the Pet Store](https://github.com/swagger-api/swagger-petstore/blob/master/src/main/resources/openapi.yaml)

## 📌 API Overview
- **Version:** 1.0.12
- **Base URLs:** https://petstore3.swagger.io/api/v3

## 🚀 Endpoints
- `PUT /pet` → Update an existing pet.
- `POST /pet` → Add a new pet to the store.
- `GET /store/inventory` → Returns pet inventories by status.
- `POST /store/order` → Place an order for a pet.
- `POST /user` → Create user.
- `POST /user/createWithList` → Creates list of users with given input array.
- `GET /user/login` → Logs user into the system.
- `GET /user/logout` → Logs out current logged in user session.
- `GET /user/{username}` → Get user by user name.
- `PUT /user/{username}` → Update user resource.
- `DELETE /user/{username}` → Delete user resource.

---

## 🔑 Authentication
- petstore_auth: oauth2 ()
- api_key: apiKey (header)

---

## ⚙️ Content Types
- **Requests:** application/json, application/xml, application/x-www-form-urlencoded
- **Responses:** application/json, application/xml

---
## 📂Playwright Project Structure

.github/workflows/playwright.yml
allure-report/
allure-results/
node_modules/
test-results/
tests/
  ├── pet_findByStatus_GET.spec.js
  ├── pet_findByTags_GET.spec.js
  ├── pet_petId_DELETE.spec.js
  ├── pet_petId_GET.spec.js
  ├── pet_petId_POST.spec.js
 
.env
.gitignore
auth.json
global-setup.js
package.json
package-lock.json
playwright.config.js
README.md



## 🧪 How to Test (with Playwright)

Playwright tests can be auto-generated to cover:
- Each path and method
- All request/response content-type combinations (json/xml)
- Valid and invalid payloads

Run tests:
```bash
npx playwright test

npx allure generate ./allure-results --clean -o ./allure-report
npx allure open ./allure-report


