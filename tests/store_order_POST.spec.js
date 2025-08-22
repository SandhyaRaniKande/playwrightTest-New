import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const exampleOrderJson = {
  id: 10,
  petId: 198772,
  quantity: 7,
  shipDate: new Date().toISOString(),
  status: 'approved',
  complete: true
}

const exampleOrderXml = `<?xml version="1.0" encoding="UTF-8"?>
<order>
  <id>10</id>
  <petId>198772</petId>
  <quantity>7</quantity>
  <shipDate>${new Date().toISOString()}</shipDate>
  <status>approved</status>
  <complete>true</complete>
</order>`;

const formUrlEncodedOrder = new URLSearchParams({
  id: '10',
  petId: '198772',
  quantity: '7',
  shipDate: new Date().toISOString(),
  status: 'approved',
  complete: 'true'
})

const invalidJsonFor400 = { id: 'not-an-id' }
const invalidJsonFor422 = { status: 'invalidStatus' }

const invalidXmlFor400 = `<order><id>not-an-id</id></order>`
const invalidXmlFor422 = `<order><status>invalidStatus</status></order>`

const invalidFormFor400 = new URLSearchParams({ id: 'not-an-id' })
const invalidFormFor422 = new URLSearchParams({ status: 'invalidStatus' })

const defaultErrorJsonPayload = { invalid: 'payload' }
const defaultErrorXmlPayload = `<invalid>payload</invalid>`
const defaultErrorFormPayload = new URLSearchParams({ invalid: 'payload' })


// -------------------- 1. JSON (Request) → JSON (Response) --------------------
test.describe('/store/order - POST JSON → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleOrderJson
    console.log('Request Payload (200 JSON→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Response Body (200 JSON→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('petId', exampleOrderJson.petId)
    expect(body).toHaveProperty('quantity', exampleOrderJson.quantity)
    expect(body).toHaveProperty('status', exampleOrderJson.status)
    expect(body).toHaveProperty('complete', exampleOrderJson.complete)
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidJsonFor400
    console.log('Request Payload (400 JSON→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    console.log('Response Body (400 JSON→JSON):', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = invalidJsonFor422
    console.log('Request Payload (422 JSON→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    })
    console.log('Response Body (422 JSON→JSON):', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorJsonPayload
    console.log('Request Payload (Default JSON→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Response Body (Default JSON→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. XML (Request) → JSON (Response) --------------------
test.describe('/store/order - POST XML → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleOrderXml
    console.log('Request Payload (200 XML→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Response Body (200 XML→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('petId', exampleOrderJson.petId)
    expect(body).toHaveProperty('quantity', exampleOrderJson.quantity)
    expect(body).toHaveProperty('status', exampleOrderJson.status)
    expect(body).toHaveProperty('complete', exampleOrderJson.complete)
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidXmlFor400
    console.log('Request Payload (400 XML→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    console.log('Response Body (400 XML→JSON):', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = invalidXmlFor422
    console.log('Request Payload (422 XML→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    })
    console.log('Response Body (422 XML→JSON):', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorXmlPayload
    console.log('Request Payload (Default XML→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Response Body (Default XML→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 3. FORM (Request) → JSON (Response) --------------------
test.describe('/store/order - POST FORM → JSON', () => {
  test('200 - successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedOrder.toString()
    console.log('Request Payload (200 FORM→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Response Body (200 FORM→JSON):', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('petId', exampleOrderJson.petId)
    expect(body).toHaveProperty('quantity', exampleOrderJson.quantity)
    expect(body).toHaveProperty('status', exampleOrderJson.status)
    expect(body).toHaveProperty('complete', exampleOrderJson.complete)
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidFormFor400.toString()
    console.log('Request Payload (400 FORM→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    console.log('Response Body (400 FORM→JSON):', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = invalidFormFor422.toString()
    console.log('Request Payload (422 FORM→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    })
    console.log('Response Body (422 FORM→JSON):', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = defaultErrorFormPayload.toString()
    console.log('Request Payload (Default FORM→JSON):', requestPayload)
    const response = await request.post(`${baseURL}/store/order`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    })
    const body = await response.json()
    console.log('Response Body (Default FORM→JSON):', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})
