import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const exampleUserListJson = [
  {
    id: 10,
    username: 'theUser',
    firstName: 'John',
    lastName: 'James',
    email: 'john@email.com',
    password: '12345',
    phone: '12345',
    userStatus: 1
  },
  {
    id: 11,
    username: 'anotherUser',
    firstName: 'Jane',
    lastName: 'Doe',
    email: 'jane@email.com',
    password: '67890',
    phone: '67890',
    userStatus: 2
  }
]

const invalidUserListJson = [
  {
    username: '',
    firstName: 'Invalid',
    email: 'bad-email',
    password: '1'
  }
]

const defaultErrorPayload = [{ invalid: 'payload' }]

// -------------------- 1. application/json → application/json --------------------
test.describe('/user/createWithList - POST application/json → application/json', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: exampleUserListJson
    })

    const body = await response.json()
    console.log('200 JSON→JSON:', body)
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
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: defaultErrorPayload
    })

    const body = await response.json()
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. application/json → application/xml --------------------
test.describe('/user/createWithList - POST application/json → application/xml', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: exampleUserListJson
    })

    const text = await response.text()
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