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
        cacheDuration: 3600000, // 1 час в миллисекундах
      });
    }
  }

  set(key, value) {
    try {
      const item = {
        value: value,
        timestamp: new Date().getTime(),
      };
      this.storage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  }

  get(key, defaultValue = null, maxAge = null) {
    try {
      const item = this.storage.getItem(key);
      if (!item) return defaultValue;

      const parsedItem = JSON.parse(item);

      // Проверка срока действия кэша
      if (maxAge && new Date().getTime() - parsedItem.timestamp > maxAge) {
        this.remove(key);
        return defaultValue;
      }

      return parsedItem.value;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  remove(key) {
    try {
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  }

  clearExpired() {
    const settings = this.get('app_settings');
    const cacheDuration = settings?.cacheDuration || 3600000;
    const now = new Date().getTime();

    // Получаем все ключи корректно
    const keys = Object.keys(this.storage);

    keys.forEach((key) => {
      if (key !== 'app_settings') {
        const itemStr = this.storage.getItem(key);
        if (itemStr) {
          try {
            const parsed = JSON.parse(itemStr);
            if (now - parsed.timestamp > cacheDuration) {
              this.remove(key);
            }
          } catch (e) {
            // Если данные повреждены — удаляем
            this.remove(key);
          }
        }
      }
    });
  }

  getAllKeys() {
    return Object.keys(this.storage);
  }

  hasValid(key, maxAge = null) {
    return this.get(key, null, maxAge) !== null;
  }
}

export default LocalStorageService;
