import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// -------------------- 1. GET → 200 Empty/Text --------------------
test.describe('/user/logout - GET → 200 Empty/Text', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/logout`)
    const text = await response.text()
    console.log('200 GET→Empty/Text:', text)
    expect(response.status()).toBe(200)
    expect(text).toBe('')
  })
})

// -------------------- 2. GET → Default JSON --------------------
test.describe('/user/logout - GET → Default JSON', () => {
  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.get(`${baseURL}/user/logout`, {
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