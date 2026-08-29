const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const FORM_COOLDOWN_MS = 8000;
const STORE = 'plural-form-ts';

export const sanitizeText = (value: string, max = 120) =>
  value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export const isValidEmail = (value: string) => {
  const email = sanitizeText(value, 254);
  return EMAIL_RE.test(email);
};

export const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 9 && digits.length <= 15;
};

export const isHoneypotFilled = (value: string) => value.trim().length > 0;

export const canSubmitForm = () => {
  try {
    const last = Number(sessionStorage.getItem(STORE) || 0);
    return Date.now() - last >= FORM_COOLDOWN_MS;
  } catch {
    return true;
  }
};

export const markFormSubmitted = () => {
  try {
    sessionStorage.setItem(STORE, String(Date.now()));
  } catch {
    /* ignore quota / private mode */
  }
};
