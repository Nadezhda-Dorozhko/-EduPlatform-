// ================================================================================
// ПОЛНЫЙ ИСПРАВЛЕННЫЙ КОД script.js
// Лабораторная работа - Вариант 8: Образовательная платформа EduPlatform
// ================================================================================

// ========================================
// ИМПОРТЫ
// ========================================
import ApiService from './api/apiService.js';
import { API_CONFIG } from './api/config.js';
import LocalStorageService from './storage/localStorage.js';

// ========================================
// ГЛАВНЫЙ КЛАСС ДЛЯ РАБОТЫ С API
// ========================================
class APIIntegrationManager {
  constructor() {
    this.localStorage = new LocalStorageService(); // Создаем сервис для работы с localStorage
    this.api = null; // Здесь будет храниться экземпляр ApiService
    this.currentData = null; // Текущие загруженные данные
    this.init(); // Запускаем инициализацию
  }

  // ========================================
  // ИНИЦИАЛИЗАЦИЯ
  // ========================================
  async init() {
    console.log('🚀 Запуск EduPlatform...');
    await this.initializeAPI(); // Настраиваем API
    this.setupEventListeners(); // Добавляем обработчики событий
    this.setupOfflineSync(); // Настраиваем синхронизацию
  }

  // ========================================
  // НАСТРОЙКА API
  // ========================================
  async initializeAPI() {
    const config = API_CONFIG.education;
    this.api = new ApiService(config.url, config.apiKey);
    console.log('✅ API инициализирован:', config.url);
  }

  // ========================================
  // ОБРАБОТЧИКИ СОБЫТИЙ
  // ========================================
  setupEventListeners() {
    // Форма поиска курсов
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Отменяем перезагрузку страницы
        this.handleSearch(); // Вызываем метод поиска
      });
      console.log('✅ Форма поиска подключена');
    } else {
      console.warn('⚠️ Форма поиска не найдена');
    }
  }

  // ========================================
  // НАСТРОЙКА СИНХРОНИЗАЦИИ
  // ========================================
  setupOfflineSync() {
    // Когда интернет появляется
    window.addEventListener('online', () => {
      console.log('🌐 Интернет восстановлен');
      alert('✅ Соединение восстановлено!');
      this.syncProgress();
    });

    // Когда интернет пропадает
    window.addEventListener('offline', () => {
      console.log('📵 Интернет отключен');
      alert('⚠️ Работаем в автономном режиме');
    });
  }

  // ========================================
  // ОБРАБОТКА ПОИСКА
  // ========================================
  async handleSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();

    // Проверка на пустой запрос
    if (!query) {
      alert('⚠️ Введите поисковый запрос');
      return;
    }

    console.log('🔍 Ищем курсы по запросу:', query);
    await this.fetchData({ q: query });
  }

  // ========================================
  // ЗАГРУЗКА ДАННЫХ ИЗ API С КЭШИРОВАНИЕМ
  // ========================================
  async fetchData(params = {}) {
    console.log('📦 Начинаем загрузку данных...');

    try {
      // =====================
      // 1️⃣ ПРОВЕРКА КЭША
      // =====================
      const cacheKey = `api_data_${JSON.stringify(params)}`;
      const cachedData = this.localStorage.get(cacheKey);

      if (cachedData) {
        console.log('✅ Данные найдены в кэше');
        this.currentData = cachedData;
        this.renderData(cachedData);
        alert('✅ Данные загружены из кэша (быстрая загрузка)');
        return;
      }

      // =====================
      // 2️⃣ ЗАПРОС К API
      // =====================
      console.log('📡 Отправляем запрос к API Open Library...');
      const data = await this.api.get('/search.json', params);
      console.log('📥 Получены данные от API:', data);

      // =====================
      // 3️⃣ ОБРАБОТКА ДАННЫХ
      // =====================
      const processedData = this.processEducationData(data);
      console.log('✅ Обработано курсов:', processedData.length);

      // =====================
      // 4️⃣ СОХРАНЕНИЕ В КЭШ
      // =====================
      this.localStorage.set(cacheKey, processedData);
      this.localStorage.set('last_api_data', processedData);
      this.localStorage.set('last_api_call', new Date().toISOString());
      console.log('💾 Данные сохранены в кэш');

      // =====================
      // 5️⃣ ПОКАЗ ДАННЫХ
      // =====================
      this.currentData = processedData;
      this.renderData(processedData);
      alert('✅ Курсы успешно загружены!');
    } catch (error) {
      // =====================
      // ОБРАБОТКА ОШИБОК
      // =====================
      console.error('❌ Ошибка загрузки данных:', error);
      alert(
        '❌ Не удалось загрузить курсы. Проверьте подключение к интернету.'
      );

      // Показываем кэшированные данные, если есть
      const lastData = this.localStorage.get('last_api_data');
      if (lastData) {
        console.log('📋 Показываем последние кэшированные данные');
        this.renderData(lastData);
      }
    }
  }

  // ========================================
  // ОБРАБОТКА ДАННЫХ ОТ API
  // ========================================
  processEducationData(data) {
    // Проверяем наличие данных
    if (!data || !data.docs) {
      console.warn('⚠️ Нет данных от API');
      return [];
    }

    // Берем первые 6 результатов и преобразуем в нужный формат
    return data.docs.slice(0, 6).map((item) => ({
      id: item.key || 'course_' + Math.random(),
      title: item.title || 'Без названия',
      description: item.first_sentence?.[0] || 'Описание отсутствует',
      author: item.author_name?.[0] || 'Автор неизвестен',
      publishYear: item.first_publish_year || 'Год неизвестен',
      subject: item.subject?.[0] || 'general',
      coverId: item.cover_i, // ID обложки для картинки
    }));
  }

  // ========================================
  // ОТОБРАЖЕНИЕ ДАННЫХ НА СТРАНИЦЕ
  // ========================================
  renderData(data) {
    const container = document.getElementById('data-container');

    if (!container) {
      console.error('❌ Контейнер #data-container не найден');
      return;
    }

    // Очищаем контейнер
    container.innerHTML = '';

    // Проверка на пустые данные
    if (!data || data.length === 0) {
      container.innerHTML = `
        <p style="text-align: center; color: #999; padding: 40px;">
          Курсы не найдены. Попробуйте другой запрос.
        </p>
      `;
      return;
    }

    // Добавляем заголовок
    const title = document.createElement('h2');
    title.textContent = `Найдено курсов: ${data.length}`;
    title.style.cssText =
      'grid-column: 1 / -1; margin-bottom: 20px; color: #1f2937;';
    container.appendChild(title);

    // Настраиваем grid для карточек
    container.style.cssText = `
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
    `;

    // Создаем карточки курсов
    data.forEach((item) => {
      const card = this.createCourseCard(item);
      container.appendChild(card);
    });

    console.log('✅ Отображено курсов:', data.length);
  }

  // ========================================
  // СОЗДАНИЕ КАРТОЧКИ КУРСА
  // ========================================
  createCourseCard(item) {
    const card = document.createElement('div');
    card.className = 'course-card';

    // Стили карточки
    card.style.cssText = `
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    `;

    // URL обложки книги (если есть)
    const coverUrl = item.coverId
      ? `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg`
      : '';

    // HTML содержимое карточки
    card.innerHTML = `
      ${
        coverUrl
          ? `
        <img 
          src="${coverUrl}" 
          alt="${item.title}" 
          style="
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 6px;
            margin-bottom: 15px;
          "
          onerror="this.style.display='none'"
        >
      `
          : ''
      }
      
      <h3 style="
        color: #7c3aed;
        margin-bottom: 10px;
        font-size: 1.1rem;
        font-weight: 600;
      ">
        ${item.title}
      </h3>
      
      <p style="
        color: #6b7280;
        font-size: 0.9rem;
        margin-bottom: 10px;
        line-height: 1.5;
      ">
        ${item.description.substring(0, 150)}${item.description.length > 150 ? '...' : ''}
      </p>
      
      <div style="
        margin-top: 15px;
        padding-top: 15px;
        border-top: 1px solid #e5e7eb;
      ">
        <small style="
          color: #9ca3af;
          display: block;
          margin-bottom: 5px;
        ">
          👤 ${item.author}
        </small>
        
        <small style="
          color: #9ca3af;
          display: block;
          margin-bottom: 15px;
        ">
          📅 ${item.publishYear}
        </small>
        
        <button 
          class="save-course-btn" 
          data-id="${item.id}"
          style="
            width: 100%;
            padding: 10px;
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: background 0.2s;
          "
        >
          💾 Сохранить в прогресс
        </button>
      </div>
    `;

    // Добавляем hover эффекты
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });

    // Обработчик кнопки сохранения
    const saveBtn = card.querySelector('.save-course-btn');
    saveBtn.addEventListener('click', () => {
      this.saveItem(item);
    });

    // Hover для кнопки
    saveBtn.addEventListener('mouseenter', () => {
      saveBtn.style.background = '#5b21b6';
    });

    saveBtn.addEventListener('mouseleave', () => {
      saveBtn.style.background = '#7c3aed';
    });

    return card;
  }

  // ========================================
  // СОХРАНЕНИЕ КУРСА В ПРОГРЕСС
  // ========================================
  saveItem(item) {
    const savedItems = this.localStorage.get('saved_items', []);

    // Проверяем, не сохранен ли уже этот курс
    const exists = savedItems.find((saved) => saved.id === item.id);
    if (exists) {
      alert('ℹ️ Этот курс уже в вашем прогрессе!');
      return;
    }

    // Добавляем курс с дополнительными данными
    savedItems.push({
      ...item,
      savedAt: new Date().toISOString(),
      progress: 0,
      needsSync: !navigator.onLine, // Помечаем для синхронизации если offline
    });

    this.localStorage.set('saved_items', savedItems);
    console.log('✅ Курс сохранен:', item.title);
    alert(`✅ Курс "${item.title}" добавлен в прогресс обучения!`);

    // Обновляем отображение сохраненных курсов
    this.displaySavedCourses();
  }

  // ========================================
  // ОТОБРАЖЕНИЕ СОХРАНЕННЫХ КУРСОВ
  // ========================================
  displaySavedCourses() {
    const container = document.getElementById('saved-courses-container');
    if (!container) return;

    const savedItems = this.localStorage.get('saved_items', []);

    container.innerHTML = '';

    if (savedItems.length === 0) {
      container.innerHTML = `
        <p style="color: #999; text-align: center; padding: 20px;">
          Нет сохраненных курсов
        </p>
      `;
      return;
    }

    // Заголовок
    const title = document.createElement('h2');
    title.textContent = 'Мои сохраненные курсы';
    title.style.cssText = 'margin-bottom: 20px; color: #1f2937;';
    container.appendChild(title);

    // Список курсов
    savedItems.forEach((item) => {
      const div = document.createElement('div');
      div.style.cssText = `
        padding: 15px;
        margin-bottom: 10px;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        background: ${item.needsSync ? '#fff3cd' : '#f0fdf4'};
      `;

      div.innerHTML = `
        <strong>${item.title}</strong>
        <br>
        <small>Сохранено: ${new Date(item.savedAt).toLocaleDateString('ru-RU')}</small>
        ${item.needsSync ? '<br><small style="color: #f59e0b;">⚠️ Требует синхронизации</small>' : ''}
      `;

      container.appendChild(div);
    });

    console.log('✅ Отображено сохраненных курсов:', savedItems.length);
  }

  // ========================================
  // СИНХРОНИЗАЦИЯ ПРИ ВОССТАНОВЛЕНИИ СЕТИ
  // ========================================
  async syncProgress() {
    const savedItems = this.localStorage.get('saved_items', []);
    const itemsNeedingSync = savedItems.filter((item) => item.needsSync);

    if (itemsNeedingSync.length === 0) {
      console.log('ℹ️ Нет данных для синхронизации');
      return;
    }

    console.log('🔄 Синхронизируем', itemsNeedingSync.length, 'элементов...');

    // Убираем флаг needsSync
    const updatedItems = savedItems.map((item) => ({
      ...item,
      needsSync: false,
      syncedAt: new Date().toISOString(),
    }));

    this.localStorage.set('saved_items', updatedItems);

    console.log('✅ Синхронизация завершена');
    alert(`✅ Синхронизировано курсов: ${itemsNeedingSync.length}`);

    // Обновляем отображение
    this.displaySavedCourses();
  }
}

// ================================================================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ================================================================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('📚 Инициализация EduPlatform...');
  const manager = new APIIntegrationManager();

  // Показываем сохраненные курсы при загрузке
  setTimeout(() => {
    manager.displaySavedCourses();
  }, 500);
});

// ================================================================================
// СУЩЕСТВУЮЩИЙ КОД (закладки, прогресс, тесты)
// Оставляем как есть - он работает правильно
// ================================================================================

console.log('📋 Загрузка остального функционала...');

// Поиск элементов
const header = document.querySelector('.header');
const allCards = document.querySelectorAll('.course-card');
const mainContainer = document.querySelector('.main');

// Кнопка "Начать обучение"
const heroButton = document.querySelector('.hero__button');
if (heroButton) {
  heroButton.addEventListener('click', function (event) {
    event.preventDefault();
    const coursesSection = document.querySelector('.courses');
    if (coursesSection) {
      coursesSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// Форма подписки
const newsletterForm = document.querySelector('.newsletter__form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    alert('✅ Вы успешно подписались на новости!');
  });
}

// Прогресс-бар уроков
const lessons = document.querySelectorAll('.lesson-item');
const progressFill = document.querySelector('.progress-bar__fill');
const progressLabel = document.querySelector('.progress-bar__label');
const totalLessons = lessons.length;

function updateProgressBar() {
  const count = document.querySelectorAll('.lesson-item--done').length;
  const percent =
    totalLessons > 0 ? Math.round((count / totalLessons) * 100) : 0;
  if (progressFill) progressFill.style.width = percent + '%';
  if (progressLabel)
    progressLabel.textContent =
      count + ' из ' + totalLessons + ' уроков пройдено';
}

// Восстановление прогресса
const completedIds = JSON.parse(
  localStorage.getItem('completedLessons') || '[]'
);
lessons.forEach(function (lesson) {
  const lessonId = lesson.dataset.lesson;
  if (completedIds.includes(lessonId)) {
    lesson.classList.add('lesson-item--done');
  }
});

updateProgressBar();

// Клик по уроку
lessons.forEach(function (lesson) {
  lesson.addEventListener('click', function (event) {
    if (event.target.classList.contains('bookmark-btn')) return;

    const lessonId = this.dataset.lesson;
    const completedIds = JSON.parse(
      localStorage.getItem('completedLessons') || '[]'
    );

    if (!this.classList.contains('lesson-item--done')) {
      this.classList.add('lesson-item--done');
      completedIds.push(lessonId);
    } else {
      this.classList.remove('lesson-item--done');
      const idx = completedIds.indexOf(lessonId);
      if (idx !== -1) completedIds.splice(idx, 1);
    }

    localStorage.setItem('completedLessons', JSON.stringify(completedIds));
    updateProgressBar();
  });
});

// Закладки
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

  if (count) count.textContent = '(' + bookmarks.length + ')';

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
        '">✕</button>' +
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

updateBookmarkButtons();
renderBookmarksPanel();

document.addEventListener('click', function (event) {
  if (event.target.classList.contains('bookmark-btn')) {
    const id = event.target.dataset.id;
    const index = bookmarks.indexOf(id);

    if (index === -1) {
      bookmarks.push(id);
    } else {
      bookmarks.splice(index, 1);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButtons();
    renderBookmarksPanel();
  }

  if (event.target.classList.contains('bookmarks-list__remove')) {
    const id = event.target.dataset.id;
    bookmarks = bookmarks.filter((b) => b !== id);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    updateBookmarkButtons();
    renderBookmarksPanel();
  }
});

// Тест
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
      if (selected === correct) score++;
    });

    const result = document.querySelector('.quiz-result');
    if (result) {
      result.textContent =
        'Результат: ' + score + ' из ' + Object.keys(answers).length;
    }
  });
}

console.log('✅ EduPlatform полностью загружена!');
