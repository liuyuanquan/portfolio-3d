# Portfolio 2020

As a quarantine project, I wanted to learn 3D web development, and decided to revamp my portfolio into an interactive 3D world built using [Three.js](https://github.com/mrdoob/three.js) and [Ammo.js](https://github.com/kripken/ammo.js), a port of the [Bullet physics engine](https://pybullet.org/wordpress/) to JavaScript. I had an absolute blast making this!

Try it out! [https://www.0xfloyd.com/](https://www.0xfloyd.com/)

I wrote an article explaining the site [here](https://dev.to/0xfloyd/create-an-interactive-3d-portfolio-website-that-stands-out-to-employers-47gc)

![alt text](/img/portfolio_2020.gif)

## Motivation

While exploring [Google Experiments](https://experiments.withgoogle.com/) I discovered an amazing world of web rendering. There are so many incredible web projects out there, and I wanted to learn this technology. I was inspired by many awesome projects, but specifically examples from the [official examples/documentation](https://threejs.org/), [Lee Stemkoski](https://home.adelphi.edu/~stemkoski/) and [Three.js Fundamentals](https://threejsfundamentals.org/).

## Features

- Physics engine (Ammo.js) combined with 3D rendered objects (Three.js) for real-time movement, collision detection and interaction
- Desktop and Mobile Responsiveness with both keyboard and touch screen controls
- Raycasting with event listeners for user touch and click interaction
- FPS tracker to monitor frame rate/ rendering performance
- Fast development experience with Vite's HMR (Hot Module Replacement)
- Optimized build output for production

## Technology

- Three.js (3D Graphics)
- Ammo.js (Physics Engine)
- JavaScript (ES Modules)
- Node.js
- Vite (build tool and dev server)
- HTML/CSS
- Git (version control) / Github for code hosting

## Requirements

- Node.js >= 18.0.0
- npm >= 9.0.0

## Usage

### Development

To run the development server locally:

```bash
npm install
npm run dev
```

The development server will start at `http://localhost:5173` (or the next available port).

### Build

To build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview

To preview the production build locally:

```bash
npm run preview
```

## License

The project is licensed under the MIT License.
