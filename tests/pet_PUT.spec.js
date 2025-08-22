import { expect } from '@playwright/test';
import { test } from '../fixtures/apiWithAllure';

const examplePetJson = {
  id: 10,
  name: 'doggie',
  category: { id: 1, name: 'Dogs' },
  photoUrls: ['http://example.com/photo1'],
  tags: [{ id: 1, name: 'tag1' }],
  status: 'available'
};

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

const formUrlEncoded = new URLSearchParams({
  id: '10',
  name: 'doggie',
  'category.id': '1',
  'category.name': 'Dogs',
  'photoUrls[0]': 'http://example.com/photo1',
  'tags[0].id': '1',
  'tags[0].name': 'tag1',
  status: 'available'
});

const badJson = { wrong: 'data' };
const badXml = `<invalid><data/></invalid>`;
const badForm = new URLSearchParams({ wrong: 'data' });

const petNotFoundJson = { ...examplePetJson, id: 999999 };
const petNotFoundXml = `<?xml version="1.0" encoding="UTF-8"?>
  <Pet>
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
  </Pet>`;
const petNotFoundForm = new URLSearchParams(formUrlEncoded);
petNotFoundForm.set('id', '999999');

const validationErrorJson = { ...examplePetJson, name: '', photoUrls: [] };
const validationErrorXml = `<?xml version="1.0" encoding="UTF-8"?>
  <Pet>
    <id>10</id>
    <name></name>
    <photoUrls></photoUrls>
    <status>available</status>
  </Pet>`;
const validationErrorForm = new URLSearchParams({
  id: '10',
  name: '',
  'photoUrls[0]': '',
  status: 'available'
});

test.describe('/pet - PUT JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson;
    console.log('200 JSON→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 JSON→JSON Response:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('name', 'doggie');
    expect(body).toHaveProperty('category.name', 'Dogs');
    expect(body.photoUrls).toContain('http://example.com/photo1');
    expect(body.tags[0]).toHaveProperty('name', 'tag1');
    expect(body).toHaveProperty('status', 'available');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badJson;
    console.log('400 JSON→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('400 JSON→JSON Response:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = petNotFoundJson;
    console.log('404 JSON→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('404 JSON→JSON Response:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorJson;
    console.log('422 JSON→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('422 JSON→JSON Response:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson;
    console.log('Default JSON→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default JSON→JSON Response:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

test.describe('/pet - PUT JSON → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson;
    console.log('200 JSON→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 JSON→XML Response:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain('<id>10</id>');
    expect(text).toContain('<name>doggie</name>');
    expect(text).toContain('<category>');
    expect(text).toContain('<photoUrls>');
    expect(text).toContain('<tags>');
    expect(text).toContain('<status>available</status>');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badJson;
    console.log('400 JSON→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('400 JSON→XML Response:', await response.text());
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = petNotFoundJson;
    console.log('404 JSON→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('404 JSON→XML Response:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorJson;
    console.log('422 JSON→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
      },
      data: requestPayload
    });
    console.log('422 JSON→XML Response:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = examplePetJson;
    console.log('Default JSON→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    console.log('Default JSON→XML Response:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});

test.describe('/pet - PUT XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml;
    console.log('200 XML→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 XML→JSON Response:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('name', 'doggie');
    expect(body).toHaveProperty('category.name', 'Dogs');
    expect(body.photoUrls).toContain('http://example.com/photo1');
    expect(body.tags[0]).toHaveProperty('name', 'tag1');
    expect(body).toHaveProperty('status', 'available');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badXml;
    console.log('400 XML→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('400 XML→JSON Response:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = petNotFoundXml;
    console.log('404 XML→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('404 XML→JSON Response:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorXml;
    console.log('422 XML→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('422 XML→JSON Response:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml;
    console.log('Default XML→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default XML→JSON Response:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

test.describe('/pet - PUT XML → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml;
    console.log('200 XML→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 XML→XML Response:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain('<id>10</id>');
    expect(text).toContain('<name>doggie</name>');
    expect(text).toContain('<category>');
    expect(text).toContain('<photoUrls>');
    expect(text).toContain('<tags>');
    expect(text).toContain('<status>available</status>');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badXml;
    console.log('400 XML→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('400 XML→XML Response:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = petNotFoundXml;
    console.log('404 XML→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('404 XML→XML Response:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorXml;
    console.log('422 XML→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
      },
      data: requestPayload
    });
    console.log('422 XML→XML Response:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = examplePetXml;
    console.log('Default XML→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    console.log('Default XML→XML Response:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});

test.describe('/pet - PUT FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('200 FORM→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 FORM→JSON Response:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', 10);
    expect(body).toHaveProperty('name', 'doggie');
    expect(body).toHaveProperty('category.name', 'Dogs');
    expect(body.photoUrls).toContain('http://example.com/photo1');
    expect(body.tags[0]).toHaveProperty('name', 'tag1');
    expect(body).toHaveProperty('status', 'available');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString();
    console.log('400 FORM→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('400 FORM→JSON Response:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = petNotFoundForm.toString();
    console.log('404 FORM→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('404 FORM→JSON Response:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorForm.toString();
    console.log('422 FORM→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('422 FORM→JSON Response:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('Default FORM→JSON Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default FORM→JSON Response:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

test.describe('/pet - PUT FORM → XML', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('200 FORM→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('200 FORM→XML Response:', text);
    expect(response.status()).toBe(200);
    expect(text).toContain('<Pet>');
    expect(text).toContain('<id>10</id>');
    expect(text).toContain('<name>doggie</name>');
    expect(text).toContain('<category>');
    expect(text).toContain('<photoUrls>');
    expect(text).toContain('<tags>');
    expect(text).toContain('<status>available</status>');
  });

  test('400 - Invalid ID supplied', async ({ request, baseURL }) => {
    const requestPayload = badForm.toString();
    console.log('400 FORM→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('400 FORM→XML Response:', await response.text());
    expect(response.status()).toBe(400);
  });

  test('404 - Pet not found', async ({ request, baseURL }) => {
    const requestPayload = petNotFoundForm.toString();
    console.log('404 FORM→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('404 FORM→XML Response:', await response.text());
    expect(response.status()).toBe(404);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = validationErrorForm.toString();
    console.log('422 FORM→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: requestPayload
    });
    console.log('422 FORM→XML Response:', await response.text());
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncoded.toString();
    console.log('Default FORM→XML Request:', requestPayload);
    const response = await request.put(`${baseURL}/pet`, {
      headers: {
        'Accept': 'application/xml',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    console.log('Default FORM→XML Response:', await response.text());
    expect([500, 501, 502, 503]).toContain(response.status());
  });
});
