import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const validUsername = 'user1' // As suggested by the spec
const invalidUsername400 = 'user!@#$' // Example to trigger 400
const nonExistentUsername404 = 'nonExistentUser12345' // Example to trigger 404

// -------------------- 1. GET → JSON --------------------
test.describe('/user/{username} - GET → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const username = validUsername
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json'
      }
    })

    const body = await response.json()
    console.log('200 GET → JSON:', body)
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
    const username = invalidUsername400
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('400 GET → JSON:', await response.text())
    expect(response.status()).toBe(400)
    expect(await response.text()).toContain('Invalid username supplied')
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const username = nonExistentUsername404
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json'
      }
    })
    console.log('404 GET → JSON:', await response.text())
    expect(response.status()).toBe(404)
    expect(await response.text()).toContain('User not found')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const username = validUsername
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/json',
        'X-Force-Error': 'true'
      }
    })

    const body = await response.json()
    console.log('Default GET → JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. GET → XML --------------------
test.describe('/user/{username} - GET → XML', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const username = validUsername
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/xml'
      }
    })

    const text = await response.text()
    console.log('200 GET → XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<User>')
    expect(text).toContain('<id>')
    expect(text).toContain('<username>')
    expect(text).toContain('<firstName>')
    expect(text).toContain('<lastName>')
    expect(text).toContain('<email>')
    expect(text).toContain('<password>')
    expect(text).toContain('<phone>')
    expect(text).toContain('<userStatus>')
  })

  test('400 - Invalid username supplied', async ({ request, baseURL }) => {
    const username = invalidUsername400
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/xml'
      }
    })
    console.log('400 GET → XML:', await response.text())
    expect(response.status()).toBe(400)
    expect(await response.text()).toContain('Invalid username supplied')
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const username = nonExistentUsername404
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/xml'
      }
    })
    console.log('404 GET → XML:', await response.text())
    expect(response.status()).toBe(404)
    expect(await response.text()).toContain('User not found')
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const username = validUsername
    const response = await request.get(`${baseURL}/user/${username}`, {
      headers: {
        'Accept': 'application/xml',
        'X-Force-Error': 'true'
      }
    })
    const text = await response.text()
    console.log('Default GET → XML:', text)
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})
