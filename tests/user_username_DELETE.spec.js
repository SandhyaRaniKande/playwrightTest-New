import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


// -------------------- 1. No Request Body → No/Plain Text Response --------------------
test.describe('/user/{username} - DELETE (No Request Body → No/Plain Text Response)', () => {
  const usernameSuccess = 'testUserToDelete'
  const usernameInvalid = ''
  const usernameNotFound = 'nonExistentUser123'

  test('200 - User deleted', async ({ request, baseURL }) => {
    const response = await request.delete(`${baseURL}/user/${usernameSuccess}`)
    const text = await response.text()
    console.log(`200 NoBody→Text: Requesting DELETE ${baseURL}/user/${usernameSuccess}`)
    console.log('200 NoBody→Text:', text)
    expect(response.status()).toBe(200)
  })

  test('400 - Invalid username supplied', async ({ request, baseURL }) => {
    const response = await request.delete(`${baseURL}/user/${usernameInvalid}`)
    const text = await response.text()
    console.log(`400 NoBody→Text: Requesting DELETE ${baseURL}/user/${usernameInvalid}`)
    console.log('400 NoBody→Text:', text)
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const response = await request.delete(`${baseURL}/user/${usernameNotFound}`)
    const text = await response.text()
    console.log(`404 NoBody→Text: Requesting DELETE ${baseURL}/user/${usernameNotFound}`)
    console.log('404 NoBody→Text:', text)
    expect(response.status()).toBe(404)
  })
})

// -------------------- 2. No Request Body → application/json Response --------------------
test.describe('/user/{username} - DELETE (No Request Body → application/json Response)', () => {
  const usernameForDefaultError = 'userForDefaultError'

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.delete(`${baseURL}/user/${usernameForDefaultError}`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      }
    })
    const body = await response.json()
    console.log(`Default NoBody→JSON: Requesting DELETE ${baseURL}/user/${usernameForDefaultError}`)
    console.log('Default NoBody→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})