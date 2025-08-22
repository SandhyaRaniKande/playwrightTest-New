import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const exampleUserJson = {
  id: 10,
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
  <id>10</id>
  <username>theUser</username>
  <firstName>John</firstName>
  <lastName>James</lastName>
  <email>john@email.com</email>
  <password>12345</password>
  <phone>12345</phone>
  <userStatus>1</userStatus>
</User>`;

// -------------------- 1. GET → JSON --------------------
test.describe('/user/{username} - GET → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const username = 'user1'
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    const body = await response.json()
    console.log('200 GET→JSON:', body)
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

  test('400 - Invalid username supplied', async ({ request, baseURL }) => {
    const username = ' '
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('400 GET→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const username = 'nonExistentUser'
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('404 GET→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const username = 'user1'
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      }
    })

    const body = await response.json()
    console.log('Default GET→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. GET → XML --------------------
test.describe('/user/{username} - GET → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const username = 'user1'
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/xml'
      }
    })
    const text = await response.text()
    console.log('200 GET→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<username>theUser</username>')
    expect(text).toContain('<firstName>John</firstName>')
  })

  test('400 - Invalid username supplied', async ({ request, baseURL }) => {
    const username = ' '
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/xml'
      }
    })
    console.log('400 GET→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const username = 'nonExistentUser'
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/xml'
      }
    })
    console.log('404 GET→XML:', await response.text())
    expect(response.status()).toBe(404)
  })
})