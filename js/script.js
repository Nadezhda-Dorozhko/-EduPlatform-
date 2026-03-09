// Сообщение в консоли
console.log('JavaScript подключен успешно');

// Приветственное сообщение
alert('Добро пожаловать!');
const burger = document.querySelector('.header__burger');
const nav = document.querySelector('.header__nav');

if (burger && nav) {
  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', isOpen);
  });
}
