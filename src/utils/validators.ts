import { validate as uuidValidate, version as uuidVersion } from 'uuid';
import { User, UserPayload } from '../types';

export function isValidUUID(value: string = ''): boolean {
  if (!value) {
    return false;
  }

  return uuidValidate(value) && uuidVersion(value) === 4;
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && isFinite(value);
}

export function isString(value: unknown): value is string {
  return typeof value === 'string' || value instanceof String;
}

export function isValidUserPayload(
  value: Record<string, unknown> = {},
): value is UserPayload & { [key: string]: unknown } {
  if (!isString(value.username)) {
    return false;
  }

  if (!Array.isArray(value.hobbies)) {
    return false;
  }

  if (!isNumber(value.age)) {
    return false;
  }

  for (const hobby of value.hobbies) {
    if (!isString(hobby)) {
      return false;
    }
  }

  return true;
}

export function iseValidUser(
  value: Record<string, unknown> = {},
): value is User & { [key: string]: unknown } {
  if (!isValidUserPayload(value)) {
    return false;
  }

  if (!isValidUUID(value.id as string)) {
    return false;
  }

  return true;
}
