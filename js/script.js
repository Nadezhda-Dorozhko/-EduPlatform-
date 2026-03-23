// ========================================
// 1. ПОИСК ЭЛЕМЕНТОВ (демонстрация для лаб. работы)
// ========================================
const header = document.querySelector('.header');
const allCards = document.querySelectorAll('.course-card');
const mainContainer = document.querySelector('.main');

console.log('Найдено элементов:', {
  '.header': header,
  '.cards': allCards,
  '.container': mainContainer
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
  heroButton.addEventListener('click', function(event) {
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
  searchInput.addEventListener('input', function(event) {
    console.log('Введен текст:', event.target.value);
  });
}

// Форма подписки
const newsletterForm = document.querySelector('.newsletter__form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    console.log('Данные формы:', Object.fromEntries(formData));
  });
}

// ========================================
// 5. ДЕЛЕГИРОВАНИЕ СОБЫТИЙ — карточки курсов
// Кнопка "Подробнее" показывает детали, НЕ скрывает карточку
// ========================================
document.querySelector('.courses').addEventListener('click', function(event) {
  if (event.target.classList.contains('course-card__button')) {
    event.preventDefault();
    const card = event.target.closest('.course-card');
    const title = card.querySelector('.course-card__title').textContent;
    console.log('Открыт курс:', title);

    // Убираем выделение со всех карточек
    document.querySelectorAll('.course-card').forEach(function(c) {
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
const completedIds = JSON.parse(localStorage.getItem('completedLessons') || '[]');

// Восстанавливаем визуальное состояние уроков
lessons.forEach(function(lesson) {
  const lessonId = lesson.dataset.lesson;
  if (completedIds.includes(lessonId)) {
    lesson.classList.add('lesson-item--done');
  }
});

// Обновляем прогресс-бар при загрузке
updateProgressBar();

function updateProgressBar() {
  const count = document.querySelectorAll('.lesson-item--done').length;
  const percent = totalLessons > 0 ? Math.round((count / totalLessons) * 100) : 0;
  progressFill.style.width = percent + '%';
  progressLabel.textContent = count + ' из ' + totalLessons + ' уроков пройдено';
}

lessons.forEach(function(lesson) {
  lesson.addEventListener('click', function(event) {
    // Клик по кнопке закладки внутри урока — не переключаем прогресс
    if (event.target.classList.contains('bookmark-btn')) return;

    const lessonId = this.dataset.lesson;
    const completedIds = JSON.parse(localStorage.getItem('completedLessons') || '[]');

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
    localStorage.setItem('progress', document.querySelectorAll('.lesson-item--done').length);
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
    list.innerHTML = '<li class="bookmarks-list__empty">Нет сохранённых закладок</li>';
    return;
  }

  list.innerHTML = bookmarks.map(function(id) {
    const label = BOOKMARK_LABELS[id] || id;
    return '<li class="bookmarks-list__item">' +
      '<span>' + label + '</span>' +
      '<button class="bookmarks-list__remove" data-id="' + id + '" aria-label="Удалить закладку">✕</button>' +
      '</li>';
  }).join('');
}

function updateBookmarkButtons() {
  document.querySelectorAll('.bookmark-btn').forEach(function(btn) {
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
document.addEventListener('click', function(event) {
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
    bookmarks = bookmarks.filter(function(b) { return b !== id; });
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
  quizForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const answers = { q1: 'b', q2: 'c', q3: 'a' };
    let score = 0;
    const formData = new FormData(this);

    Object.keys(answers).forEach(function(question) {
      const correct = answers[question];
      const selected = formData.get(question);
      const options = document.querySelectorAll('input[name="' + question + '"]');

      options.forEach(function(option) {
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
    result.textContent = 'Результат: ' + score + ' из ' + Object.keys(answers).length;
    console.log('Результат теста:', score);
  });
}

// ========================================
// 9. ВАЛИДАЦИЯ ФОРМЫ ПОДПИСКИ
// ========================================
const emailInput = document.querySelector('#email');

if (emailInput) {
  emailInput.addEventListener('blur', function() {
    clearErrors(this);
    if (this.value && !validateEmail(this.value)) {
      showError(this, 'Введите корректный email');
    }
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener('submit', function(event) {
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