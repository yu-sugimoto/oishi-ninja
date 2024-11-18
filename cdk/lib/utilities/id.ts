export function createId (name: string, envName: string = '', prefix: string = 'OishiNinja'): string {
  if (envName) {
    return `${prefix}-${envName}-${name}`;
  }

  return `${prefix}-${name}`;
}
