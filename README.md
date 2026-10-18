# Andrew Prakash — personal site

Static portfolio for [GitHub Pages](https://pages.github.com/), served from this repository’s `main` branch at the site root (`https://andrewprakash1.github.io`).

No build step. The page is `index.html` plus `css/`, `js/`, and a single content file.

## Edit the site

All copy, links, and project lists live in **`data.json`**. Change that file and refresh; you do not need to edit HTML for ordinary updates.

### What to change

| Field | Purpose |
| --- | --- |
| `person` | Name, headline, focus areas, skills |
| `socials.github` / `socials.x` | Shown in the header, hero, and footer |
| `papers`, `projects`, `opensource`, `writing`, `competitive`, `highlights` | Section items, URLs, and gallery images |
| `sections` | Section titles and short intros |
| `config` | Optional profile URLs (hidden until filled) |

### Optional profile buttons

At the top of `data.json`:

```json
"config": {
  "linkedin": "",
  "leetcode": "",
  "codeforces": "",
  "codeforcesHandle": "",
  "substack": ""
}
```

Leave a value empty to hide that button. Paste a full URL to show it.

- **LinkedIn**, **X**, **Substack**, and **Codeforces** show as buttons when their URLs are set.
- **LeetCode** stays hidden while `config.leetcode` is empty.
- Ratings are never hardcoded. If `config.codeforcesHandle` is set, the page requests `https://codeforces.com/api/user.info` at runtime and shows a live rating badge only when that call succeeds. If the API is blocked or fails, the badge is omitted.

## Preview locally

From the repository root:

```bash
python3 -m http.server 8080
```

Open `http://127.0.0.1:8080`.

## Enable GitHub Pages

1. Push (or merge) this site to the `main` branch.
2. In the GitHub repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Set **Branch** to `main` and the folder to `/ (root)`.
5. Save. The site is published at `https://andrewprakash1.github.io`.

## Layout

```text
index.html    page shell
data.json     all content
css/styles.css
js/main.js    loads data.json and renders the page
assets/img/   photos referenced from data.json
favicon.svg
```
