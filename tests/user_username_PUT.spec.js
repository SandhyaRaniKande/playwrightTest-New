import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const usernamePath = 'theUser'
const nonExistentUsernamePath = 'nonExistentUser123'

const updatedUserJson = {
  id: 10,
  username: 'updatedUser',
  firstName: 'UpdatedJohn',
  lastName: 'UpdatedJames',
  email: 'updated@email.com',
  password: 'newpassword',
  phone: '98765',
  userStatus: 2
}

const updatedUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>10</id>
  <username>updatedUser</username>
  <firstName>UpdatedJohn</firstName>
  <lastName>UpdatedJames</lastName>
  <email>updated@email.com</email>
  <password>newpassword</password>
  <phone>98765</phone>
  <userStatus>2</userStatus>
</User>`

const updatedUserFormUrlEncoded = new URLSearchParams({
  id: '10',
  username: 'updatedUser',
  firstName: 'UpdatedJohn',
  lastName: 'UpdatedJames',
  email: 'updated@email.com',
  password: 'newpassword',
  phone: '98765',
  userStatus: '2'
})

const invalidUserJson = {
  id: 'invalid',
  username: 'malformed',
  firstName: 123,
  email: 'bademail',
  password: '123',
  phone: '123',
  userStatus: 'notanint'
}

const invalidUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>invalid</id>
  <username>malformed</username>
  <firstName>123</firstName>
  <email>bademail</email>
  <password>123</password>
  <phone>123</phone>
  <userStatus>notanint</userStatus>
</User>`

const invalidUserFormUrlEncoded = new URLSearchParams({
  id: 'invalid',
  username: 'malformed',
  firstName: '123',
  email: 'bademail',
  password: '123',
  phone: '123',
  userStatus: 'notanint'
})

// -------------------- 1. JSON (Request) → JSON (Response) --------------------
test.describe('/user/{username} - PUT JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = updatedUserJson
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'updatedUser')
  })

  test('400 - Bad Request', async ({ request, baseURL }) => {
    const requestPayload = invalidUserJson
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    })
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const requestPayload = updatedUserJson
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${nonExistentUsernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    })
    console.log('404 JSON→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = { invalid: 'Unexpected' }
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. XML (Request) → JSON (Response) --------------------
test.describe('/user/{username} - PUT XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = updatedUserXml
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('200 XML→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'updatedUser')
  })

  test('400 - Bad Request', async ({ request, baseURL }) => {
    const requestPayload = invalidUserXml
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: requestPayload
    })
    console.log('400 XML→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const requestPayload = updatedUserXml
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${nonExistentUsernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: requestPayload
    })
    console.log('404 XML→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = `<Invalid><data/></Invalid>`
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Default XML→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 3. FORM (Request) → JSON (Response) --------------------
test.describe('/user/{username} - PUT FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = updatedUserFormUrlEncoded.toString()
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('200 FORM→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('username', 'updatedUser')
  })

  test('400 - Bad Request', async ({ request, baseURL }) => {
    const requestPayload = invalidUserFormUrlEncoded.toString()
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: requestPayload
    })
    console.log('400 FORM→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    const requestPayload = updatedUserFormUrlEncoded.toString()
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${nonExistentUsernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: requestPayload
    })
    console.log('404 FORM→JSON:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = new URLSearchParams({ invalid: 'Unexpected' }).toString()
    console.log('Request Payload:', requestPayload)
    const response = await request.put(`${baseURL}/user/${usernamePath}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Default FORM→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})
