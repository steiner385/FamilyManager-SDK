export interface UIComponentMetadata {
  name: string;
  description?: string;
  category?: string;
  version?: string;
  author?: string;
  props?: {
    [key: string]: {
      type: string;
      required?: boolean;
      description?: string;
      defaultValue?: any;
    };
  };
}
