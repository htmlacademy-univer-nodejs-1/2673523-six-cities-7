export type Range = {
  min: number;
  max: number;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseNumber(value: string, field: string, {min, max}: Range, isInteger = false): number {
  const result = Number(value);
  const isInvalid = value.trim() === '' || !Number.isFinite(result)
    || result < min || result > max || (isInteger && !Number.isInteger(result));

  if (isInvalid) {
    throw new Error(`${field} содержит некорректное значение: ${value}`);
  }
  return result;
}

export function parseInteger(value: string, field: string, range: Range): number {
  return parseNumber(value, field, range, true);
}

export function parseBoolean(value: string, field: string): boolean {
  if (value !== 'true' && value !== 'false') {
    throw new Error(`${field} должно быть true или false, получено: ${value}`);
  }
  return value === 'true';
}

export function parseDate(value: string, field: string): Date {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${field} содержит некорректную дату: ${value}`);
  }
  return date;
}

export function parseEnum<T extends string>(value: string, allowed: readonly T[], field: string): T {
  const result = allowed.find((item) => item === value);
  if (!result) {
    throw new Error(`${field} содержит неизвестное значение: ${value}`);
  }
  return result;
}

export function parseList(value: string, separator = ';'): string[] {
  return value.split(separator).map((item) => item.trim());
}

export function checkLength(value: string, field: string, {min, max}: Range): string {
  if (value.length < min || value.length > max) {
    throw new Error(`Длина поля ${field} должна быть от ${min} до ${max} символов`);
  }
  return value;
}

export function checkEmail(value: string, field: string): string {
  if (!EMAIL_PATTERN.test(value)) {
    throw new Error(`${field} содержит некорректную почту: ${value}`);
  }
  return value;
}
