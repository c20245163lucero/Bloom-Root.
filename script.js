gsap.registerPlugin(ScrollTrigger);

const darkModeToggle = document.getElementById("darkModeToggle");
const savedTheme = localStorage.getItem("bloom-root-theme");

if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
} else if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}

function updateThemeButton() {
    const isDark = document.documentElement.classList.contains("dark");

    darkModeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    darkModeToggle.setAttribute("aria-pressed", String(isDark));
    darkModeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

darkModeToggle.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");

    const selectedTheme =
        document.documentElement.classList.contains("dark")
            ? "dark"
            : "light";

    localStorage.setItem("bloom-root-theme", selectedTheme);
    updateThemeButton();
});

updateThemeButton();

// MOBILE NAVIGATION
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navLinks = document.getElementById("navLinks");

mobileMenuToggle.addEventListener("click", () => {
    const isExpanded =
        mobileMenuToggle.getAttribute("aria-expanded") === "true";

    mobileMenuToggle.setAttribute("aria-expanded", String(!isExpanded));
    navLinks.classList.toggle("hidden", isExpanded);
    navLinks.classList.toggle("flex", !isExpanded);
    mobileMenuToggle.textContent = isExpanded ? "Menu" : "Close";
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.add("hidden");
        navLinks.classList.remove("flex");
        mobileMenuToggle.setAttribute("aria-expanded", "false");
        mobileMenuToggle.textContent = "Menu";
    });
});

const reduceMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

const introTimeline = gsap.timeline({
    paused: true,
    defaults: {
        duration: 0.45,
        ease: "power2.out"
    }
});


introTimeline
    .from("#heroLabel", {
        y: 25,
        opacity: 0
    })
    .from("#heroTitle", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out"
    }, "-=0.3")
    .from("#heroDescription", {
        y: 20,
        opacity: 0
    }, "-=0.3")
    .from("#heroActions a", {
        y: 18,
        opacity: 0,
        stagger: 0.1,
        duration: 0.35
    }, "-=0.2")
    .from("#heroArtwork", {
        scale: 0.96,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.2)"
    }, "-=0.4");

if (reduceMotionQuery.matches) {
    // Keep all hero content visible for visitors who prefer reduced motion.
    introTimeline.progress(1).pause();
} else {
    introTimeline.play();
}

// D3: REPLAY INTRO BUTTON
const replayBtn = document.getElementById("replayBtn");

replayBtn.addEventListener("click", () => {
    if (reduceMotionQuery.matches) {
        introTimeline.progress(1).pause();
        return;
    }

    introTimeline.restart();
});

// E1 + E2 + E3: SCROLL REVEALS AND PROGRESS BAR
const motionContext = gsap.matchMedia();

motionContext.add(
    "(prefers-reduced-motion: no-preference)",
    () => {
        // Every section after the hero uses its own ScrollTrigger.
        gsap.utils.toArray(".reveal").forEach((section) => {
            gsap.from(section, {
                y: 36,
                opacity: 0,
                duration: 0.7,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 84%",
                    toggleActions: "play none none reverse"
                }
            });
        });

        // The progress bar follows page scrolling without easing.
        gsap.to("#progressBar", {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
                trigger: document.documentElement,
                start: "top top",
                end: "bottom bottom",
                scrub: true
            }
        });
    }
);

// Refresh scroll positions after page resources load.
window.addEventListener("load", () => {
    ScrollTrigger.refresh();
});

// CONTACT FORM DEMO
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();

    formStatus.textContent =
        `Thanks, ${name}! Your garden note is ready. ` +
        "This demo does not send messages yet; connect a backend to deliver it.";

    formStatus.classList.remove("hidden");
    contactForm.reset();
});

// FOOTER YEAR
document.getElementById("year").textContent =
    new Date().getFullYear();
