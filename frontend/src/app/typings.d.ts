interface Window {
  getIp: (ipInfo: any) => void;
  editor;
}

declare var window: Window & typeof globalThis;

declare var getIp: (ipInfo: any) => void;

declare var CKEDITOR: any;

declare var DecoupledEditor: any;
