// ========================================
// 1. ПОИСК ЭЛЕМЕНТОВ (демонстрация для лаб. работы)
// ========================================
const header = document.querySelector('.header');
const allCards = document.querySelectorAll('.course-card');
const mainContainer = document.querySelector('.main');
console.log('Найдено элементов:', {
  '.header': header,
  '.cards': allCards,
  '.container': mainContainer,
});

// ========================================
// 2. МАНИПУЛЯЦИЯ КОНТЕНТОМ
// ========================================
// Устанавливаем название логотипа
const projectTitle = document.querySelector('.header__logo a');
projectTitle.textContent = 'EduPlatform';

// ========================================
// 3. РАБОТА С КЛАССАМИ И СТИЛЯМИ
// ========================================
const firstCard = document.querySelector('.course-card');
if (firstCard) {
  firstCard.classList.add('card--highlighted');
  firstCard.style.transition = 'all 0.3s ease';
}

// ========================================
// 4. БАЗОВЫЕ СОБЫТИЯ
// ========================================
// Кнопка "Начать обучение" в hero
const heroButton = document.querySelector('.hero__button');
if (heroButton) {
  heroButton.addEventListener('click', function (event) {
    event.preventDefault();
    console.log('Кнопка нажата!');
    const coursesSection = document.querySelector('.courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Поиск
const searchInput = document.querySelector('#search');
if (searchInput) {
  searchInput.addEventListener('input', function (event) {
    console.log('Введен текст:', event.target.value);
  });
}

// Форма подписки
const newsletterForm = document.querySelector('.newsletter__form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.log('Данные формы:', Object.fromEntries(formData));
  });
}

// ========================================
// 5. ДЕЛЕГИРОВАНИЕ СОБЫТИЙ — карточки курсов
// Кнопка "Подробнее" показывает детали, НЕ скрывает карточку
// ========================================
document.querySelector('.courses').addEventListener('click', function (event) {
  if (event.target.classList.contains('course-card__button')) {
    event.preventDefault();
    const card = event.target.closest('.course-card');
    const title = card.querySelector('.course-card__title').textContent;
    console.log('Открыт курс:', title);
    // Убираем выделение со всех карточек
    document.querySelectorAll('.course-card').forEach(function (c) {
      c.classList.remove('course-card--active');
    });
    // Выделяем выбранную
    card.classList.add('course-card--active');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
});

// ========================================
// 6. ПРОГРЕСС-БАР
// ========================================
const lessons = document.querySelectorAll('.lesson-item');
const progressFill = document.querySelector('.progress-bar__fill');
const progressLabel = document.querySelector('.progress-bar__label');
const totalLessons = lessons.length;

// Восстанавливаем прогресс из localStorage
let completedCount = parseInt(localStorage.getItem('progress') || '0');
const completedIds = JSON.parse(
  localStorage.getItem('completedLessons') || '[]'
);

// Восстанавливаем визуальное состояние уроков
lessons.forEach(function (lesson) {
  const lessonId = lesson.dataset.lesson;
  if (completedIds.includes(lessonId)) {
    lesson.classList.add('lesson-item--done');
  }
});

// Обновляем прогресс-бар при загрузке
updateProgressBar();

function updateProgressBar() {
  const count = document.querySelectorAll('.lesson-item--done').length;
  const percent =
    totalLessons > 0 ? Math.round((count / totalLessons) * 100) : 0;
  progressFill.style.width = percent + '%';
  progressLabel.textContent =
    count + ' из ' + totalLessons + ' уроков пройдено';
}

lessons.forEach(function (lesson) {
  lesson.addEventListener('click', function (event) {
    // Клик по кнопке закладки внутри урока — не переключаем прогресс
    if (event.target.classList.contains('bookmark-btn')) return;
    const lessonId = this.dataset.lesson;
    const completedIds = JSON.parse(
      localStorage.getItem('completedLessons') || '[]'
    );
    if (!this.classList.contains('lesson-item--done')) {
      this.classList.add('lesson-item--done');
      completedIds.push(lessonId);
      console.log('Урок пройден:', lessonId);
    } else {
      this.classList.remove('lesson-item--done');
      const idx = completedIds.indexOf(lessonId);
      if (idx !== -1) completedIds.splice(idx, 1);
      console.log('Урок отмечен как непройденный:', lessonId);
    }
    localStorage.setItem('completedLessons', JSON.stringify(completedIds));
    localStorage.setItem(
      'progress',
      document.querySelectorAll('.lesson-item--done').length
    );
    updateProgressBar();
  });
});

// ========================================
// 7. ЗАКЛАДКИ
// ========================================
const BOOKMARK_LABELS = {
  'course-1': 'UI/UX Design в Figma',
  'course-2': 'Программирование на Python',
  'lesson-1': 'Урок 1: Введение в UI/UX',
  'lesson-2': 'Урок 2: Основы Figma',
  'lesson-3': 'Урок 3: Компоненты',
  'lesson-4': 'Урок 4: Адаптивность',
  'lesson-5': 'Урок 5: Финальный проект',
};

let bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');

function renderBookmarksPanel() {
  const list = document.querySelector('.bookmarks-list');
  const count = document.querySelector('.bookmarks-count');
  if (!list) return;
  count.textContent = '(' + bookmarks.length + ')';
  if (bookmarks.length === 0) {
    list.innerHTML =
      '<li class="bookmarks-list__empty">Нет сохранённых закладок</li>';
    return;
  }
  list.innerHTML = bookmarks
    .map(function (id) {
      const label = BOOKMARK_LABELS[id] || id;
      return (
        '<li class="bookmarks-list__item">' +
        '<span>' +
        label +
        '</span>' +
        '<button class="bookmarks-list__remove" data-id="' +
        id +
        '" aria-label="Удалить закладку">✕</button>' +
        '</li>'
      );
    })
    .join('');
}

function updateBookmarkButtons() {
  document.querySelectorAll('.bookmark-btn').forEach(function (btn) {
    const id = btn.dataset.id;
    if (bookmarks.includes(id)) {
      btn.classList.add('bookmark-btn--active');
      btn.textContent = '★';
    } else {
      btn.classList.remove('bookmark-btn--active');
      btn.textContent = '☆';
    }
  });
}

// Инициализация при загрузке
updateBookmarkButtons();
renderBookmarksPanel();

// Обработка кликов по кнопкам закладок (делегирование)
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('bookmark-btn')) {
    const id = event.target.dataset.id;
    const index = bookmarks.indexOf(id);
    if (index === -1) {
      bookmarks.push(id);
      console.log('Добавлено в закладки:', id);
    } else {
      bookmarks.splice(index, 1);
      console.log('Удалено из закладок:', id);
    }
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButtons();
    renderBookmarksPanel();
    console.log('Все закладки:', bookmarks);
  }
  // Удаление из панели закладок
  if (event.target.classList.contains('bookmarks-list__remove')) {
    const id = event.target.dataset.id;
    bookmarks = bookmarks.filter(function (b) {
      return b !== id;
    });
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButtons();
    renderBookmarksPanel();
  }
});

// ========================================
// 8. ТЕСТ
// ========================================
const quizForm = document.querySelector('.quiz-form');
if (quizForm) {
  quizForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const answers = { q1: 'b', q2: 'c', q3: 'a' };
    let score = 0;
    const formData = new FormData(this);
    Object.keys(answers).forEach(function (question) {
      const correct = answers[question];
      const selected = formData.get(question);
      const options = document.querySelectorAll(
        'input[name="' + question + '"]'
      );
      options.forEach(function (option) {
        const label = option.parentNode;
        label.style.color = '';
        if (option.value === correct) {
          label.style.color = 'green';
        } else if (option.value === selected && selected !== correct) {
          label.style.color = 'red';
        }
      });
      if (selected === correct) score++;
    });
    const result = document.querySelector('.quiz-result');
    result.textContent =
      'Результат: ' + score + ' из ' + Object.keys(answers).length;
    console.log('Результат теста:', score);
  });
}

// ========================================
// 9. ВАЛИДАЦИЯ ФОРМЫ ПОДПИСКИ
// ========================================
const emailInput = document.querySelector('#email');
if (emailInput) {
  emailInput.addEventListener('blur', function () {
    clearErrors(this);
    if (this.value && !validateEmail(this.value)) {
      showError(this, 'Введите корректный email');
    }
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors(emailInput);
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Поле email обязательно');
      return;
    }
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, 'Введите корректный email');
      return;
    }
    console.log('Форма отправлена:', emailInput.value);
    emailInput.value = '';
    alert('Вы успешно подписались на новости!');
  });
}

/// ========================================
// APIIntegrationManager
// ========================================

import ApiService from './api/apiService.js';
import LocalStorageService from './storage/localStorage.js';
import {
  formatDate,
  truncateText,
  createElementFromData,
} from './utils/dataParser.js';
import { API_CONFIG, FALLBACK_DATA } from './api/config.js';

class APIIntegrationManager {
  constructor() {
    this.localStorage = new LocalStorageService();
    this.api = null;
    this.currentData = null;
    this.init();
  }

  async init() {
    await this.initializeAPI();
    this.setupEventListeners();
    this.loadCachedData();
    this.renderSavedCourses();
    this.setupSecurityMeasures();

    // Запуск тестирования (раскомментируйте ТОЛЬКО для демонстрации)
    /*
    setTimeout(() => {
      // Передаем 'this' (сам этот менеджер) третьим аргументом
      APITester.runAllTests(this.api, this.localStorage, this);
    }, 1500);
    */
  }

  async initializeAPI() {
    const apiConfig = API_CONFIG.educational;
    this.api = new ApiService(apiConfig.url, apiConfig.apiKey);
  }

  setupEventListeners() {
    const searchForm = document.getElementById('search-form');

    // Форма поиска — срабатывает при нажатии на кнопку или Enter
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSearch();
      });
    }

    // Остальные кнопки
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn)
      refreshBtn.addEventListener('click', () => this.refreshData());

    const clearCacheBtn = document.getElementById('clear-cache-btn');
    if (clearCacheBtn)
      clearCacheBtn.addEventListener('click', () => this.clearCache());

    window.addEventListener('online', () => {
      this.showNotification(
        'Связь восстановлена! Синхронизация данных...',
        'success'
      );
      this.refreshData();
    });

    window.addEventListener('offline', () => {
      this.showNotification(
        'Вы перешли в автономный режим. Используются локальные данные.',
        'warning'
      );
    });
  }
  async handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput ? searchInput.value.trim() : '';

    if (!query) {
      this.showError('Введите поисковый запрос');
      return;
    }

    await this.fetchData({ q: query });
  }

  async fetchData(params = {}) {
    this.showLoading(true);

    try {
      const cacheKey = `api_data_${JSON.stringify(params)}`;
      const cachedData = this.localStorage.get(cacheKey, null, 3600000);

      if (cachedData && cachedData.length > 0) {
        this.currentData = cachedData;
        this.renderData(cachedData);
        this.showNotification('Данные загружены из кэша');
        return;
      }

      const query = params.q ? params.q.trim() : 'programming';
      console.log(`→ Поиск книг по запросу: "${query}"`);

      // Запрос к Google Books API
      const response = await this.api.get('/volumes', {
        q: query,
        maxResults: 10,
        langRestrict: 'ru',
      });

      let courses = [];

      if (response && response.items && Array.isArray(response.items)) {
        courses = response.items.map((book) => ({
          id: book.id,
          title: book.volumeInfo.title,
          description: book.volumeInfo.description || 'Описание отсутствует',
          kind: 'book',
          authors: book.volumeInfo.authors || ['Неизвестный автор'],
          thumbnail: book.volumeInfo.imageLinks?.thumbnail || '',
          progress: 0,
        }));
      }

      this.currentData = courses;
      this.localStorage.set(cacheKey, courses);
      this.localStorage.set('last_api_data', courses);

      this.renderData(courses);
      this.showNotification('Данные успешно загружены');
    } catch (error) {
      this.handleAPIError(error);
    } finally {
      this.showLoading(false);
    }
  }

  handleAPIError(error) {
    console.error('API Error:', error);
    let errorMessage = 'Произошла ошибка при загрузке данных';

    if (error.message.includes('404')) {
      errorMessage = 'Запрашиваемые данные не найдены';
    } else if (error.message.includes('429')) {
      errorMessage = 'Превышен лимит запросов. Попробуйте позже';
    } else if (error.message.includes('401')) {
      errorMessage = 'Ошибка авторизации. Проверьте API ключ';
    } else if (!navigator.onLine) {
      errorMessage = 'Отсутствует подключение к интернету';
    }

    this.showError(errorMessage);
    const cachedData = this.localStorage.get('last_api_data');
    if (cachedData) {
      this.showNotification('Показаны кэшированные данные');
    }
  }

  showLoading(show = true) {
    const loader = document.getElementById('loading-indicator');
    if (loader) {
      loader.style.display = show ? 'block' : 'none';
    }
  }

  loadCachedData() {
    const lastData = this.localStorage.get('last_api_data');
    if (lastData) {
      this.currentData = lastData;
      this.renderData(lastData);
    } else {
      this.renderData(FALLBACK_DATA.courses);
    }
  }

  renderData(data) {
    const container = document.getElementById('data-container');
    if (!container) return;

    container.innerHTML = '';

    let items = Array.isArray(data) ? data : FALLBACK_DATA.courses || [];

    if (items.length > 0) {
      items.forEach((item) => {
        const element = this.createDataElement(item);
        container.appendChild(element);
      });
    } else {
      container.innerHTML = '<p class="no-data">Курсы не найдены</p>';
    }
  }

  // ==================== КРАСИВЫЕ КАРТОЧКИ ====================

  createDataElement(item) {
    const template = `
      <div class="data-item card api-course-card">
        <div class="course-image">
          ${
            item.thumbnail
              ? `<img src="${item.thumbnail}" alt="${item.title}" loading="lazy">`
              : `<div class="no-image"></div>`
          }
        </div>
        <div class="course-content">
          <h3 class="data-item__title">{{title}}</h3>
          ${
            item.authors && item.authors.length
              ? `<p class="course-authors">Автор: ${item.authors.join(', ')}</p>`
              : ''
          }
          <p class="data-item__description">{{description}}</p>
          <div class="course-meta">
            <span class="course-type">{{kind}}</span>
            <button class="btn-save" data-id="{{id}}">Сохранить в прогресс</button>
          </div>
        </div>
      </div>
    `;

    const templateData = {
      title: item.title || 'Без названия',
      description: truncateText(
        item.description || 'Описание отсутствует',
        140
      ),
      kind: item.kind || 'Книга',
      id: item.id || 'unknown',
      authors: item.authors ? item.authors.join(', ') : '',
    };

    const element = createElementFromData(templateData, template);

    const saveBtn = element.querySelector('.btn-save');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveItem(item));
    }

    return element;
  }

  createSavedElement(item) {
    const isDone = item.progress === 100;
    const template = `
      <div class="data-item card saved-course-card ${
        isDone ? 'course-item--done' : ''
      }">
        <div class="course-image">
          ${
            item.thumbnail
              ? `<img src="${item.thumbnail}" alt="${item.title}" loading="lazy">`
              : `<div class="no-image"></div>`
          }
        </div>
        <div class="course-content">
          <h3 class="data-item__title" style="${
            isDone ? 'text-decoration: line-through;' : ''
          }">{{title}}</h3>
          ${
            item.authors && item.authors.length
              ? `<p class="course-authors">Автор: ${item.authors.join(', ')}</p>`
              : ''
          }
          <p class="data-item__description">{{description}}</p>
          <div class="saved-meta">
            <span class="saved-date">Сохранён: {{savedDate}}</span>
            <div class="saved-actions">
              <button class="btn-toggle-done" data-id="{{id}}">
                ${isDone ? '↩ Вернуть' : '✓ Пройдено'}
              </button>
              <button class="btn-remove" data-id="{{id}}">Удалить</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const templateData = {
      title: item.title || 'Без названия',
      description: truncateText(
        item.description || 'Описание отсутствует',
        100
      ),
      savedDate: new Date(item.savedAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      id: item.id,
    };

    const element = createElementFromData(templateData, template);

    const removeBtn = element.querySelector('.btn-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => this.removeSavedItem(item.id));
    }

    const toggleBtn = element.querySelector('.btn-toggle-done');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () =>
        this.toggleItemProgress(item.id)
      );
    }

    return element;
  }

  toggleItemProgress(id) {
    let saved = this.localStorage.get('saved_items', []);
    const itemIndex = saved.findIndex((s) => s.id === id);

    if (itemIndex !== -1) {
      // Переключаем прогресс между 0 и 100
      saved[itemIndex].progress = saved[itemIndex].progress === 100 ? 0 : 100;
      this.localStorage.set('saved_items', saved);
      this.renderSavedCourses();
      this.showNotification(
        saved[itemIndex].progress === 100
          ? 'Курс отмечен как пройденный'
          : 'Курс возвращен в изучение'
      );
    }
  }

  saveItem(item) {
    let saved = this.localStorage.get('saved_items', []);

    const exists = saved.some((s) => s.id === item.id);
    if (exists) {
      this.showNotification('Этот курс уже сохранён!', 'warning');
      return;
    }

    saved.push({
      ...item,
      savedAt: new Date().toISOString(),
      progress: 0,
    });

    this.localStorage.set('saved_items', saved);
    this.showNotification('Курс успешно сохранён в прогресс!');
    this.renderSavedCourses();
  }

  renderSavedCourses() {
    const container = document.getElementById('saved-courses-container');
    if (!container) return;

    const savedItems = this.localStorage.get('saved_items', []);

    container.innerHTML = '';

    if (savedItems.length === 0) {
      container.innerHTML =
        '<p class="no-data">Пока нет сохранённых курсов</p>';
      return;
    }

    const title = document.createElement('h3');
    title.textContent = `Сохранённые курсы (${savedItems.length})`;
    container.appendChild(title);

    savedItems.forEach((item) => {
      const element = this.createSavedElement(item);
      container.appendChild(element);
    });
  }

  removeSavedItem(id) {
    let saved = this.localStorage.get('saved_items', []);
    saved = saved.filter((item) => item.id !== id);
    this.localStorage.set('saved_items', saved);

    this.showNotification('Курс удалён из сохранённых');
    this.renderSavedCourses();
  }

  async refreshData() {
    this.localStorage.clearExpired();
    await this.fetchData();
  }

  clearCache() {
    const keys = this.localStorage.getAllKeys();
    keys.forEach((key) => {
      if (
        ![
          'app_settings',
          'saved_items',
          'bookmarks',
          'completedLessons',
        ].includes(key)
      ) {
        this.localStorage.remove(key);
      }
    });
    this.showNotification('Кэш очищен');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed; top: 20px; right: 20px; padding: 12px 20px;
      border-radius: 4px; color: white; z-index: 1000;
      background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#4CAF50'};
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  // ========================================
  // ШАГ 5. ОБЕСПЕЧЕНИЕ БЕЗОПАСНОСТИ
  // ========================================
  setupSecurityMeasures() {
    console.log(' Инициализация мер безопасности...');
    this.checkHttpsUsage();
    this.restrictHttpMethods();
    this.secureApiKeyHandling();
  }

  checkHttpsUsage() {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.warn(' Рекомендуется использовать HTTPS для работы с API');
    } else {
      console.log(' HTTPS проверка пройдена');
    }
  }

  restrictHttpMethods() {
    const originalFetch = window.fetch;
    window.fetch = async (url, options = {}) => {
      const method = (options.method || 'GET').toUpperCase();
      if (method !== 'GET' && url.includes('googleapis.com')) {
        console.error(' Запрещён метод:', method);
        throw new Error('Only GET allowed');
      }
      console.log(`🔒 API Request: ${method} ${url}`);
      return originalFetch(url, options);
    };
  }

  secureApiKeyHandling() {
    console.log(' Google Books Public API — ключ не требуется');
  }
}

// ========================================
// ЧАСТЬ 6. ТЕСТИРОВАНИЕ И ОБРАБОТКА ОШИБОК
// ========================================

class APITester {
  static async testApiConnection(apiService, localStorageService, manager) {
    console.log(
      '%c Запуск тестирования API...',
      'color: blue; font-weight: bold'
    );

    const testScenarios = [
      { name: 'Успешный запрос', params: { q: 'javascript' } },
      { name: 'Запрос с параметрами', params: { q: 'python', maxResults: 5 } },
      { name: 'Неверный запрос', params: { q: 'абвгдеёжз' } },
    ];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (const scenario of testScenarios) {
      try {
        await sleep(1500);

        console.log(`\n Тестируем: ${scenario.name}`);
        const result = await apiService.get('/volumes', scenario.params);
        console.log('  SUCCESS:', scenario.name);
      } catch (error) {
        console.error(`  ERROR в сценарии "${scenario.name}":`, error.message);

        if (error.message.includes('429')) {
          manager.showNotification(
            'Тест: Превышен лимит запросов (429)',
            'warning'
          );
        }

        const fallback =
          localStorageService.get('last_api_data') || FALLBACK_DATA.courses;
        manager.renderData(fallback);

        if (error.message.includes('429')) break;
      }
    }
  }

  static testOfflineFunctionality(localStorageService) {
    console.log(
      '%c Тестирование LocalStorage...',
      'color: blue; font-weight: bold'
    );
    const testData = { test: 'offline_data', message: 'Тест offline' };
    localStorageService.set('offline_test', testData);
    const retrieved = localStorageService.get('offline_test');

    if (retrieved && retrieved.test === 'offline_data') {
      console.log('  PASS: LocalStorage работает корректно');
    } else {
      console.log('  FAIL: Проблема с LocalStorage');
    }
    localStorageService.remove('offline_test');
  }

  static runAllTests(apiService, localStorageService, manager) {
    console.log(
      '%c ЗАПУСК ПОЛНОГО ТЕСТИРОВАНИЯ',
      'color: purple; font-weight: bold'
    );

    this.testApiConnection(apiService, localStorageService, manager);
    this.testOfflineFunctionality(localStorageService);
  }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
  window.appManager = new APIIntegrationManager();
});
