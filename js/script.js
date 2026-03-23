// Различные методы поиска элементов
const header = document.querySelector('.header');
const allCards = document.querySelectorAll('.course-card');
const mainContainer = document.getElementById('main-container');

console.log('Найдено элементов:', {
  '.header': header,
  '.cards': allCards,
  '.container': mainContainer
});

// Манипуляция контентом
const projectTitle = document.querySelector('.header__logo a');
projectTitle.textContent = 'EduPlatform';

// Изменение HTML содержимого
const mainContent = document.querySelector('.hero');
mainContent.innerHTML += '<div class="notification">Добро пожаловать на платформу!</div>';

// Создание новых элементов
const newButton = document.createElement('button');
newButton.className = 'btn btn--primary';
newButton.textContent = 'Начать обучение';
document.querySelector('.header__container').appendChild(newButton);

// Добавление/удаление классов
const card = document.querySelector('.course-card');
card.classList.add('card--highlighted');
card.classList.remove('card--default');

// Изменение стилей напрямую
card.style.transform = 'scale(1.05)';
card.style.transition = 'all 0.3s ease';

// Установка нескольких стилей
Object.assign(card.style, {
  backgroundColor: '#f0f0f0',
  padding: '20px',
  borderRadius: '8px'
});


// Обработчик клика
const button = document.querySelector('.hero__button');
button.addEventListener('click', function(event) {
  event.preventDefault();
  console.log('Кнопка нажата!');
});

// Обработчик ввода в поле
const searchInput = document.querySelector('.header__search input');
searchInput.addEventListener('input', function(event) {
  console.log('Введен текст:', event.target.value);
});

// Обработчик отправки формы
const contactForm = document.querySelector('.newsletter__form');
contactForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(this);
  console.log('Данные формы:', Object.fromEntries(formData));
});

// Делегирование событий для динамически добавляемых элементов
document.querySelector('.courses__grid').addEventListener('click', function(event) {
  if (event.target.classList.contains('course-card__btn')) {
    const card = event.target.closest('.course-card');
    card.style.display = 'none';
    console.log('Карточка скрыта');
  }
});


// Прогресс-бар прохождения курса
const lessons = document.querySelectorAll('.lesson-item');
const progressFill = document.querySelector('.progress-bar__fill');
const progressLabel = document.querySelector('.progress-bar__label');

let completedCount = 0;
const totalLessons = lessons.length;

lessons.forEach(function(lesson) {
  lesson.addEventListener('click', function() {
    if (!this.classList.contains('lesson-item--done')) {
      this.classList.add('lesson-item--done');
      completedCount++;

      const percent = Math.round((completedCount / totalLessons) * 100);
      progressFill.style.width = percent + '%';
      progressLabel.textContent = completedCount + ' из ' + totalLessons + ' уроков пройдено';

      console.log('Прогресс:', percent + '%');

      localStorage.setItem('progress', completedCount);
    }
  });
});

// Система закладок для уроков
const bookmarkButtons = document.querySelectorAll('.bookmark-btn');

let bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

bookmarkButtons.forEach(function(btn) {
  const lessonId = btn.dataset.id;

  if (bookmarks.includes(lessonId)) {
    btn.classList.add('bookmark-btn--active');
  }

  btn.addEventListener('click', function() {
    const id = this.dataset.id;
    const index = bookmarks.indexOf(id);

    if (index === -1) {
      bookmarks.push(id);
      this.classList.add('bookmark-btn--active');
      console.log('Добавлено в закладки:', id);
    } else {
      bookmarks.splice(index, 1);
      this.classList.remove('bookmark-btn--active');
      console.log('Удалено из закладок:', id);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    console.log('Все закладки:', bookmarks);
  });
});

// Тест с проверкой ответов
const quizForm = document.querySelector('.quiz-form');

quizForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const answers = {
    q1: 'b',
    q2: 'c',
    q3: 'a'
  };

  let score = 0;
  const formData = new FormData(this);

  for (const [question, correct] of Object.entries(answers)) {
    const selected = formData.get(question);
    const options = document.querySelectorAll('input[name="' + question + '"]');

    options.forEach(function(option) {
      const label = option.closest('label') || option.parentNode;
      if (option.value === correct) {
        label.style.color = 'green';
      } else if (option.value === selected && selected !== correct) {
        label.style.color = 'red';
      }
    });

    if (selected === correct) {
      score++;
    }
  }

  const result = document.querySelector('.quiz-result');
  result.textContent = 'Результат: ' + score + ' из ' + Object.keys(answers).length;
  console.log('Результат теста:', score);
});

// Валидация формы подписки
const emailInput = document.querySelector('#email');

emailInput.addEventListener('blur', function() {
  clearErrors(this);
  if (!validateEmail(this.value)) {
    showError(this, 'Введите корректный email');
  }
});

document.querySelector('.newsletter__form').addEventListener('submit', function(event) {
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
});