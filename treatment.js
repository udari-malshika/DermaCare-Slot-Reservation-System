const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('customerName')?.value.trim() || 'Guest';
    const treatment = document.getElementById('treatmentSelect')?.value || 'Selected treatment';
    const message = document.getElementById('bookingMessage');

    if (message) {
      message.textContent = `Thank you, ${name}. Your ${treatment} appointment request has been received.`;
      message.style.color = '#f6dce7';
    }

    bookingForm.reset();
  });
}
