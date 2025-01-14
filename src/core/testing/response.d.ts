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
export declare function assertSuccessResponse(response: TestResponse, expectedStatus?: number): Promise<any>;
export declare function assertErrorResponse(response: TestResponse, expectedStatus: number, expectedCode: string): Promise<void>;
//# sourceMappingURL=response.d.ts.map