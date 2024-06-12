import { dictionary } from './dictionary';

// The functions in this module can be used to construct custom error messages for input validation.
export const onlyNumber = (t?: string): string =>
  t
    ? `${t} xanası yalnız rəqəmlərdən ibarət olmalıdır`
    : dictionary.az.onlyDigitsField;

export const inputValidationText = (t?: string): string =>
  t ? `${t} xanasının daxil edilməsi məcburidir` : dictionary.az.required;
export const minLengthCheck = (t: string, l: string): string =>
  `${t} Xanası ən azı ${l} xarakterdən ibarət olmalıdır`;
export const maxLengthCheck = (t: string, l: string): string =>
  `${t} Xanası ən çox ${l} xarakter olmalıdır`;
