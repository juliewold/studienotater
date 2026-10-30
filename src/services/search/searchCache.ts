/** One search instance/session owns this cache. Failed loads can be retried. */
export function createSearchCache<T>(load: () => Promise<T>) {
  let pending: Promise<T> | undefined;
  return {
    get() {
      if (!pending) {
        const request = load().catch(error => {
          if (pending === request) pending = undefined;
          throw error;
        });
        pending = request;
      }
      return pending;
    },
    invalidate() { pending = undefined; },
  };
}
