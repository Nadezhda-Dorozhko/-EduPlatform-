export const API_CONFIG = {
  education: {
    url: 'https://openlibrary.org',
    apiKey: null,
    endpoints: {
      search: '/search.json',
      subjects: '/subjects',
    },
  },
};

export const FALLBACK_DATA = {
  education: [
    {
      title: 'Введение в программирование',
      description: 'Базовый курс программирования',
      subject: 'programming',
      id: 'course_1',
    },
  ],
};
