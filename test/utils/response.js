export async function assertSuccessResponse(response, expectedStatus = 200) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('success', true);
    if (expectedStatus !== 204) {
        return response.body.data ?? response.body.message ?? null;
    }
    return null;
}
export async function assertErrorResponse(response, expectedStatus, expectedCode) {
    expect(response.status).toBe(expectedStatus);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body.error).toMatchObject({
        code: expectedCode
    });
}
//# sourceMappingURL=response.js.map