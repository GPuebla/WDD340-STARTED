const toggleBtn = document.getElementById('menu-toggle');
const navList = document.getElementById('nav-list');

toggleBtn.addEventListener('click', () => {
  navList.classList.toggle('show');
});