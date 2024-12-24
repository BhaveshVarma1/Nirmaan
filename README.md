# NirmaanVerse - Personal Growth Platform

NirmaanVerse is a powerful personal growth and task management platform designed to help individuals achieve their goals and track their progress effectively.

## Features

- **Advanced Task Management**
  - Task categories and prioritization
  - Eisenhower Matrix for task organization
  - Time tracking and duration management
  - Task dependencies and prerequisites
  - Progress milestones

- **Analytics Dashboard**
  - Comprehensive task analytics
  - Progress visualization
  - Time management insights
  - Category-wise distribution
  - Completion rate tracking

- **Modern UI/UX**
  - Glassmorphic design
  - Responsive layout
  - Dark theme
  - Smooth animations
  - Intuitive interactions

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: Zustand + Immer
- **Data Visualization**: Recharts
- **Testing**: Vitest + Testing Library
- **Code Quality**: ESLint + Prettier
- **Type Safety**: TypeScript
- **Backend**: Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nirmaanverse.git
   cd nirmaanverse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage

## Project Structure

```
nirmaanverse/
├── src/
│   ├── components/     # React components
│   │   ├── tasks/     # Task-related components
│   │   ├── auth/      # Authentication components
│   │   └── ui/        # Reusable UI components
│   ├── lib/           # Utilities and helpers
│   │   ├── store/     # Zustand store
│   │   └── supabase/  # Supabase client
│   ├── types/         # TypeScript type definitions
│   └── test/          # Test setup and utilities
├── public/            # Static assets
└── config files       # Various configuration files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Recharts](https://recharts.org/)
- [Supabase](https://supabase.com/)
