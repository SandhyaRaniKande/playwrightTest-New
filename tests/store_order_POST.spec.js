import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'


const exampleOrderJson = {
  id: 10,
  petId: 198772,
  quantity: 7,
  shipDate: '2023-10-27T10:00:00.000Z',
  status: 'approved',
  complete: true
}

const exampleOrderXml = `<?xml version="1.0" encoding="UTF-8"?>
<order>
  <id>10</id>
  <petId>198772</petId>
  <quantity>7</quantity>
  <shipDate>2023-10-27T10:00:00.000Z</shipDate>
  <status>approved</status>
  <complete>true</complete>
</order>`;

const formUrlEncodedOrder = new URLSearchParams({
  id: '10',
  petId: '198772',
  quantity: '7',
  shipDate: '2023-10-27T10:00:00.000Z',
  status: 'approved',
  complete: 'true'
});

const invalidJson400 = { wrongField: 'value', id: 'not-an-int' };
const invalidXml400 = `<order><wrongField>value</wrongField><id>not-an-int</id></order>`;
const invalidForm400 = new URLSearchParams({ wrongField: 'value', id: 'not-an-int' });

const invalidJson422 = { id: 1, petId: 1, quantity: 1, status: 'invalid_status' };
const invalidXml422 = `<order><id>1</id><petId>1</petId><quantity>1</quantity><status>invalid_status</status></order>`;
const invalidForm422 = new URLSearchParams({ id: '1', petId: '1', quantity: '1', status: 'invalid_status' });

const path = '/store/order';

// -------------------- 1. JSON → JSON --------------------
test.describe('/store/order - POST JSON → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleOrderJson;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 JSON→JSON Request:', requestPayload);
    console.log('200 JSON→JSON Response:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', exampleOrderJson.id);
    expect(body).toHaveProperty('petId', exampleOrderJson.petId);
    expect(body).toHaveProperty('quantity', exampleOrderJson.quantity);
    expect(body).toHaveProperty('status', exampleOrderJson.status);
    expect(body).toHaveProperty('complete', exampleOrderJson.complete);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidJson400;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('400 JSON→JSON Request:', requestPayload);
    console.log('400 JSON→JSON Response:', text);
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = invalidJson422;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('422 JSON→JSON Request:', requestPayload);
    console.log('422 JSON→JSON Response:', text);
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = exampleOrderJson;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default JSON→JSON Request:', requestPayload);
    console.log('Default JSON→JSON Response:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 2. XML → JSON --------------------
test.describe('/store/order - POST XML → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = exampleOrderXml;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 XML→JSON Request:', requestPayload);
    console.log('200 XML→JSON Response:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', exampleOrderJson.id);
    expect(body).toHaveProperty('petId', exampleOrderJson.petId);
    expect(body).toHaveProperty('quantity', exampleOrderJson.quantity);
    expect(body).toHaveProperty('status', exampleOrderJson.status);
    expect(body).toHaveProperty('complete', exampleOrderJson.complete);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidXml400;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('400 XML→JSON Request:', requestPayload);
    console.log('400 XML→JSON Response:', text);
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = invalidXml422;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml'
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('422 XML→JSON Request:', requestPayload);
    console.log('422 XML→JSON Response:', text);
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = exampleOrderXml;
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/xml',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default XML→JSON Request:', requestPayload);
    console.log('Default XML→JSON Response:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});

// -------------------- 3. FORM → JSON --------------------
test.describe('/store/order - POST FORM → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedOrder.toString();
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('200 FORM→JSON Request:', requestPayload);
    console.log('200 FORM→JSON Response:', body);
    expect(response.status()).toBe(200);
    expect(body).toHaveProperty('id', exampleOrderJson.id);
    expect(body).toHaveProperty('petId', exampleOrderJson.petId);
    expect(body).toHaveProperty('quantity', exampleOrderJson.quantity);
    expect(body).toHaveProperty('status', exampleOrderJson.status);
    expect(body).toHaveProperty('complete', exampleOrderJson.complete);
  });

  test('400 - Invalid input', async ({ request, baseURL }) => {
    const requestPayload = invalidForm400.toString();
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('400 FORM→JSON Request:', requestPayload);
    console.log('400 FORM→JSON Response:', text);
    expect(response.status()).toBe(400);
  });

  test('422 - Validation exception', async ({ request, baseURL }) => {
    const requestPayload = invalidForm422.toString();
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: requestPayload
    });
    const text = await response.text();
    console.log('422 FORM→JSON Request:', requestPayload);
    console.log('422 FORM→JSON Response:', text);
    expect(response.status()).toBe(422);
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = formUrlEncodedOrder.toString();
    const response = await request.post(`${baseURL}${path}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Force-Error': 'true'
      },
      data: requestPayload
    });
    const body = await response.json();
    console.log('Default FORM→JSON Request:', requestPayload);
    console.log('Default FORM→JSON Response:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
  });
});