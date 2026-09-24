# Studienotater

Studienotater is a web application for organizing study material, notes, learning resources, and progress in one place.

The project is primarily developed for university studies and provides a structured way to organize subjects, topics, notes, concepts, exams, and other study resources.

## Features

Studienotater includes functionality for:

- Organizing subjects by semester and study year
- Creating and reading structured study notes
- Organizing content by topics and subtopics
- Linking concepts directly inside notes
- Viewing definitions, theorems, examples, and related concepts
- Tracking progress through subjects and course content
- Managing exam-related content and tasks
- Working with flashcards and practice questions
- Viewing PDFs and other study resources
- Organizing educational videos and programming material
- Searching across study content
- Marking and accessing favorite content
- Managing study content through admin pages
- User authentication and user-specific data

## Tech Stack

The application is built with:

- **React** – user interface
- **TypeScript** – type-safe application development
- **Vite** – development server and build tool
- **React Router** – client-side routing
- **Supabase** – authentication and database
- **Tiptap** – rich-text note editor
- **KaTeX** – mathematical notation
- **Lowlight** – syntax highlighting
- **Lucide React** – icons
- **CSS** – styling and responsive layout
- **GitHub Pages** – deployment

## Project Structure

The main application code is located in `src/`.

```text
src/
├── assets/          # Images and other static assets
├── components/      # Reusable UI components
├── context/         # React context providers
├── data/            # Static application data
├── hooks/           # Custom React hooks
├── lib/             # Library configuration
├── pages/           # Application pages
├── services/        # Data access and application services
├── styles/          # Shared styles
├── types/           # Shared TypeScript types
└── utils/           # Utility functions
```

### Components

Components are grouped by functionality:

```text
components/
├── auth/            # Authentication and protected routes
├── common/          # Shared components
├── concepts/        # Concept linking and concept UI
├── exams/           # Exam-related components
├── home/            # Home page components
├── layout/          # Navigation and page layout
├── lesson/          # Lesson components
├── media/           # Media-related components
├── notes/           # Note viewing and editing
├── progress/        # Study progress tracking
├── search/          # Search functionality
└── subjects/        # Subject-related components
```

### Pages

Pages represent the main routes and views of the application.

The application currently contains pages for areas such as:

- Home
- Subjects
- Notes
- Concepts
- Exams
- Flashcards
- PDFs
- Videos
- Programming
- Calendar
- Favorites
- Profile
- Settings
- Admin tools

### Services

The `services/` directory separates data access and application logic from the UI.

Services are currently organized around:

```text
services/
├── concepts/
├── exams/
├── media/
├── notes/
├── practice/
├── progress/
├── search/
├── study/
└── subjects/
```

## Getting Started

### Prerequisites

Make sure you have Node.js and npm installed.

You can verify the installation with:

```bash
node --version
npm --version
```

### Installation

Clone the repository and enter the project directory:

```bash
git clone <repository-url>
cd studienotater
```

Install the dependencies:

```bash
npm install
```

## Environment Variables

The project uses Supabase for authentication and data storage.

Create a `.env` file in the project root with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

These values can be found in the Supabase project configuration.

The `.env` file should not be committed to Git.

## Running Locally

Start the development server:

```bash
npm run dev
```

Vite will start a local development server and display the local URL in the terminal.

## Available Scripts

### Development

```bash
npm run dev
```

Starts the Vite development server.

### Build

```bash
npm run build
```

Runs the TypeScript build and creates a production build using Vite.

### Lint

```bash
npm run lint
```

Runs ESLint across the project.

### Preview

```bash
npm run preview
```

Locally previews the production build.

### Deploy

```bash
npm run deploy
```

Builds the application and deploys the contents of `dist/` using `gh-pages`.

## Deployment

The application is configured for deployment with GitHub Pages.

Before deployment, the `predeploy` script automatically runs:

```bash
npm run build
```

The generated `dist/` directory is then deployed using `gh-pages`.

## Development Status

Studienotater is under active development. Features, application structure, and data handling may change as the project continues to evolve.
