declare module 'occt-import-js' {
  interface OcctModule {
    readStepFile?(buffer: ArrayBuffer): Promise<any>;
    ReadStepFile?(buffer: ArrayBuffer): Promise<any>;
    importStep?(buffer: ArrayBuffer): Promise<any>;
  }
  
  const occt: () => Promise<OcctModule>;
  export default occt;
}
