import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


// -------------------- 1. DELETE /user/{username} → No Body / Text --------------------
test.describe('/user/{username} - DELETE → No Body / Text', () => {
  test('200 - User deleted', async ({ request, baseURL }) => {
    const username = 'userToDelete123'
    const response = await request.delete(`${baseURL}/user/${username}`)
    const text = await response.text()
    console.log(`200 DELETE /user/${username} → No Body / Text:`, text)
    expect(response.status()).toBe(200)
  })

  test('400 - Invalid username supplied', async ({ request, baseURL }) => {
    const username = 'invalid!user@name'
    const response = await request.delete(`${baseURL}/user/${username}`)
    const text = await response.text()
    console.log(`400 DELETE /user/${username} → No Body / Text:`, text)
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const username = 'nonExistentUser987'
    const response = await request.delete(`${baseURL}/user/${username}`)
    const text = await response.text()
    console.log(`404 DELETE /user/${username} → No Body / Text:`, text)
    expect(response.status()).toBe(404)
  })
})

// -------------------- 2. DELETE /user/{username} → JSON (for default error) --------------------
test.describe('/user/{username} - DELETE → JSON', () => {
  test('default - Unexpected error', async ({ request, baseURL }) => {
    const username = 'userForDefaultError'
    const response = await request.delete(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      }
    })
    const body = await response.json()
    console.log(`Default DELETE /user/${username} → JSON:`, body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
    expect(typeof body.code).toBe('string')
    expect(typeof body.message).toBe('string')
  })
})
