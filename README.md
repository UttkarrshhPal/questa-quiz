# Questa

Questa is a simple fullstack quiz app that lets users create and share quizzes. Public users can view and respond to them.

## Features

- **User Authentication**: Secure email-based signup and login using Better Auth
- **Quiz Creation**: Create quizzes with multiple question types (single-choice, short text)
- **Public Sharing**: Share quizzes via public links - no login required for respondents
- **Response Tracking**: View all responses to your quizzes
- **Modern UI**: Built with Tailwind CSS and Shadcn UI components

## Tech Stack

- **Frontend**: React.js, Next.js 14 (App Router), TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: Better Auth
  

## Live URL

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/questa.git
cd questa
```
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your database connection string and Better Auth credentials
4. Run the development server:
```bash
npm run dev
```
5. Open your browser and go to `http://localhost:3000`
6. Register a new account or log in with existing credentials
7. Start creating and sharing quizzes!
## Environment Variables
- `DATABASE_URL`: Your PostgreSQL connection string
- `BETTER_AUTH_SECRET`: Your Better Auth client secret
- `BETTER_AUTH_URL`: Your Better Auth client url
- `NEXT_PUBLIC_APP_URL`: The URL of your Next.js app (e.g., `http://localhost:3000`)


## Sample Credentials
- Email: test@example.com
- Password: 12345678

---

© Utkarsh Pal | [GitHub](https://github.com/UttkarrshhPal) | [LinkedIn](https://www.linkedin.com/in/utkarsh-pal-/)
