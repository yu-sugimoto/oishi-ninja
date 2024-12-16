function toKebabCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1-$2") // キャメルケースをハイフンで区切る
    .replace(/\s+/g, "-") // スペースをハイフンに置換
    .replace(/_/g, "-") // アンダースコアをハイフンに置換
    .toLowerCase(); // 小文字に変換
}

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
    const id = `${appName}-${envName}-${name}`
    return id;
  }
}

export function buildStackNameCreator (
  appName: string,
  envName: string
) {
  return function createStackName (bucketKey: string) {
    if (envName === '') return `${appName}-${bucketKey}`;
    return `${appName}-${envName}-${bucketKey}`;
  }
}

export function buildBucketNameCreator (
  appName: string,
  envName: string,
) {
  const _appName = toKebabCase(appName);
  const _envName = toKebabCase(envName);
  return function createBucketName (stackKey: string) {
    const _stackKey = toKebabCase(stackKey);
    if (envName === '') return `${_appName}-${_stackKey}`;
    return `${_appName}-${_envName}-${_stackKey}`;
  }
}

export function buildSsmParameterNameCreator (
  appName: string,
  envName: string
) {
  return function createSsmParameterName (path: string) {
    return `/cdk/${appName}/${envName}/${path}`;
  }
}
