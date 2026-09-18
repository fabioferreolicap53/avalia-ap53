declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    letterRendering?: boolean;
    backgroundColor?: string;
    logging?: boolean;
    windowWidth?: number;
    width?: number;
    height?: number;
  }

  function html2canvas(element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  export default html2canvas;
}
