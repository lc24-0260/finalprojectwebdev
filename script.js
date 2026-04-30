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
const bootLoader = document.getElementById("boot-loader");
const matrixLoaderCanvas = document.getElementById("matrix-loader-canvas");
const brandMark = document.querySelector(".brand-mark");

let typingPhraseIndex = 0;
let typingCharIndex = 0;
let deleting = false;

function setupLoaderBypassLinks() {
    document.querySelectorAll("[data-skip-loader='true']").forEach((link) => {
        link.addEventListener("click", () => {
            window.sessionStorage.setItem("skip-loader-once", "true");
        });
    });
}

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

function runBootLoader() {
    if (window.sessionStorage.getItem("skip-loader-once") === "true") {
        window.sessionStorage.removeItem("skip-loader-once");
        if (bootLoader) {
            bootLoader.remove();
        }
        document.body.classList.remove("is-loading");
        typeHeroText();
        return;
    }

    if (!bootLoader || !matrixLoaderCanvas) {
        document.body.classList.remove("is-loading");
        return;
    }

    const context = matrixLoaderCanvas.getContext("2d");
    const targetName = "Panagiotis Tsimpouris";
    const glyphs = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%*+=<>[]{}";
    const revealStartMs = 2400;
    const revealCompleteMs = 3400;
    const rainDecayStartMs = 5600;
    const trimStartMs = 3000;
    const trimEndMs = 3800;
    const mergeStartMs = 3800;
    const mergeEndMs = 4400;
    const travelStartMs = 4400;
    const travelEndMs = 5600;
    const durationMs = 5600;
    const firstName = "Panagiotis";
    const lastName = "Tsimpouris";
    const columns = [];
    const removalOrder = [];
    let animationFrameId = 0;
    let startTime = 0;
    let fontSize = 18;
    let columnWidth = 18;
    let rowHeight = 22;
    let targetRow = 0;
    let nameStartX = 0;
    let brandTarget = { x: 74, y: 44 };

    function randomGlyph() {
        return glyphs[Math.floor(Math.random() * glyphs.length)];
    }

    function getBrandTarget() {
        if (!brandMark) {
            return brandTarget;
        }

        const rect = brandMark.getBoundingClientRect();
        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function easeInOut(progress) {
        return progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
    }

    function drawGlyph(glyph, x, y, scale = 1, alpha = 0.98) {
        if (!glyph) {
            return;
        }

        context.save();
        context.translate(x, y);
        context.scale(scale, scale);
        context.font = `${fontSize}px "Courier New", monospace`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = `rgba(210, 255, 220, ${alpha})`;
        context.shadowColor = "rgba(99, 255, 124, 0.42)";
        context.shadowBlur = 16;
        context.fillText(glyph, 0, 0);
        context.restore();
    }

    function resizeCanvas() {
        const scale = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        matrixLoaderCanvas.width = width * scale;
        matrixLoaderCanvas.height = height * scale;
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(scale, scale);

        fontSize = Math.max(16, Math.floor(width / 68));
        columnWidth = fontSize * 0.9;
        rowHeight = fontSize * 1.2;

        const columnCount = Math.ceil(width / columnWidth) + 1;
        columns.length = 0;

        for (let index = 0; index < columnCount; index += 1) {
            columns.push({
                columnIndex: index,
                x: index * columnWidth,
                y: Math.random() * height,
                speed: rowHeight * (0.55 + Math.random() * 0.95),
                length: 8 + Math.floor(Math.random() * 16),
                targetLetter: null,
                targetIndex: -1,
                settled: false
            });
        }

        targetRow = Math.max(4, Math.floor(height / (rowHeight * 2)));
        nameStartX = Math.max(columnWidth, (width - targetName.length * columnWidth) / 2);
        brandTarget = getBrandTarget();
    }

    function drawRain(width, height, elapsed) {
        const revealLocked = elapsed >= revealCompleteMs;
        const rainDecaying = elapsed >= rainDecayStartMs;
        const mergeProgress = Math.min(
            Math.max((elapsed - mergeStartMs) / (mergeEndMs - mergeStartMs), 0),
            1
        );
        const travelProgress = Math.min(
            Math.max((elapsed - travelStartMs) / (travelEndMs - travelStartMs), 0),
            1
        );

        context.fillStyle = "#010603";
        context.fillRect(0, 0, width, height);

        context.font = `${fontSize}px "Courier New", monospace`;
        context.textAlign = "left";
        context.textBaseline = "top";
        const baseY = targetRow * rowHeight + rowHeight * 0.5;
        const charX = (index) => nameStartX + index * columnWidth + columnWidth * 0.5;

        for (const column of columns) {
            column.y += column.speed * 0.225;

            if (column.y - column.length * rowHeight > height + rowHeight) {
                continue;
            }

            for (let trailIndex = 0; trailIndex < column.length; trailIndex += 1) {
                const y = column.y - trailIndex * rowHeight;
                if (y < -rowHeight || y > height + rowHeight) {
                    continue;
                }

                const alpha = Math.max(0.08, 1 - trailIndex / (column.length + 1));
                const isHead = trailIndex === 0;
                const glyph = randomGlyph();

                context.fillStyle =
                    isHead
                        ? `rgba(210, 255, 220, ${Math.min(alpha + 0.15, 1)})`
                        : `rgba(99, 255, 124, ${alpha * 0.75})`;
                context.shadowColor = isHead ? "rgba(99, 255, 124, 0.35)" : "transparent";
                context.shadowBlur = isHead ? 12 : 0;
                context.fillText(glyph, column.x, y);
            }
        }

        if (elapsed < mergeStartMs) {
            const trimProgress = Math.min(
                Math.max((elapsed - trimStartMs) / (trimEndMs - trimStartMs), 0),
                1
            );
            const removableLetters = Math.max(firstName.length - 1, lastName.length - 1);
            const trimmedCount = Math.floor(trimProgress * removableLetters);
            const visibleFirst = firstName.slice(0, Math.max(1, firstName.length - trimmedCount));
            const visibleLast = lastName.slice(0, Math.max(1, lastName.length - trimmedCount));

            for (let index = 0; index < visibleFirst.length; index += 1) {
                drawGlyph(visibleFirst[index], charX(index), baseY);
            }

            const lastNameStartIndex = targetName.indexOf("T");
            for (let index = 0; index < visibleLast.length; index += 1) {
                drawGlyph(visibleLast[index], charX(lastNameStartIndex + index), baseY);
            }
            return;
        }

        if (revealLocked) {
            const pBaseX = charX(0);
            const tBaseX = charX(targetName.indexOf("T"));
            const centerX = (pBaseX + tBaseX) / 2;
            const mergeSpacing = columnWidth * 0.62;
            const mergeEase = easeInOut(mergeProgress);
            const pMergedX = pBaseX + (centerX - mergeSpacing - pBaseX) * mergeEase;
            const tMergedX = tBaseX + (centerX + mergeSpacing - tBaseX) * mergeEase;

            if (elapsed < travelStartMs) {
                drawGlyph("P", pMergedX, baseY);
                drawGlyph("T", tMergedX, baseY);
                return;
            }

            brandTarget = getBrandTarget();
            const travelEase = easeInOut(travelProgress);
            const currentX = centerX + (brandTarget.x - centerX) * travelEase;
            const currentY = baseY + (brandTarget.y - baseY) * travelEase;
            const currentScale = 1 + (0.78 - 1) * travelEase;
            drawGlyph("PT", currentX, currentY, currentScale);
        }
    }

    function finishLoader() {
        window.cancelAnimationFrame(animationFrameId);
        window.removeEventListener("resize", resizeCanvas);
        bootLoader.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        typeHeroText();
        window.setTimeout(() => {
            bootLoader.remove();
        }, 850);
    }

    function animate(timestamp) {
        if (!startTime) {
            startTime = timestamp;
        }

        const elapsed = timestamp - startTime;
        const width = matrixLoaderCanvas.width / (window.devicePixelRatio || 1);
        const height = matrixLoaderCanvas.height / (window.devicePixelRatio || 1);

        drawRain(width, height, elapsed);

        if (elapsed >= durationMs) {
            finishLoader();
            return;
        }

        animationFrameId = window.requestAnimationFrame(animate);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animationFrameId = window.requestAnimationFrame(animate);
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
setupLoaderBypassLinks();
runBootLoader();
loadProjects();
loadBlog();
setupHyperboloidAnimation();
