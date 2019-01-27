declare module '*.graphql' {
  const value: any;
  export default value;
}

declare module 'graphql-tools' {
  interface IResolvers {
    [key: string]: object;
  }
}