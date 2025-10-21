// Ambient declarations to satisfy third-party typings in editor/typecheck

// Element Plus references JSX in .d.ts
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Popper core types resolution workaround
declare module '@popperjs/core' {
  const anyExport: any
  export = anyExport
}

// Web Bluetooth API types used by @vueuse/core
interface BluetoothLEScanFilter { [key: string]: any }
type BluetoothServiceUUID = number | string
interface BluetoothDevice { [key: string]: any }
interface BluetoothRemoteGATTServer { [key: string]: any }


