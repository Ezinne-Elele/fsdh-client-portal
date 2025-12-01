# Quick Start Guide - Client Portal

## Prerequisites

- Node.js v18+
- npm or yarn
- (Optional) Custody Core Solution backend running

## Setup

1. **Install dependencies**:
```bash
cd client-portal
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_CORE_API=http://localhost:3000
```

3. **Start development server**:
```bash
npm run dev
```

Visit `http://localhost:5173`

## Using with Backend

1. Start the Custody Core Solution backend (see backend README)
2. Ensure backend is running on port 3000 (or update `VITE_CORE_API`)
3. The portal will automatically connect to the backend

## Using with MSW Mocks (No Backend)

If the backend is not running, MSW will automatically mock all API calls:

1. Ensure `VITE_ENABLE_MOCKS=true` in `.env` (default in dev)
2. Start the dev server
3. All API calls will be mocked with realistic dummy data

## Default Login (Mocked)

When using MSW mocks, you can login with any credentials:
- Email: `client@example.com`
- Password: `any`

## Features to Test

1. **Dashboard** - View portfolio summary and charts
2. **Portfolio** - See holdings and valuations
3. **Instructions** - Submit and track trading instructions
4. **Statements** - Download statements (mocked)
5. **Notifications** - View alerts and notifications
6. **Account** - Update profile information

## Building for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## Deployment to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Set environment variables in Vercel dashboard

## Troubleshooting

### Port Already in Use
Change port in `vite.config.js`:
```js
server: {
  port: 5174, // Change this
}
```

### API Connection Errors
- Check `VITE_CORE_API` in `.env`
- Verify backend is running
- Enable MSW mocks if backend unavailable

### Module Not Found
```bash
rm -rf node_modules package-lock.json
npm install
```

