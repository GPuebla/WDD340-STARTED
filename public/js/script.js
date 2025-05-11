const toggleBtn = document.getElementById('menu-toggle');
const navList = document.getElementById('nav-list');

toggleBtn.addEventListener('click', () => {
    console.log("TEST");
  navList.classList.toggle('show');
});