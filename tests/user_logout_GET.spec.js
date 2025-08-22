import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// -------------------- 1. GET -> No Content --------------------
test.describe('/user/logout - GET -> No Content', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/logout`, {
      headers: {
        'Accept': '*/*'
      }
    })
    const text = await response.text()
    console.log('200 GET->No Content:', text)
    expect(response.status()).toBe(200)
  })
})

// -------------------- 2. GET -> application/json --------------------
test.describe('/user/logout - GET -> application/json', () => {
  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/logout`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      }
    })
    const body = await response.json()
    console.log('Default GET->JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
    expect(typeof body.code).toBe('string')
    expect(typeof body.message).toBe('string')
  })
})