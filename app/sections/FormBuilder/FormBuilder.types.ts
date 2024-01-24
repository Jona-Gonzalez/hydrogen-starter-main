export interface FormBuilderProps {
  endpoint: string;
  heading?: string;
  fields: Record<string, unknown>[];
  section: {
    maxWidth: string;
  };
  submitText: string;
  recaptchaEnabled: boolean;
}

export interface CountryFieldProps {
  selectClass?: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}
