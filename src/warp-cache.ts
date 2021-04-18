import type {WarpCacheOptions, WarpStorage} from "./types";

export class WarpCache {
  storage: WarpStorage

  options = {
    storage: 'local',
    fallback: 'object',
  }

  constructor(options: WarpCacheOptions) {
    this.options = {...this.options, ...options}
    this.init()
  }

  init(): void {
    if (!this.checkStorage()) {
      this.fallback()
    }
    this.storage = this.options.storage === 'local' ? localStorage : sessionStorage
  }

  get(name: string): string {
    return JSON.parse(this.storage.getItem(name))
  }

  set(name: string, value: string): void {
    this.storage.setItem(name, JSON.stringify(value))
  }

  remove(name: string): void {
    this.storage.removeItem(name)
  }

  clear(): void {
    this.storage.clear()
  }

  fallback(): void {
    const setGlobal = (fallback: WarpStorage) => {
      if (this.options.storage === 'local' && !window.localStorage) {
        (window as WindowInterface).localStorage = fallback
      }
      if (this.options.storage === 'session') {
        (window as WindowInterface).sessionStorage = fallback
      }
    }
    if (this.options.fallback === 'object') {
      setGlobal(this.fallbackObject())
    }
    if (this.options.fallback === 'cookie') {
      setGlobal(this.fallbackCookie())
    }
  }

  fallbackObject(): WarpStorage {
    return {
      _data: {},
      setItem: function (id, val) {
        this._data[id] = JSON.stringify(val);
      },
      getItem: function (id) {
        return Object.prototype.hasOwnProperty.call(this._data, id) ? JSON.parse(this._data[id]) : undefined;
      },
      removeItem: function (id) {
        delete this._data[id];
      },
      clear: function () {
        this._data = {};
      }
    };
  }

  fallbackCookie(): WarpStorage {
    return {
      _data: JSON.parse(document.cookie.replace(/(?:(?:^|.*;\s*)localStorage\s*=\s*([^;]*).*$)|^.*$/, "$1") || '{}'),
      _save: function () {
        document.cookie = "localStorage=" + JSON.stringify(this._data) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      },
      setItem: function (id, val) {
        this._data[id] = JSON.stringify(val);
        this._save();
      },
      getItem: function (id) {
        return Object.prototype.hasOwnProperty.call(this._data, id) ? JSON.parse(this._data[id]) : null;
      },
      removeItem: function (id) {
        delete this._data[id];
        this._save();
      },
      clear: function () {
        this._data = {};
        this._save();
      }
    };
  }

  checkStorage(): boolean {
    try {
      localStorage.setItem('storage_test', '123');
      localStorage.removeItem('storage_test');
      return true;
    } catch (e) {
      return false;
    }
  }
}
