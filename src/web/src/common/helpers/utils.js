export function delayCall(callback, duration) { 
    setTimeout (
      () => {
        callback();
      },
      duration || 1000
    );
}