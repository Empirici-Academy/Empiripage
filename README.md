# Empirici Academy

Empirici Academy is a lightweight, client-side educational platform for data analysis and analytics training. The project is implemented using HTML5, CSS3 and vanilla JavaScript. It provides dynamic, JSON-driven content management, a responsive user interface, an admin panel for content editing, and mechanisms for safe static deployment (GitHub Pages, Cloudflare Pages).

---

## Table of contents

* [Project overview](#project-overview)
* [Features](#features)

  * [Core functionality](#core-functionality)
  * [Technical features](#technical-features)
* [Project structure](#project-structure)
* [Quick start](#quick-start)

  * [Clone the repository](#clone-the-repository)
  * [Local development](#local-development)
  * [Deployment](#deployment)
* [Configuration](#configuration)

  * [Content management](#content-management)
  * [Cache busting](#cache-busting)
  * [JSON data format](#json-data-format)
* [Development workflow](#development-workflow)
* [Customization](#customization)
* [Browser support](#browser-support)
* [Technologies](#technologies)
* [Dependencies](#dependencies)
* [Troubleshooting](#troubleshooting)
* [Contributing](#contributing)
* [License](#license)
* [Authors](#authors)
* [Acknowledgments](#acknowledgments)
* [Support](#support)

---

## Project overview

Empirici Academy is a static, client-side website designed for publishing courses, articles and institutional information related to data analysis. The site stores content in JSON files and renders pages dynamically in the browser. It is intended for teams that prefer a low-maintenance, static architecture with an in-browser admin interface for content updates.

Key design goals:

* Minimal operational overhead (no server-side components required)
* Fast load times with CDN support
* Simple content workflow: edit via admin UI or update JSON files and push
* Secure by design (static site surface area)

---

## Features

### Core functionality

* Course catalog with filtering and search
* Blog/post system for articles and tutorials
* Instructor and team profile pages
* Testimonials / case studies section
* Contact form and contact confirmation page
* Collaboration / partnerships page
* Admin panel for editing content in-browser

### Technical features

* JSON-driven content model (data stored under `/data`)
* Client-side persistence using Local Storage (admin autosave and caching)
* Automatic cache-busting utility (timestamp-based or manual versioning)
* Responsive layout using CSS Grid and Flexbox
* Semantic, accessible HTML markup for SEO
* Zero-backend static deployment compatibility (GitHub Pages, Cloudflare Pages)
* Optional Cloudflare CDN integration and cache management workflow

---

## Project structure

```
empirici-academy/
│
├── index.html                # Homepage (hero, featured courses)
├── about.html                # About page (mission, team)
├── courses.html              # Courses listing and filters
├── blog.html                 # Blog listing
├── post.html                 # Single blog post template
├── contact.html              # Contact form
├── collaboration.html        # Partnerships and collaboration
├── thank-you.html            # Form submission confirmation
├── admin.html                # Admin interface (content management)
├── 404.html                  # Custom 404 page
│
├── css/
│   └── style.css             # Main styles and variables
│
├── js/
│   ├── cache-buster.js       # Cache versioning helper
│   ├── main.js               # UI interactions and routing
│   ├── site-content-default.js # Default data loader and renderers
│   └── admin.js              # Admin panel logic (CRUD, localStorage)
│
├── data/
│   ├── site-data.json        # Site settings, team, testimonials
│   ├── courses.json          # Course catalog
│   └── blog-posts.json       # Blog content
│
└── assets/
    ├── logo.svg
    └── images/               # Course and team images
```

---

## Quick start

### Clone the repository

```bash
git clone https://github.com/yourusername/empirici-academy.git
cd empirici-academy
```

### Local development

Serve the files with any simple static server:

```bash
# Python 3
python -m http.server 8000

# Node (http-server)
npx http-server -p 8000
```

Open `http://localhost:8000` in your browser.

### Deployment

**GitHub Pages**

1. Push the repository to GitHub under your account.
2. In the repository Settings → Pages, set the source branch to `main` and root (`/`).
3. The site will be served at `https://yourusername.github.io/empirici-academy/`.

**Cloudflare Pages**

1. Connect the GitHub repository to Cloudflare Pages.
2. Use no build command (static files) and set output directory to `/`.
3. Deploy; Cloudflare will provide a URL and optional custom domain.

---

## Configuration

### Content management

* Site content is stored in JSON files under the `/data` folder.
* Use the admin UI (`/admin.html`) to create or edit content in the browser. Changes can be exported to JSON files for version control.
* For CI/CD workflows, commit exported JSON files to the repository and deploy.

### Cache busting

Two recommended approaches:

**Automatic (development)**

* `cache-buster.js` appends timestamps to resource requests for immediate updates while developing.

**Manual (production)**

* Version static resources explicitly by adding query parameters or renaming bundles:

```html
<link rel="stylesheet" href="css/style.css?v=002">
<script src="js/main.js?v=002"></script>
```

* After pushing changes, use Cloudflare’s “Purge Cache” (if applicable) to ensure CDN edge nodes fetch updated files.

### JSON data format

Sample `data/site-data.json` (structure outline):

```json
{
  "siteSettings": {
    "title": "Empirici Academy",
    "description": "Data analysis and analytics training",
    "primaryColor": "#1a73e8"
  },
  "team": [
    {
      "id": "t1",
      "name": "Instructor Name",
      "role": "Lead Instructor",
      "bio": "Short biography",
      "photo": "/assets/images/team1.jpg"
    }
  ],
  "testimonials": [
    {
      "id": "r1",
      "name": "Student Name",
      "text": "Testimonial text",
      "courseId": 1
    }
  ],
  "stats": []
}
```

Sample `data/courses.json` (outline):

```json
{
  "courses": [
    {
      "id": 1,
      "title": "Introduction to Data Analysis",
      "description": "Course overview",
      "level": "beginner",
      "duration": "6 weeks",
      "featured": true
    }
  ]
}
```

Sample `data/blog-posts.json` (outline):

```json
{
  "blogPosts": [
    {
      "id": 1,
      "title": "Getting Started with Data Analysis",
      "excerpt": "Short summary",
      "content": "<p>HTML content</p>",
      "date": "2025-10-01",
      "author": "Author Name",
      "featured": false
    }
  ]
}
```

---

## Development workflow

1. Use the admin panel for content creation during authoring and testing.
2. Export the updated JSON files from the admin panel and commit them to version control.
3. Run a local server to verify pages and responsive behavior.
4. Push to `main` branch and rely on GitHub Pages or Cloudflare Pages for deployment.

---

## Customization

* Replace `assets/logo.svg` with your logo file.
* Adjust CSS variables and typography in `css/style.css`.
* Update Google Fonts declarations if different fonts are required.
* Modify page templates (HTML) and renderers in `js/site-content-default.js` for layout changes.

---

## Browser support

The site targets modern browsers and recent versions of major engines:

* Chrome (latest)
* Edge (latest)
* Firefox (latest)
* Safari (latest)
* iOS and Android mobile browsers

---

## Technologies

* HTML5 for semantic structure
* CSS3 for responsive layout (Grid & Flexbox)
* JavaScript (ES6+) for interactivity and data rendering
* JSON for content and configuration
* Local Storage for client-side persistence
* GitHub Pages / Cloudflare Pages for static hosting and CDN

---

## Dependencies

No framework dependencies. External resources in use may include:

* Google Fonts (CDN) — optional
* Any icons or imagery used in the `assets/` folder (local or external sources)

---

## Troubleshooting

**If recent changes are not visible**

* Clear local browser cache or perform a hard refresh (`Ctrl+Shift+R` / `Cmd+Shift+R`)
* Purge the Cloudflare cache if using Cloudflare Pages
* Confirm that the correct versioned URLs are referenced (if using manual cache-busting)

**If admin panel fails to save**

* Ensure `localStorage` is enabled in the browser
* Inspect the browser console for JavaScript exceptions
* Validate JSON export format; malformed JSON will break rendering

**If images do not load**

* Verify that `assets/images` contains the referenced files
* Confirm paths in JSON point to the correct locations
* For external images, ensure remote URLs are correct and reachable

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m "Add: description"`
4. Push branch: `git push origin feature/your-feature`
5. Open a pull request and include a clear description of the change

Please include tests or verification steps for any functional changes.

---

## License

This project is released under the MIT License. See the `LICENSE` file for full terms.

---

## Authors

Empirici Academy Team
Website: [https://empirici.academy](https://empirici.academy)
Contact: [info@empirici.academy](mailto:info@empirici.academy)

---

## Acknowledgments

* Design and UX inspiration from contemporary educational platforms
* Images and illustrations sourced from providers such as Unsplash (where applicable)
* Fonts provided via Google Fonts

---

## Support

For support, bug reports, or feature requests, open an issue in the repository or contact `info@empirici.academy`.
