import React from 'react';
import type { BaseComponentProps } from './types';
export interface FormProps extends BaseComponentProps {
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    method?: 'get' | 'post';
    action?: string;
    autoComplete?: 'on' | 'off';
    noValidate?: boolean;
}
export declare const Form: React.FC<FormProps>;
//# sourceMappingURL=Form.d.ts.map