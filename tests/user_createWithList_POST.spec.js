import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const exampleUsersListJson = [
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
    password: 'abcde',
    phone: '54321',
    userStatus: 2
  }
]

// -------------------- 1. JSON → JSON --------------------
test.describe('/user/createWithList - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: exampleUsersListJson
    })

    const body = await response.json()
    console.log('Request Payload:', JSON.stringify(exampleUsersListJson, null, 2))
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username')
    expect(body).toHaveProperty('firstName')
    expect(body).toHaveProperty('lastName')
    expect(body).toHaveProperty('email')
    expect(body).toHaveProperty('password')
    expect(body).toHaveProperty('phone')
    expect(body).toHaveProperty('userStatus')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const invalidPayload = {}
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: invalidPayload
    })

    const body = await response.json()
    console.log('Request Payload:', JSON.stringify(invalidPayload, null, 2))
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON → XML --------------------
test.describe('/user/createWithList - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: exampleUsersListJson
    })

    const text = await response.text()
    console.log('Request Payload:', JSON.stringify(exampleUsersListJson, null, 2))
    console.log('200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
    expect(text).toContain('<lastName>James</lastName>')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const invalidPayload = []
    const response = await request.post(`${baseURL}/user/createWithList`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: invalidPayload
    })

    const text = await response.text()
    console.log('Request Payload:', JSON.stringify(invalidPayload, null, 2))
    console.log('Default JSON→XML:', text)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(text).toContain('<code>')
    expect(text).toContain('<message>')
  })
})