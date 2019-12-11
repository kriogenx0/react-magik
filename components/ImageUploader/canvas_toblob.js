// # Polyfill for canvas.toBlob
// # allows creating an image from canvas
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
    value: function(callback, type, quality) {
      var arr, binStr, i, len;
      binStr = atob(this.toDataURL(type, quality).split(',')[1]);
      len = binStr.length;
      arr = new Uint8Array(len);
      i = 0;
      while (i < len) {
        arr[i] = binStr.charCodeAt(i);
        i++;
      }
      callback(new Blob([arr], {
        type: type || 'image/png'
      }));
    }
  });
}
