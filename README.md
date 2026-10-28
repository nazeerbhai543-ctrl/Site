# Shaik Nazeer — Civil Engineering Portfolio Website

A complete, modern, responsive personal portfolio website built for Shaik Nazeer, B.Tech Civil Engineering student at Lovely Professional University.

## Project Structure

```
nazeer-portfolio/
├── index.html          ← Main HTML file (all sections)
├── assets/
│   ├── css/
│   │   └── style.css   ← Complete stylesheet
│   └── js/
│       └── main.js     ← All interactivity
├── assets/images/      ← Add your project images here
└── README.md
```

## Adding Your Own Images

The website currently uses SVG placeholders for projects. To replace them with your real drawings:

1. Copy your image files (JPG, PNG, or WebP) into `assets/images/`
2. In `index.html`, find the section with class `project-card-visual` for the project
3. Replace the `<svg>` placeholder with an `<img>` tag:
   ```html
   <img src="assets/images/your-image.jpg" alt="Description of your drawing" />
   ```

## Sections Included

- **Hero** — Introduction with engineering drawing collage
- **About Me** — Personal intro with highlight cards
- **Learning Journey** — Visual timeline (education + internships + freelance)
- **Skills** — Interactive skill tags with descriptions
- **Projects** — Editorial gallery with modals (3 projects)
- **Experience** — Internship + freelance cards
- **Currently Exploring** — Learning goal cards
- **Contact** — Contact info + form (mailto-based)

## Color Palette

| Name | Hex |
|------|-----|
| Background (Cream) | `#F7F5EF` |
| Forest Green | `#263B32` |
| Sage Green | `#A8B5A0` |
| Cards (White) | `#FFFFFF` |
| Light Grey | `#E5E3DC` |

## Fonts

- **Headings**: Space Grotesk
- **Body**: Manrope

Both loaded from Google Fonts CDN (requires internet).

## Contact Details in Site

- Email: nazeerbhai543@gmail.com
- Phone: +91 8463941316
- LinkedIn: https://www.linkedin.com/in/shaik-nazeer-976a84390/
- Location: Amritsar/Ludhiana Area, Punjab, India

## Deploying Online (Free Options)

1. **GitHub Pages** — Upload this folder to a GitHub repo and enable Pages
2. **Netlify** — Drag-and-drop this folder at netlify.com
3. **Vercel** — Import from GitHub at vercel.com

---

*Built with HTML5, CSS3, and Vanilla JavaScript — no frameworks or build tools needed.*
