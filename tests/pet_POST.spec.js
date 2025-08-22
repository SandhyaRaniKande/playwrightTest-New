import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

const examplePetJson = {
  id: 10,
  name: 'doggie',
  category: { id: 1, name: 'Dogs' },
  photoUrls: ['http://example.com/photo1'],
  tags: [{ id: 1, name: 'tag1' }],
  status: 'available'
}

const invalidPetJson400 = {
  invalid: 'payload'
}

const invalidPetJson422 = {
  name: '',
  photoUrls: []
}

const examplePetXml = `<?xml version="1.0" encoding="UTF-8"?>
  <Pet>
    <id>10</id>
    <name>doggie</name>
    <category>
      <id>1</id>
      <name>Dogs</name>
    </category>
    <photoUrls>
      <photoUrl>http://example.com/photo1</photoUrl>
    </photoUrls>
    <tags>
      <tag>
        <id>1</id>
        <name>tag1</name>
      </tag>
    </tags>
    <status>available</status>
  </Pet>`;

const invalidPetXml400 = ` <invalid><data/></invalid> `;

const invalidPetXml422 = ` <Pet><name></name><photoUrls/></Pet> `;

const formUrlEncoded = new URLSearchParams({
  id: '10',
  name: 'doggie',
  'category.id': '1',
  'category.name': 'Dogs',
  photoUrls: 'http://example.com/photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
})

const badForm400 = new URLSearchParams({ wrong: 'data' })

const badForm422 = new URLSearchParams({ name: '', photoUrls: '' })

// -------------------- 1. JSON → JSON --------------------
test.describe('/pet - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: examplePetJson
    })
    const body = await response.json()
    console.log('Request Payload:', examplePetJson)
    console.log('200 JSON→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('status', 'available')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: invalidPetJson400
    })
    console.log('Request Payload:', invalidPetJson400)
    console.log('400 JSON→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: invalidPetJson422
    })
    console.log('Request Payload:', invalidPetJson422)
    console.log('422 JSON→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: examplePetJson
    })
    const body = await response.json()
    console.log('Request Payload:', examplePetJson)
    console.log('Default JSON→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 2. JSON → XML --------------------
test.describe('/pet - POST JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: examplePetJson
    })
    const text = await response.text()
    console.log('Request Payload:', examplePetJson)
    console.log('200 JSON→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<status>available</status>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: invalidPetJson400
    })
    console.log('Request Payload:', invalidPetJson400)
    console.log('400 JSON→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json'
      },
      data: invalidPetJson422
    })
    console.log('Request Payload:', invalidPetJson422)
    console.log('422 JSON→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: examplePetJson
    })
    console.log('Request Payload:', examplePetJson)
    console.log('Default JSON→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 3. XML → JSON --------------------
test.describe('/pet - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: examplePetXml
    })
    const body = await response.json()
    console.log('Request Payload:', examplePetXml)
    console.log('200 XML→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('status', 'available')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: invalidPetXml400
    })
    console.log('Request Payload:', invalidPetXml400)
    console.log('400 XML→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: invalidPetXml422
    })
    console.log('Request Payload:', invalidPetXml422)
    console.log('422 XML→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: examplePetXml
    })
    const body = await response.json()
    console.log('Request Payload:', examplePetXml)
    console.log('Default XML→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 4. XML → XML --------------------
test.describe('/pet - POST XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: examplePetXml
    })
    const text = await response.text()
    console.log('Request Payload:', examplePetXml)
    console.log('200 XML→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<status>available</status>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: invalidPetXml400
    })
    console.log('Request Payload:', invalidPetXml400)
    console.log('400 XML→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml'
      },
      data: invalidPetXml422
    })
    console.log('Request Payload:', invalidPetXml422)
    console.log('422 XML→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: examplePetXml
    })
    console.log('Request Payload:', examplePetXml)
    console.log('Default XML→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})

// -------------------- 5. FORM → JSON --------------------
test.describe('/pet - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formUrlEncoded.toString()
    })
    const body = await response.json()
    console.log('Request Payload:', formUrlEncoded.toString())
    console.log('200 FORM→JSON:', body)
    expect(response.status()).toBe(200)
    expect(body).toHaveProperty('id')
    expect(body).toHaveProperty('name', 'doggie')
    expect(body).toHaveProperty('status', 'available')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: badForm400.toString()
    })
    console.log('Request Payload:', badForm400.toString())
    console.log('400 FORM→JSON:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: badForm422.toString()
    })
    console.log('Request Payload:', badForm422.toString())
    console.log('422 FORM→JSON:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: formUrlEncoded.toString()
    })
    const body = await response.json()
    console.log('Request Payload:', formUrlEncoded.toString())
    console.log('Default FORM→JSON:', body)
    expect([500, 501, 502, 503]).toContain(response.status())
    expect(body).toHaveProperty('code')
    expect(body).toHaveProperty('message')
  })
})

// -------------------- 6. FORM → XML --------------------
test.describe('/pet - POST FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formUrlEncoded.toString()
    })
    const text = await response.text()
    console.log('Request Payload:', formUrlEncoded.toString())
    console.log('200 FORM→XML:', text)
    expect(response.status()).toBe(200)
    expect(text).toContain('<Pet>')
    expect(text).toContain('<name>doggie</name>')
    expect(text).toContain('<status>available</status>')
  })

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: badForm400.toString()
    })
    console.log('Request Payload:', badForm400.toString())
    console.log('400 FORM→XML:', await response.text())
    expect(response.status()).toBe(400)
  })

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: badForm422.toString()
    })
    console.log('Request Payload:', badForm422.toString())
    console.log('422 FORM→XML:', await response.text())
    expect(response.status()).toBe(422)
  })

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const response = await request.post(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: formUrlEncoded.toString()
    })
    console.log('Request Payload:', formUrlEncoded.toString())
    console.log('Default FORM→XML:', await response.text())
    expect([500, 501, 502, 503]).toContain(response.status())
  })
})