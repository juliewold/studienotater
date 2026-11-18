// Pure validation rules for the registration form. They mirror the input
// attributes in RegisterPage and are kept here so they can be tested offline.

export const minUsernameLength = 3;
export const maxUsernameLength = 30;
export const minPasswordLength = 6;

const usernameCharacters = /^[A-Za-z0-9_-]+$/;

export function usernameRules(value: string) {
  const trimmed = value.trim();
  return {
    length: trimmed.length >= minUsernameLength && trimmed.length <= maxUsernameLength,
    characters: trimmed.length > 0 && usernameCharacters.test(trimmed),
  };
}

export function usernameIsValid(value: string): boolean {
  const rules = usernameRules(value);
  return rules.length && rules.characters;
}

export function passwordRules(value: string) {
  return { length: value.length >= minPasswordLength };
}
