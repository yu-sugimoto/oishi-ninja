export function createDomainName (domainName: string, prefix: string = '', envName: string = ''): string {
  if (envName && prefix) {
    return `${prefix}-${envName}.${domainName}`;
  }

  if (prefix) {
    return `${prefix}.${domainName}`;
  }

  if (envName) {
    return `${envName}.${domainName}`;
  }

  return domainName;
}
