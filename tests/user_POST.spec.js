import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const exampleUserJson = {
  id: 1,
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: 1
}

const exampleUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>1</id>
  <username>theUser</username>
  <firstName>John</firstName>
  <lastName>James</lastName>
  <email>john@email.com</email>
  <password>12345</password>
  <phone>12345</phone>
  <userStatus>1</userStatus>
</User>`;

const exampleUserForm = new URLSearchParams({
  id: '1',
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: '1'
});

const invalidUserJson = { invalid: 'payload' };
const invalidUserXml = ` < invalid > < data / > < / invalid > `;
const invalidUserForm = new URLSearchParams({ invalid: 'payload' });


// -------------------- 1. JSON Request → JSON Response --------------------
test.describe('/user - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (200 JSON→JSON):', requestPayload);
    console.log('Response Body (200 JSON→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserJson;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (Default JSON→JSON):', requestPayload);
    console.log('Response Body (Default JSON→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON Request → XML Response --------------------
test.describe('/user - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('Request Payload (200 JSON→XML):', requestPayload);
    console.log('Response Body (200 JSON→XML):', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserJson;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    console.log('Request Payload (Default JSON→XML):', requestPayload);
    console.log('Response Body (Default JSON→XML):', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 3. XML Request → JSON Response --------------------
test.describe('/user - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (200 XML→JSON):', requestPayload);
    console.log('Response Body (200 XML→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserXml;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (Default XML→JSON):', requestPayload);
    console.log('Response Body (Default XML→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML Request → XML Response --------------------
test.describe('/user - POST XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('Request Payload (200 XML→XML):', requestPayload);
    console.log('Response Body (200 XML→XML):', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserXml;
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    console.log('Request Payload (Default XML→XML):', requestPayload);
    console.log('Response Body (Default XML→XML):', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 5. FORM Request → JSON Response --------------------
test.describe('/user - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserForm.toString();
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (200 FORM→JSON):', requestPayload);
    console.log('Response Body (200 FORM→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserForm.toString();
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    const body = await response.json()
    console.log('Request Payload (Default FORM→JSON):', requestPayload);
    console.log('Response Body (Default FORM→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM Request → XML Response --------------------
test.describe('/user - POST FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserForm.toString();
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })

    const text = await response.text()
    console.log('Request Payload (200 FORM→XML):', requestPayload);
    console.log('Response Body (200 FORM→XML):', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = invalidUserForm.toString();
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })

    console.log('Request Payload (Default FORM→XML):', requestPayload);
    console.log('Response Body (Default FORM→XML):', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})
