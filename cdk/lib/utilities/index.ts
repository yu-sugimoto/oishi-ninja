export function createDomainName (
  rootDomain: string,
  subDomain: string = '',
  envName: string = ''
) {
  const prefix = envName !== 'production' ? `${envName}-` : '';

  if (prefix && subDomain) return `${prefix}-${subDomain}.${rootDomain}`;
  if (subDomain) return `${subDomain}.${rootDomain}`;
  if (prefix) return `${prefix}.${rootDomain}`;
  return rootDomain;
}

export function buildIdCreator (
  appName: string,
  envName: string = 'production'
) {
  return function createId (name: string) {
    return `${appName}-${envName}-${name}`;
  }
}

export function buildStackNameCreator (
  appName: string,
  envName: string
) {
  return function createStackName (stackKey: string) {
    if (envName === '') return `${appName}-${stackKey}`;
    return `${appName}-${envName}-${stackKey}`;
  }
}
