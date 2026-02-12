document.addEventListener("DOMContentLoaded", () => {
  // 1. Auth Check
  const loggedInUser = sessionStorage.getItem('loggedInUser');
  if (!loggedInUser) {
      // Allow staying on page if it's public (unlikely for this folder)
      // But for safety, redirect
      console.warn("No user logged in, redirecting...");
      window.location.href = '../../login.html'; 
  } else {
      const userDisplay = document.getElementById('userDisplay');
      if (userDisplay) userDisplay.textContent = loggedInUser;
  }

  const ensureSidebarToggle = () => {
    let toggle = document.getElementById('sidebarToggle');
    if (toggle) return toggle;

    toggle = document.createElement('button');
    toggle.id = 'sidebarToggle';
    toggle.className = 'sidebar-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Toggle navigation');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<i class="fas fa-bars"></i>';

    const header = document.querySelector('.main-content > header');
    if (header) {
      header.prepend(toggle);
      return toggle;
    }

    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.prepend(toggle);
      return toggle;
    }

    document.body.prepend(toggle);
    return toggle;
  };

  // 2. Load Sidebar
  fetch("sidebar.html")
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById("sidebar-container");
      if (container) {
          container.innerHTML = html;
          
          // Highlight active link
          const currentFile = window.location.pathname.split('/').pop();
          const links = container.querySelectorAll('a');
          links.forEach(link => {
              if (link.getAttribute('href') === currentFile) {
                  link.classList.add('active');
                  link.setAttribute('aria-current', 'page');
              }
          });

          const sidebar = container.querySelector('.sidebar');
          if (sidebar) {
            if (!sidebar.id) sidebar.id = 'sidebar';
            sidebar.setAttribute('role', 'navigation');
            sidebar.setAttribute('aria-label', 'Office Incharge Navigation');
          }

          const sidebarToggle = sidebar ? ensureSidebarToggle() : null;
          if (sidebarToggle && sidebar) {
            sidebarToggle.setAttribute('aria-controls', sidebar.id);
            sidebarToggle.addEventListener('click', () => {
              const isActive = sidebar.classList.toggle('active');
              sidebarToggle.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            });

            links.forEach((link) => {
              link.addEventListener('click', () => {
                if (sidebar.classList.contains('active')) {
                  sidebar.classList.remove('active');
                  sidebarToggle.setAttribute('aria-expanded', 'false');
                }
              });
            });

            document.addEventListener('keydown', (e) => {
              if (e.key !== 'Escape') return;
              if (!sidebar.classList.contains('active')) return;
              sidebar.classList.remove('active');
              sidebarToggle.setAttribute('aria-expanded', 'false');
            });
          }
      }
    })
    .catch(err => console.error("Sidebar load failed", err));
});

// 3. Global Logout Function
window.logout = function() {
    if(confirm("Are you sure you want to logout?")) {
        sessionStorage.clear();
        window.location.href = '../../login.html';
    }
};
