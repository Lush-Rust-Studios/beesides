# Beesides: A Modern Music Rating & Discovery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Beesides is a next-generation music cataloging, rating, and discovery platform built with performance, community, and comprehensive music metadata in mind. This project aims to reimagine the traditional music database experience with a modern, intuitive interface and powerful features.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Vision

To create the most comprehensive, user-friendly, and performant music database platform where enthusiasts can discover, rate, review, and discuss music while building meaningful connections with other music lovers.

## Key Features (Planned)

*   **Lightning-Fast Performance:** Sub-second page loads and seamless interactions.
*   **Modern UI/UX:** Intuitive design surpassing legacy platforms.
*   **Vibrant Community:** Enhanced social features and collaboration tools.
*   **Comprehensive Metadata:** High accuracy and depth in music information.
*   **Intelligent Discovery:** Adaptive recommendation algorithms.
*   **Advanced Rating System:** Granular 0.5-10.0 scale, track-by-track options.
*   **Rich Review System:** Markdown support, comparison reviews.
*   **Collection Management:** Multiple types, format-specific cataloging.
*   **Mobile-First:** Progressive Web App (PWA) with offline capabilities.

## Tech Stack

*   **Frontend:** Next.js 14+ (React Server Components)
*   **State Management:** Zustand
*   **Styling:** Tailwind CSS
*   **Database:** Supabase (PostgreSQL)
*   **Authentication:** Supabase Auth
*   **Linting/Formatting:** ESLint, Prettier

## Getting Started

### Prerequisites

*   Node.js (v20+ recommended)
*   npm, yarn, pnpm, or bun
*   Supabase account and project setup (details TBD)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd beesides-web-app
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```
3.  Set up environment variables:
    *   Create a `.env.local` file in the root directory.
    *   Add your Supabase project URL and anon key:
        ```
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

```
/src
├── app/         # Next.js App Router pages and layouts
│   ├── api/     # API routes
│   └── ...
├── components/  # Shared UI components
│   ├── auth/
│   ├── layout/
│   └── ui/
├── hooks/       # Custom React hooks
├── lib/         # Utility functions, Supabase client, etc.
│   ├── supabase/
│   └── utils/
├── store/       # State management (Zustand)
└── types/       # TypeScript definitions
```

## Learn More

To learn more about Next.js, take a look at the following resources:

*   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
*   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Contributing

Contribution guidelines will be added soon. (See `CONTRIBUTING.md` - TBD)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details (TBD).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# beesides
