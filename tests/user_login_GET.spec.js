import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const validLoginParams = {
  username: 'testuser',
  password: 'password123'
}

const invalidLoginParams = {
  username: 'invaliduser',
  password: 'wrongpassword'
}

const missingLoginParams = {
  username: 'missingpass'
}

const forceErrorLoginParams = {
  username: 'erroruser',
  password: 'errorpassword'
}

// -------------------- GET /user/login → JSON --------------------
test.describe('/user/login - GET → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json'
      },
      params: validLoginParams
    })

    const body = await response.text()
    console.log('200 GET→JSON:', body)
    expect(response.status()).toBe(200)
    expect(typeof body).toBe('string')
    expect(body).not.toBe('')
  })

  test('400 - Invalid username/password supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json'
      },
      params: invalidLoginParams
    })
    console.log('400 GET→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      },
      params: forceErrorLoginParams
    })

    const body = await response.json()
    console.log('Default GET→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- GET /user/login → XML --------------------
test.describe('/user/login - GET → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: validLoginParams
    })

    const text = await response.text()
    console.log('200 GET→XML:', text)
    expect(response.status()).toBe(200)
    expect(typeof text).toBe('string')
    expect(text).not.toBe('')
  })

  test('400 - Invalid username/password supplied', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml'
      },
      params: invalidLoginParams
    })
    console.log('400 GET→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/login`, {
      headers: {
        'Accept': 'application/xml',
        'X-Force-Error': 'true'
      },
      params: forceErrorLoginParams
    })
    console.log('Default GET→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})