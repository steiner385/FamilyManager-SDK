import React from 'react';
import type { BaseComponentProps, SelectOption } from './types';
export interface SelectProps extends BaseComponentProps {
    options: SelectOption[];
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
    label?: string;
    required?: boolean;
    name?: string;
}
export declare const Select: React.FC<SelectProps>;
//# sourceMappingURL=Select.d.ts.map