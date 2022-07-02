export function deletePrefix(str: string, prefix: string): string {
  return str.slice(prefix.length);
}
