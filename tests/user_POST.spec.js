import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const exampleUserJson = {
  id: 10,
  username: 'theuser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: 1
}

const exampleUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>10</id>
  <username>theUser</username>
  <firstName>John</firstName>
  <lastName>James</lastName>
  <email>john@email.com</email>
  <password>12345</password>
  <phone>12345</phone>
  <userStatus>1</userStatus>
</User>`;

const formUrlEncodedUser = new URLSearchParams({
  id: '10',
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: '1'
})

const badUserJson = { invalidField: 'someValue' }
const badUserXml = `<InvalidUser><data/></InvalidUser>`
const badFormUser = new URLSearchParams({ wrong: 'data' })

// -------------------- 1. JSON → JSON --------------------
test.describe('/user - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', 10)
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = badUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON → XML --------------------
test.describe('/user - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserJson
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload:', requestPayload)
    console.log('200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<id>10</id>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
    expect(text).toContain('<password>12345</password>')
    expect(text).toContain('<phone>12345</phone>')
    expect(text).toContain('<userStatus>1</userStatus>')
  })
})

// -------------------- 3. XML → JSON --------------------
test.describe('/user - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('200 XML→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', 10)
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = badUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('Default XML→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML → XML --------------------
test.describe('/user - POST XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleUserXml
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload:', requestPayload)
    console.log('200 XML→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<id>10</id>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
    expect(text).toContain('<password>12345</password>')
    expect(text).toContain('<phone>12345</phone>')
    expect(text).toContain('<userStatus>1</userStatus>')
  })
})

// -------------------- 5. FORM → JSON --------------------
test.describe('/user - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('200 FORM→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id', 10)
    expect(body).toHaveProperty('username', 'theUser')
    expect(body).toHaveProperty('firstName', 'John')
    expect(body).toHaveProperty('lastName', 'James')
    expect(body).toHaveProperty('email', 'john@email.com')
    expect(body).toHaveProperty('password', '12345')
    expect(body).toHaveProperty('phone', '12345')
    expect(body).toHaveProperty('userStatus', 1)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = badFormUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Request Payload:', requestPayload)
    console.log('Default FORM→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM → XML --------------------
test.describe('/user - POST FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedUser.toString()
    const response = await request.post(`${baseURL}/user`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const text = await response.text()
    console.log('Request Payload:', requestPayload)
    console.log('200 FORM→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<id>10</id>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
    expect(text).toContain('<email>john@email.com</email>')
    expect(text).toContain('<password>12345</password>')
    expect(text).toContain('<phone>12345</phone>')
    expect(text).toContain('<userStatus>1</userStatus>')
  })
})
