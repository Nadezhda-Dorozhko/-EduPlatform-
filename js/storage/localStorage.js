class LocalStorageService {
  constructor() {
    this.storage = window.localStorage;
    this.initializeStorage();
  }

  initializeStorage() {
    if (!this.get('app_settings')) {
      this.set('app_settings', {
        theme: 'light',
        language: 'ru',
        cacheDuration: 3600000,
      });
    }
  }

  set(key, value) {
    const item = {
      value: value,
      timestamp: new Date().getTime(),
    };
    this.storage.setItem(key, JSON.stringify(item));
    return true;
  }

  get(key, defaultValue = null, maxAge = null) {
    const item = this.storage.getItem(key);
    if (!item) return defaultValue;
    const parsedItem = JSON.parse(item);
    return parsedItem.value;
  }
}
export default LocalStorageService;
