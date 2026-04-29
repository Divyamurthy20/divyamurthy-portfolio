const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-link")];
const revealNodes = [...document.querySelectorAll(".reveal")];
const yearTarget = document.getElementById("year");
const images = [...document.querySelectorAll("img")];
const scrollProgress = document.getElementById("scroll-progress");
const header = document.querySelector(".site-header");
const mobileMenuButton = document.getElementById("mobile-menu-btn");
const mobileNav = document.getElementById("mobile-nav");
const mobileNavLinks = mobileNav ? [...mobileNav.querySelectorAll("a")] : [];
const typedRoleTarget = document.getElementById("typed-role");

const typedRoles = [
  "AI/ML Engineer",
  "Computer Vision Engineer",
   "Generative AI Engineer",
];

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  {
    threshold: 0.18,
  }
);

revealNodes.forEach((node) => revealObserver.observe(node));

images.forEach((image) => {
  const markMissing = () => {
    image.style.display = "none";
    const parent = image.parentElement;
    if (parent) {
      parent.classList.add("image-missing");
    }
  };

  image.addEventListener("error", markMissing);

  if (image.complete && image.naturalWidth === 0) {
    markMissing();
  }
});

if (navLinks.length && sections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    {
      threshold: 0.35,
      rootMargin: "-10% 0px -50% 0px",
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const updateScrollUi = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  if (scrollProgress) {
    scrollProgress.style.width = `${Math.min(progress, 100)}%`;
  }

  if (header) {
    header.classList.toggle("is-scrolled", scrollTop > 20);
  }
};

updateScrollUi();
window.addEventListener("scroll", updateScrollUi, { passive: true });

if (mobileMenuButton && mobileNav) {
  const setMenuState = (open) => {
    mobileMenuButton.classList.toggle("is-open", open);
    mobileMenuButton.setAttribute("aria-expanded", String(open));
    mobileNav.classList.toggle("is-open", open);
  };

  mobileMenuButton.addEventListener("click", () => {
    const isOpen = mobileMenuButton.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuState(false));
  });
}

if (typedRoleTarget) {
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const typeRole = () => {
    const currentRole = typedRoles[roleIndex];

    charIndex += isDeleting ? -1 : 1;
    typedRoleTarget.textContent = currentRole.slice(0, charIndex);

    let delay = isDeleting ? 50 : 95;

    if (!isDeleting && charIndex === currentRole.length) {
      delay = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % typedRoles.length;
      delay = 280;
    }

    window.setTimeout(typeRole, delay);
  };

  typeRole();
}
const viewMoreBtn = document.getElementById("view-more-btn");
const hiddenProjects = document.querySelectorAll(".hidden-project");

if (viewMoreBtn) {
  let isExpanded = false;

  viewMoreBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;

    hiddenProjects.forEach((project) => {
      project.style.display = isExpanded ? "block" : "none";
    });

    viewMoreBtn.textContent = isExpanded
      ? "Show Less"
      : "View More Projects";
  });
}