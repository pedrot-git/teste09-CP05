document.documentElement.classList.add("has-js");

document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector("[data-header]");
    const nav = document.querySelector("[data-nav]");
    const navToggle = document.querySelector("[data-nav-toggle]");
    const stage = document.querySelector("[data-stage]");
    const revealItems = document.querySelectorAll("[data-reveal]");
    const form = document.querySelector("[data-form]");
    const feedback = document.querySelector("[data-form-feedback]");
    const year = document.querySelector("[data-year]");

    const syncHeader = () => {
        if (!header) {
            return;
        }

        header.classList.toggle("is-scrolled", window.scrollY > 24);
    };

    const closeNav = () => {
        if (!nav || !navToggle) {
            return;
        }

        nav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-open");
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });

    if (nav && navToggle) {
        navToggle.addEventListener("click", () => {
            const isOpen = nav.classList.toggle("is-open");
            navToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("menu-open", isOpen);
        });

        nav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeNav);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeNav();
            }
        });
    }

    if ("IntersectionObserver" in window && revealItems.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.18,
                rootMargin: "0px 0px -40px 0px",
            }
        );

        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    if (stage && window.matchMedia("(pointer: fine)").matches) {
        stage.addEventListener("mousemove", (event) => {
            const rect = stage.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 100;
            const y = ((event.clientY - rect.top) / rect.height) * 100;

            stage.style.setProperty("--pointer-x", `${x}%`);
            stage.style.setProperty("--pointer-y", `${y}%`);
        });

        stage.addEventListener("mouseleave", () => {
            stage.style.setProperty("--pointer-x", "70%");
            stage.style.setProperty("--pointer-y", "30%");
        });
    }

    if (form && feedback) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!form.reportValidity()) {
                feedback.textContent = "Revise os campos obrigatórios para continuar.";
                feedback.classList.add("is-error");
                feedback.classList.remove("is-success");
                return;
            }

            feedback.textContent = "Pedido recebido. Em breve o time Melodia entra em contato com novidades do beta.";
            feedback.classList.add("is-success");
            feedback.classList.remove("is-error");
            form.reset();
        });
    }

    if (year) {
        year.textContent = String(new Date().getFullYear());
    }
});
