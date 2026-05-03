const typingPhrases = [
    "Exploring cybersecurity through code and competition.",
    "Building creative projects with a clean technical edge.",
    "Learning fast, debugging often, and improving every week."
];

const typedText = document.getElementById("typed-text");
const projectGrid = document.getElementById("project-grid");
const filterButtons = document.querySelectorAll(".filter-button");
const contactForm = document.getElementById("contact-form");
const formMessage = document.getElementById("form-message");
const hyperboloidCanvas = document.getElementById("hyperboloid-canvas");
const themeOptions = document.querySelectorAll("[data-theme-option]");

let typingPhraseIndex = 0;
let typingCharIndex = 0;
let deleting = false;


function applyTheme(theme) {
    document.body.dataset.theme = theme;

    themeOptions.forEach((button) => {
        const isActive = button.dataset.themeOption === theme;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
    });
}

function setupThemeToggle() {
    if (!themeOptions.length) {
        return;
    }

    const storedTheme = window.localStorage.getItem("portfolio-theme") || "dark";
    applyTheme(storedTheme);

    themeOptions.forEach((button) => {
        button.addEventListener("click", () => {
            const { themeOption } = button.dataset;
            applyTheme(themeOption);
            window.localStorage.setItem("portfolio-theme", themeOption);
        });
    });
}


function setupHyperboloidAnimation() {
    if (!hyperboloidCanvas) {
        return;
    }

    const context = hyperboloidCanvas.getContext("2d");
    const pointCount = 51;
    const fullTurn = Math.PI * 2;
    const angleStep = fullTurn / pointCount;
    const upperPoints = [];
    const animationSpeed = 0.0055;
    let geometry = null;

    function getThemeColors() {
        const styles = window.getComputedStyle(document.body);
        return {
            accent: styles.getPropertyValue("--accent").trim() || "#63ff7c",
            accentStrong: styles.getPropertyValue("--accent-strong").trim() || "#98ff9f"
        };
    }

    function resizeCanvas() {
        const frame = hyperboloidCanvas.parentElement;
        const frameBox = frame.getBoundingClientRect();
        const canvasWidth = Math.max(Math.floor(frameBox.width - 32), 220);
        const canvasHeight = Math.max(Math.floor(frameBox.height - 32), 260);
        const scale = window.devicePixelRatio || 1;

        hyperboloidCanvas.width = canvasWidth * scale;
        hyperboloidCanvas.height = canvasHeight * scale;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(scale, scale);

        buildPoints(canvasWidth, canvasHeight);
    }

    function buildPoints(width, height) {
        upperPoints.length = 0;

        const centerX = width / 2;
        const topY = height * 0.14;
        const bottomY = height * 0.86;
        const radiusX = width * 0.32;
        const radiusY = height * 0.085;
        geometry = { centerX, topY, bottomY, radiusX, radiusY };

        for (let index = 0; index < pointCount; index += 1) {
            const angle = index * angleStep;

            upperPoints.push({
                x: centerX + radiusX * Math.cos(angle),
                y: topY + radiusY * Math.sin(angle)
            });
        }
    }

    function drawScene(timestamp) {
        const displayWidth = hyperboloidCanvas.width / (window.devicePixelRatio || 1);
        const displayHeight = hyperboloidCanvas.height / (window.devicePixelRatio || 1);
        const phase = (timestamp * animationSpeed) % pointCount;
        const phaseAngle = phase * angleStep;
        const themeColors = getThemeColors();

        context.clearRect(0, 0, displayWidth, displayHeight);

        context.save();
        context.shadowColor = themeColors.accent;
        context.shadowBlur = 10;
        context.strokeStyle = themeColors.accent;
        context.lineWidth = 1;

        for (let index = 0; index < pointCount; index += 1) {
            const start = upperPoints[index];
            const angle = index * angleStep + phaseAngle;
            const end = {
                x: geometry.centerX + geometry.radiusX * Math.cos(angle),
                y: geometry.bottomY + geometry.radiusY * Math.sin(angle)
            };

            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
        }

        context.restore();

        context.fillStyle = themeColors.accentStrong;
        for (const point of upperPoints) {
            context.beginPath();
            context.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
            context.fill();
        }

        for (let index = 0; index < pointCount; index += 1) {
            const angle = index * angleStep + phaseAngle;
            const point = {
                x: geometry.centerX + geometry.radiusX * Math.cos(angle),
                y: geometry.bottomY + geometry.radiusY * Math.sin(angle)
            };
            context.beginPath();
            context.arc(point.x, point.y, 1.6, 0, Math.PI * 2);
            context.fill();
        }

        window.requestAnimationFrame(drawScene);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.requestAnimationFrame(drawScene);
}

function typeHeroText() {
    if (!typedText) {
        return;
    }

    const currentPhrase = typingPhrases[typingPhraseIndex];

    if (!deleting) {
        typedText.textContent = currentPhrase.slice(0, typingCharIndex + 1);
        typingCharIndex += 1;

        if (typingCharIndex === currentPhrase.length) {
            deleting = true;
            setTimeout(typeHeroText, 1300);
            return;
        }

        setTimeout(typeHeroText, 55);
        return;
    }

    typedText.textContent = currentPhrase.slice(0, typingCharIndex - 1);
    typingCharIndex -= 1;

    if (typingCharIndex === 0) {
        deleting = false;
        typingPhraseIndex = (typingPhraseIndex + 1) % typingPhrases.length;
    }

    setTimeout(typeHeroText, deleting ? 28 : 55);
}

async function loadProjects() {
    if (!projectGrid) {
        return;
    }

    try {
        const response = await fetch("data/projects.json");
        if (!response.ok) {
            throw new Error("Could not load project data.");
        }

        const projects = await response.json();
        renderProjects(projects, "all");
        setupFilters(projects);
    } catch (error) {
        projectGrid.innerHTML = `<article class="panel project-card"><h3>Project data unavailable</h3><p>${error.message}</p></article>`;
    }
}

function renderProjects(projects, filter) {
    const visibleProjects =
        filter === "all"
            ? projects
            : projects.filter((project) => project.category === filter);

    projectGrid.innerHTML = visibleProjects
        .map(
            (project) => `
                <article class="panel project-card">
                    <div class="project-visual"><code>${project.visual}</code></div>
                    <div>
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                    </div>
                    <div class="project-tags">
                        ${project.technologies
                            .map((tech) => `<span>${tech}</span>`)
                            .join("")}
                    </div>
                    <div class="project-actions">
                        <a class="button ghost" href="${project.link}" target="_blank" rel="noreferrer">Open Project</a>
                    </div>
                </article>
            `
        )
        .join("");
}

function setupFilters(projects) {
    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");
            renderProjects(projects, button.dataset.filter);
        });
    });
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function handleContactSubmit(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        formMessage.textContent = "Please complete all fields before submitting.";
        formMessage.classList.add("error-message");
        return;
    }

    if (!isValidEmail(email)) {
        formMessage.textContent = "Please enter a valid email address.";
        formMessage.classList.add("error-message");
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Submission failed.");
        }

        formMessage.textContent = "Message sent! I'll get back to you soon.";
        formMessage.classList.remove("error-message");
        contactForm.reset();
    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.classList.add("error-message");
    }
}

if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit);
}

async function loadBlog() {
    const blogGrid = document.getElementById("blog-grid");
    if (!blogGrid) return;

    try {
        const response = await fetch("data/blog.json");
        if (!response.ok) throw new Error("Could not load blog data.");

        const posts = await response.json();
        blogGrid.innerHTML = posts.map((post) => `
            <article class="panel blog-card">
                <div class="meta">${post.category}</div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a class="button ghost" href="${post.path}">Read more</a>
            </article>
        `).join("");
    } catch (error) {
        const blogGrid = document.getElementById("blog-grid");
        if (blogGrid) blogGrid.innerHTML = `<article class="panel blog-card"><h3>Blog unavailable</h3><p>${error.message}</p></article>`;
    }
}

setupThemeToggle();
typeHeroText();
loadProjects();
loadBlog();
setupHyperboloidAnimation();
