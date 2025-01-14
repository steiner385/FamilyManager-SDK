import React from 'react';
import type { BaseComponentProps } from './types';
export interface SearchProps extends BaseComponentProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    initialValue?: string;
    debounceMs?: number;
}
export declare const Search: React.FC<SearchProps>;
//# sourceMappingURL=Search.d.ts.map