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

const examplePetXml = `<?xml version="1.0" encoding="UTF-8"?>
<pet>
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
</pet>`;

const formUrlEncoded = new URLSearchParams({
  id: '10',
  name: 'doggie',
  'category.id': '1',
  'category.name': 'Dogs',
  photoUrls: 'http://example.com/photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
});

const badJsonInput = { invalid: 'payload' };
const badXmlInput = ` <invalid><data/></invalid> `;
const badFormInput = new URLSearchParams({ wrong: 'data' });

const validationJsonError = { name: '', photoUrls: [] };
const validationXmlError = ` <pet><name></name><photoUrls/></pet> `;
const validationFormError = new URLSearchParams({ name: '', photoUrls: '' });

const notFoundPetJson = { ...examplePetJson, id: 999999 };
const notFoundPetXml = `<?xml version="1.0" encoding="UTF-8"?>
<pet>
  <id>999999</id>
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
</pet>`;
const notFoundPetForm = new URLSearchParams(formUrlEncoded);
notFoundPetForm.set('id', '999999');

const unexpectedErrorJson = { invalid: 'Unexpected' };
const unexpectedErrorXml = ` <unexpected><error/></unexpected> `;
const unexpectedErrorForm = new URLSearchParams({ invalid: 'Unexpected' });

const path = '/pet';
const method = 'PUT';

// -------------------- 1. JSON Request → JSON Response --------------------
test.describe(`${path} - ${method} JSON → JSON`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 JSON→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', requestPayload.id);
    expect(body).toHaveProperty('name', requestPayload.name);
    expect(body).toHaveProperty('status', requestPayload.status);
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badJsonInput;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('400 JSON→JSON:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = notFoundPetJson;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('404 JSON→JSON:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationJsonError;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('422 JSON→JSON:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = unexpectedErrorJson;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default JSON→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. JSON Request → XML Response --------------------
test.describe(`${path} - ${method} JSON → XML`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 JSON→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain(`<id>${requestPayload.id}</id>`);
    expect(text).toContain(`<name>${requestPayload.name}</name>`);
    expect(text).toContain(`<status>${requestPayload.status}</status>`);
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badJsonInput;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('400 JSON→XML:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = notFoundPetJson;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('404 JSON→XML:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationJsonError;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('422 JSON→XML:', await response.text());
    expect(response.status()).toBe(422);
  });
});

// -------------------- 3. XML Request → JSON Response --------------------
test.describe(`${path} - ${method} XML → JSON`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 XML→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('name', 'doggie');
    expect(body).toHaveProperty('status', 'available');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badXmlInput;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('400 XML→JSON:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = notFoundPetXml;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('404 XML→JSON:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationXmlError;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('422 XML→JSON:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = unexpectedErrorXml;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default XML→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 4. XML Request → XML Response --------------------
test.describe(`${path} - ${method} XML → XML`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 XML→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain('<id>10</id>');
    expect(text).toContain('<name>doggie</name>');
    expect(text).toContain('<status>available</status>');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badXmlInput;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('400 XML→XML:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = notFoundPetXml;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('404 XML→XML:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationXmlError;
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('422 XML→XML:', await response.text());
    expect(response.status()).toBe(422);
  });
});

// -------------------- 5. FORM Request → JSON Response --------------------
test.describe(`${path} - ${method} FORM → JSON`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 FORM→JSON:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('name', 'doggie');
    expect(body).toHaveProperty('status', 'available');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badFormInput.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('400 FORM→JSON:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = notFoundPetForm.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('404 FORM→JSON:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationFormError.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('422 FORM→JSON:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = unexpectedErrorForm.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default FORM→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 6. FORM Request → XML Response --------------------
test.describe(`${path} - ${method} FORM → XML`, () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 FORM→XML:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain('<id>10</id>');
    expect(text).toContain('<name>doggie</name>');
    expect(text).toContain('<status>available</status>');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badFormInput.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('400 FORM→XML:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = notFoundPetForm.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('404 FORM→XML:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationFormError.toString();
    console.log('Request Payload:', requestPayload);
    const response = await request.put(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('422 FORM→XML:', await response.text());
    expect(response.status()).toBe(422);
  });
});
