import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const testUsername = 'testUser'
const nonExistentUsername = 'nonExistentUser123'

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

const updatedUserJson = {
  id: 10,
  username: 'updatedUser',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@email.com',
  password: 'newPassword',
  phone: '54321',
  userStatus: 2
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
</User>`

const updatedUserXml = `<?xml version="1.0" encoding="UTF-8"?>
<User>
  <id>10</id>
  <username>updatedUser</username>
  <firstName>Jane</firstName>
  <lastName>Doe</lastName>
  <email>jane.doe@email.com</email>
  <password>newPassword</password>
  <phone>54321</phone>
  <userStatus>2</userStatus>
</User>`

const exampleUserForm = new URLSearchParams({
  id: '10',
  username: 'theUser',
  firstName: 'John',
  lastName: 'James',
  email: 'john@email.com',
  password: '12345',
  phone: '12345',
  userStatus: '1'
})

const updatedUserForm = new URLSearchParams({
  id: '10',
  username: 'updatedUser',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@email.com',
  password: 'newPassword',
  phone: '54321',
  userStatus: '2'
})

const invalidJson = { wrongField: 'wrongValue' }
const invalidXml = `<Invalid><Data/></Invalid>`
const invalidForm = new URLSearchParams({ wrong: 'data' })

// -------------------- 1. JSON Request --------------------
test.describe('/user/{username} - PUT JSON Request', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    console.log('Request Payload:', updatedUserJson)
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: updatedUserJson
    })
    console.log('200 JSON Response:', await response.text())
    expect(response.status()).toBe(200)
  })

  test('400 - Bad request', async ({ request, baseURL }) => {
    console.log('Request Payload:', invalidJson)
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: invalidJson
    })
    console.log('400 JSON Response:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    console.log('Request Payload:', updatedUserJson)
    const response = await request.put(`${baseURL}/user/${nonExistentUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: updatedUserJson
    })
    console.log('404 JSON Response:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    console.log('Request Payload:', invalidJson)
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: invalidJson
    })
    const body = await response.json()
    console.log('Default JSON Response:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. XML Request --------------------
test.describe('/user/{username} - PUT XML Request', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    console.log('Request Payload:', updatedUserXml)
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: updatedUserXml
    })
    console.log('200 XML Response:', await response.text())
    expect(response.status()).toBe(200)
  })

  test('400 - Bad request', async ({ request, baseURL }) => {
    console.log('Request Payload:', invalidXml)
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: invalidXml
    })
    console.log('400 XML Response:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    console.log('Request Payload:', updatedUserXml)
    const response = await request.put(`${baseURL}/user/${nonExistentUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: updatedUserXml
    })
    console.log('404 XML Response:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    console.log('Request Payload:', invalidXml)
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: invalidXml
    })
    const body = await response.json()
    console.log('Default XML Response:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 3. FORM Request --------------------
test.describe('/user/{username} - PUT FORM Request', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    console.log('Request Payload:', updatedUserForm.toString())
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: updatedUserForm.toString()
    })
    console.log('200 FORM Response:', await response.text())
    expect(response.status()).toBe(200)
  })

  test('400 - Bad request', async ({ request, baseURL }) => {
    console.log('Request Payload:', invalidForm.toString())
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: invalidForm.toString()
    })
    console.log('400 FORM Response:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('404 - User not found', async ({ request, baseURL }) => {
    console.log('Request Payload:', updatedUserForm.toString())
    const response = await request.put(`${baseURL}/user/${nonExistentUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: updatedUserForm.toString()
    })
    console.log('404 FORM Response:', await response.text())
    expect(response.status()).toBe(404)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    console.log('Request Payload:', invalidForm.toString())
    const response = await request.put(`${baseURL}/user/${testUsername}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: invalidForm.toString()
    })
    const body = await response.json()
    console.log('Default FORM Response:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})