/* Content and optional profile URLs: data.json.
   config.linkedin / leetcode / codeforces / substack — empty values hide those buttons.
   Codeforces rating is fetched live; it is never hardcoded. */
const CONFIG_KEYS = ["linkedin", "leetcode", "codeforces", "substack"];

const filled = (value) => typeof value === "string" && value.trim().length > 0;

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const el = (id) => document.getElementById(id);

function splitName(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
}

function extLink(href, label, className, optionalKey) {
  const optional = optionalKey ? ` data-optional="${escapeHtml(optionalKey)}"` : "";
  return `<a class="${className}"${optional} href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function renderNav(data) {
  const list = el("nav-list");
  list.innerHTML = data.nav
    .map(
      (item) =>
        `<li><a href="#${escapeHtml(item.id)}">${escapeHtml(item.label)}</a></li>`
    )
    .join("");

  const actions = [];
  if (filled(data.socials.github)) {
    actions.push(extLink(data.socials.github, "GitHub", "btn"));
  }
  if (filled(data.config.substack)) {
    actions.push(extLink(data.config.substack, "Writing", "btn ghost", "substack"));
  }
  el("header-actions").innerHTML = actions.join("");
}

function renderHero(data) {
  const [first, rest] = splitName(data.person.name);
  el("hero-eyebrow").textContent = data.person.headline;
  el("hero-display").innerHTML = `
    <span class="line">${escapeHtml(first)}</span>
    <span class="line accent">${escapeHtml(rest)}</span>
  `;
  el("hero-lede").textContent = data.person.focus.join(" · ");
  el("skill-row").innerHTML = data.person.skills
    .map((skill) => `<li>${escapeHtml(skill)}</li>`)
    .join("");

  const ctas = [];
  ctas.push(`<a class="btn" href="#projects">Projects -&gt;</a>`);
  if (filled(data.socials.github)) {
    ctas.push(extLink(data.socials.github, "GitHub", "btn ghost"));
  }
  if (filled(data.socials.x)) {
    ctas.push(extLink(data.socials.x, "X", "btn ghost"));
  }
  if (filled(data.config.linkedin)) {
    ctas.push(extLink(data.config.linkedin, "LinkedIn", "btn ghost", "linkedin"));
  }
  if (filled(data.config.substack)) {
    ctas.push(extLink(data.config.substack, "Writing", "btn ghost", "substack"));
  }
  el("hero-cta").innerHTML = ctas.join("");

  const tickerBits = [...data.person.skills, ...data.person.focus, data.person.name];
  const loop = tickerBits.concat(tickerBits);
  el("ticker-track").innerHTML = loop
    .map((bit, index) => (index % 2 ? `<b>${escapeHtml(bit)}</b>` : escapeHtml(bit)))
    .join("<span aria-hidden='true'> / </span>");
}

function renderSectionHeads(sections) {
  const map = {
    papers: "papers",
    projects: "projects",
    opensource: "open-source",
    writing: "writing",
    compete: "compete",
  };
  Object.entries(map).forEach(([key, id]) => {
    const section = document.getElementById(id);
    if (!section || !sections[key]) return;
    const title = section.querySelector("h2 span");
    const intro = section.querySelector(".block-head p");
    if (title) title.textContent = sections[key].title;
    if (intro) intro.textContent = sections[key].intro;
  });
}

function renderPapers(papers) {
  el("papers-list").innerHTML = papers
    .map(
      (paper, index) => `
      <li class="prize-item">
        <span class="prize-index">${String(index + 1).padStart(2, "0")}</span>
        ${extLink(paper.url, escapeHtml(paper.name), "")}
        <p>${escapeHtml(paper.description)}</p>
      </li>`
    )
    .join("");
}

function renderProjects(projects) {
  el("projects-list").innerHTML = projects
    .map((project) => {
      const title = project.title || project.name;
      return `
        <a class="card" href="${escapeHtml(project.url)}" target="_blank" rel="noopener noreferrer">
          <span class="kicker">${escapeHtml(project.name)}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(project.description)}</p>
          <span class="more">Open repo -&gt;</span>
        </a>`;
    })
    .join("");
}

function renderOpenSource(items) {
  el("oss-list").innerHTML = items
    .map(
      (item) => `
      <article class="oss-card">
        <span class="status">${escapeHtml(item.status)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.detail)}</p>
        <div class="oss-meta">
          <span class="repo-name">${escapeHtml(item.repo)}</span>
          ${extLink(item.url, "View pull request -&gt;", "chip-link")}
        </div>
      </article>`
    )
    .join("");
}

function renderWriting(data) {
  const list = el("writing-list");
  if (!filled(data.config.substack) && !filled(data.writing?.url)) {
    list.closest("section")?.remove();
    return;
  }
  const url = data.writing?.url || data.config.substack;
  const label = data.writing?.label || "Substack";
  const description = data.writing?.description || "Writing on Substack.";
  list.innerHTML = `
    <article class="writing-card">
      <h3>${escapeHtml(label)}</h3>
      <p>${escapeHtml(description)}</p>
      <div class="profile-row">
        ${extLink(url, "Open Substack -&gt;", "chip-link", "substack")}
      </div>
    </article>
  `;
}

function renderCompete(data) {
  const profiles = [];
  if (filled(data.config.codeforces)) {
    profiles.push(
      extLink(data.config.codeforces, "Codeforces profile", "chip-link", "codeforces")
    );
  }
  if (filled(data.config.leetcode)) {
    profiles.push(
      extLink(data.config.leetcode, "LeetCode profile", "chip-link", "leetcode")
    );
  }

  el("compete-grid").innerHTML = `
    <article class="compete-card">
      <h3>${escapeHtml(data.competitive.solutions.name)}</h3>
      <p>${escapeHtml(data.competitive.solutions.description)}</p>
      <div class="profile-row">
        ${extLink(data.competitive.solutions.url, "Solutions repo -&gt;", "chip-link")}
        ${profiles.join("")}
        <span class="rating-badge" id="cf-rating" hidden></span>
      </div>
    </article>
  `;
}

function renderFooter(data) {
  const links = [];
  if (filled(data.socials.github)) {
    links.push(`<li>${extLink(data.socials.github, "GitHub", "")}</li>`);
  }
  if (filled(data.socials.x)) {
    links.push(`<li>${extLink(data.socials.x, "X", "")}</li>`);
  }
  if (filled(data.config.linkedin)) {
    links.push(`<li>${extLink(data.config.linkedin, "LinkedIn", "", "linkedin")}</li>`);
  }
  if (filled(data.config.substack)) {
    links.push(`<li>${extLink(data.config.substack, "Substack", "", "substack")}</li>`);
  }
  el("footer-links").innerHTML = links.join("");
}

function wireNav() {
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function hideEmptyOptionalButtons(config) {
  CONFIG_KEYS.forEach((key) => {
    if (!filled(config[key])) {
      document.querySelectorAll(`[data-optional="${key}"]`).forEach((node) => {
        node.remove();
      });
    }
  });
}

async function loadCodeforcesRating(handle, profileUrl) {
  const badge = el("cf-rating");
  if (!badge || !filled(handle)) return;
  try {
    const response = await fetch(
      `https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`
    );
    if (!response.ok) return;
    const payload = await response.json();
    const user = payload.status === "OK" ? payload.result?.[0] : null;
    if (!user || typeof user.rating !== "number") return;
    const rank = filled(user.rank) ? user.rank : "";
    const href = filled(profileUrl) ? profileUrl : `https://codeforces.com/profile/${encodeURIComponent(handle)}`;
    badge.innerHTML = `${extLink(
      href,
      `${escapeHtml(String(user.rating))}${rank ? ` <span class="rank">${escapeHtml(rank)}</span>` : ""}`,
      ""
    )}`;
    badge.hidden = false;
    badge.classList.add("is-live");
  } catch {
    /* Fail closed: no rating, no placeholder. */
  }
}

async function boot() {
  const response = await fetch("data.json", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load data.json (${response.status})`);
  }
  const data = await response.json();
  document.title = data.site.title;
  renderNav(data);
  renderSectionHeads(data.sections);
  renderHero(data);
  renderPapers(data.papers);
  renderProjects(data.projects);
  renderOpenSource(data.opensource);
  renderWriting(data);
  renderCompete(data);
  renderFooter(data);
  hideEmptyOptionalButtons(data.config);
  wireNav();
  loadCodeforcesRating(data.config.codeforcesHandle, data.config.codeforces);
}

boot().catch((error) => {
  el("hero-lede").textContent = "Could not load site data.";
  console.error(error);
});
