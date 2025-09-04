import { expect } from '@playwright/test'
import { test } from '../fixtures/apiWithAllure'

// -------------------- 1. GET → JSON --------------------
test.describe('/store/inventory - GET → JSON', () => {
  test('200 - Successful operation', async ({ request, baseURL }) => {
    const requestPayload = 'No request body for GET';
    const response = await request.get(`/store/inventory`, {
      headers: {
        'Accept': 'application/json',
        'api_key': 'special-key'
      }
    });

    const body = await response.json();
    console.log('Request Payload:', requestPayload);
    consle.log('200 GET→JSON:', body);
    expect(response.status()).toBe(200);
    expect(typeof body).toBe('object');
    expect(body).not.toBeNull();
    for (const key in body) {
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        expect(typeof body[key]).toBe('number');
        expect(Number.isInteger(body[key])).toBe(true);
      }
    }
  });

  test('default - Unexpected error', async ({ request, baseURL }) => {
    const requestPayload = 'No request body for GET';
    const response = await request.get(`${baseURL}/store/inventory`, {
      headers: {
        'Accept': 'application/json',
        'api_key': 'invalid-key-to-force-error'
      }
    });

    const body = await response.json();
    console.log('Request Payload:', requestPayload);
    console.log('Default GET→JSON:', body);
    expect([500, 501, 502, 503]).toContain(response.status());
    expect(body).toHaveProperty('code');
    expect(body).toHaveProperty('message');
    expect(typeof body.code).toBe('string');
    expect(typeof body.message).toBe('string');
  });
});
