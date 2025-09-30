declare module 'opencascade.js' {
  interface OpenCascadeModule {
    STEPCAFControl_Reader: any;
    IFSelect_ReturnStatus: any;
  }
  
  export default function(): Promise<OpenCascadeModule>;
}
