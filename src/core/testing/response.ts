export interface TestResponse {
  status: number;
  body: {
    success: boolean;
    data?: any;
    error?: {
      code: string;
      message: string;
    };
    message?: string;
  };
}

export async function assertSuccessResponse(response: TestResponse, expectedStatus = 200): Promise<any> {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', true);
  if (expectedStatus !== 204) {
    return response.body.data ?? response.body.message ?? null;
  }
  return null;
}

export async function assertErrorResponse(
  response: TestResponse, 
  expectedStatus: number, 
  expectedCode: string
): Promise<void> {
  expect(response.status).toBe(expectedStatus);
  expect(response.body).toHaveProperty('success', false);
  expect(response.body.error).toMatchObject({
    code: expectedCode
  });
}
