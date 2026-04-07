// Конфигурация API — Вариант 8 (EduPlatform)
export const API_CONFIG = {
  educational: {
    url: 'https://www.googleapis.com/books/v1',
    apiKey: '', // ключ не обязателен для поиска
    endpoints: {
      search: '/volumes', // основной эндпоинт для поиска
      courses: '/volumes',
    },
  },
};

// Тестовые данные (на случай проблем)
export const FALLBACK_DATA = {
  courses: [
    {
      id: 'fallback1',
      title: 'JavaScript для начинающих',
      description:
        'Полный курс современного JavaScript от основ до продвинутых тем',
      kind: 'book',
      authors: ['MDN Web Docs'],
    },
    {
      id: 'fallback2',
      title: 'HTML и CSS. Разработка сайтов',
      description:
        'Практическое руководство по созданию современных веб-сайтов',
      kind: 'book',
      authors: ['Jon Duckett'],
    },
    {
      id: 'fallback3',
      title: 'Математика для программистов',
      description: 'Математические основы, необходимые разработчику',
      kind: 'book',
      authors: ['Практика'],
    },
  ],
};
