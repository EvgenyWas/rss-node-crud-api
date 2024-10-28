export function removeTrailingSlash(value: string = ''): string {
  return value.replace(/\/+$/g, '');
}

export function getRoute(base: string, route: string): string {
  return new URL(base + route, 'http://localhost').pathname;
}
