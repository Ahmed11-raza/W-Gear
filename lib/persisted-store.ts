/**
 * A module-level store backed by localStorage, shaped for
 * `useSyncExternalStore`.
 *
 * localStorage is an external system, and reading it in an effect to seed
 * component state causes exactly the cascading render React now warns about.
 * This subscribes to it instead.
 *
 * Hydration safety comes from the two snapshots. The server snapshot and the
 * client's first snapshot are both `fallback`, so the markup matches; the real
 * stored value is read once on first subscription, after hydration, and pushed
 * out as an ordinary update.
 */

export interface PersistedStore<T> {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => T;
  getServerSnapshot: () => T;
  set: (next: T) => void;
}

export function createPersistedStore<T>(
  key: string,
  fallback: T,
  /** Map stored JSON (or `undefined` when absent) to a value. Must never throw. */
  revive: (raw: unknown) => T,
): PersistedStore<T> {
  let value = fallback;
  let hydrated = false;
  const listeners = new Set<() => void>();

  function emit() {
    for (const listener of listeners) listener();
  }

  /**
   * `revive` decides what an absent value means, which is not the same question
   * as what the server should render. A dismissible notice is hidden during
   * hydration (the fallback) but visible when nothing has been stored yet, so
   * the two cases must stay distinguishable. Unreadable storage is treated as
   * absent rather than as the fallback, so a blocked-storage browser still sees
   * anything that defaults to visible.
   */
  function read(): T {
    let raw: unknown;
    try {
      const stored = window.localStorage.getItem(key);
      raw = stored === null ? undefined : JSON.parse(stored);
    } catch {
      // Private mode, blocked storage, or corrupt JSON.
      raw = undefined;
    }
    return revive(raw);
  }

  function refresh() {
    const next = read();
    if (next === value) return;
    value = next;
    emit();
  }

  return {
    subscribe(listener) {
      listeners.add(listener);

      if (!hydrated) {
        hydrated = true;
        // After paint, so the hydrating render still matches the server.
        queueMicrotask(refresh);
      }

      // Keeps two tabs in agreement.
      const onStorage = (event: StorageEvent) => {
        if (event.key === key) refresh();
      };
      window.addEventListener("storage", onStorage);

      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },

    getSnapshot: () => value,
    getServerSnapshot: () => fallback,

    set(next) {
      value = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        // Storage unavailable. State still works for this page session.
      }
      emit();
    },
  };
}
