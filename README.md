# Mail Builder 2026

A modern, drag-and-drop email template editor built with React 19, TypeScript, and MobX. Create beautiful, responsive email templates with an intuitive visual interface.

![Mail Builder](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![MobX](https://img.shields.io/badge/MobX-6-orange)

## ✨ Features

### Editor
- **Drag & Drop Interface** - Drag blocks and layouts onto the canvas
- **Multi-Column Layouts** - 10+ pre-built column configurations (1-5 columns with various ratios)
- **Responsive Preview** - Desktop, Tablet (iPad), and Mobile (iPhone) viewport modes
- **Dark/Light Theme** - Toggle between themes with custom scrollbar styling

### Panels
- **Elements Panel** - Drag blocks: Image, Spacer, Headline, Paragraph, Button, Column, Blog Post, Inner Section, Form
- **Layers Panel** - Dynamic tree view of document structure (Body → Rows → Columns → Blocks)
- **Global Styles Panel** - Configure colors, typography for Body, Heading, Subheading, Buttons, Links
- **Assets Panel** - Image library with search, upload, and drag-to-canvas functionality

### Style Controls
- **Container Controls** - Flexbox/Grid layout, width, min-height, direction, justify, align, gaps, wrap
- **Spacing Controls** - Margin and padding with merged/individual side modes
- **Border Controls** - Radius (all/individual corners), side borders, style, width, color
- **Dimension Controls** - Width, height with unit selection (px, %, vw, em)

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 7 |
| State Management | MobX + mobx-react-lite |
| Styling | SCSS + styled-components + Tailwind CSS |
| Icons | Lucide React |
| Code Quality | ESLint + Prettier + Husky |

## 📁 Project Structure

```
src/
├── components/
│   ├── assets/           # Assets panel components
│   ├── canvasComponents/ # Canvas blocks and rows
│   ├── controls/         # Style control components
│   │   ├── border/       # Border controls
│   │   └── container/    # Container/flexbox controls
│   ├── globalStyles/     # Global styles panel sections
│   ├── layers/           # Layers tree components
│   └── sidebarTabs/      # Content, Style, Container tabs
├── stores/
│   └── EditorStore.ts    # MobX store for editor state
├── styles/
│   ├── _variables.scss   # Design tokens (colors, spacing)
│   ├── _mixins.scss      # SCSS mixins
│   ├── main.scss         # Global styles
│   └── tokens.ts         # TypeScript design tokens
└── App.tsx               # Main application component
```

## 🎨 Architecture Principles

### Code Organization
- **Max 100 lines per file** - Keep files focused and maintainable
- **Self-contained components** - Each component manages its own logic
- **Minimal prop drilling** - Use MobX stores for state management

### Styling Rules
- **Single Container Pattern** - One styled-component per component
- **Nested classNames** - Use className with nested CSS selectors
- **CSS Variables** - Theme support via `var(--bg-primary)`, `var(--text-primary)`, etc.

### Component Pattern
```tsx
const Container = styled.div`
  .header { /* styles */ }
  .content { /* styles */ }
`

export const MyComponent = observer(() => (
  <Container>
    <div className="header">...</div>
    <div className="content">...</div>
  </Container>
))
```

## 🎯 Key Components

| Component | Description |
|-----------|-------------|
| `TopBar` | Device viewport switcher, theme toggle, save/export buttons |
| `IconSidebar` | Left icon panel for switching between panels |
| `BlockSelectPanel` | Draggable block elements and layout options |
| `Sidebar` | Style editing tabs (Content, Style, Container) |
| `Canvas` | Main editing area with responsive device frames |
| `LayersPanel` | Document structure tree view |
| `GlobalStylesPanel` | Global color and typography settings |
| `AssetsPanel` | Image asset library |

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint:fix` | Fix ESLint issues |
| `pnpm format` | Format with Prettier |

## 🎨 Theming

The app supports light and dark themes via CSS custom properties:

```scss
:root {
  --bg-primary: #1f2124;      // Main background
  --bg-secondary: #0c0d0e;    // Darker elements
  --text-primary: #d1d5db;    // Primary text
  --accent: #60a5fa;          // Accent color
  --input-bg: #0c0d0e;        // Input backgrounds
  --input-border: #374151;    // Input borders
}

:root[data-theme='light'] {
  --bg-primary: #f9fafb;
  --bg-secondary: white;
  --text-primary: #1f2937;
  // ...
}
```

## 📄 License

MIT
