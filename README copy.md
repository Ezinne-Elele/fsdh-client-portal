# FSDH Client Portal

Frontend React application for the FSDH Custody Solution Client Portal. This is a single-page application (SPA) that provides clients with self-service access to their custody accounts, portfolio information, instructions, statements, and more.

## Features

- 🔐 **Secure Authentication** - JWT-based auth with MFA support
- 📊 **Portfolio Dashboard** - Real-time portfolio valuation and charts
- 📝 **Instruction Management** - Submit and track trading instructions
- 📄 **Statements & Reports** - Download statements in PDF/Excel formats
- 🔔 **Notifications** - Real-time alerts and notifications
- 👥 **Relationship Management** - Submit feedback and support tickets
- ✍️ **Mandate Management** - Upload and manage trading mandates
- 📈 **Analytics** - Portfolio insights and performance analytics
- 🔍 **Instruction Tracking** - Complete audit trail for all instructions
- ⚙️ **Account Management** - Self-service profile updates

## Technology Stack

- **React 18+** - UI library
- **Vite** - Build tool and dev server
- **Material-UI (MUI)** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Charts and graphs
- **Formik + Yup** - Form handling and validation
- **MSW** - API mocking for development

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Custody Core Solution backend running (or use MSW mocks)

## Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env` and set:
```
VITE_CORE_API=http://localhost:3000
```

3. **Start development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Development with MSW Mocks

If the backend is not running, MSW will automatically mock API responses. To enable/disable:

```env
VITE_ENABLE_MOCKS=true
```

MSW handlers are located in `src/mocks/handlers.js` and use Faker.js to generate realistic dummy data.

## Project Structure

```
client-portal/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout/         # Main layout with navigation
│   │   └── Charts/         # Chart components
│   ├── contexts/           # React contexts (Auth, etc.)
│   ├── pages/              # Page components
│   │   ├── Auth/           # Login, MFA, Password Reset
│   │   ├── Dashboard/      # Main dashboard
│   │   ├── Portfolio/      # Portfolio valuation
│   │   ├── Instructions/   # Instruction management
│   │   ├── Statements/     # Statements & reports
│   │   ├── Notifications/  # Notifications
│   │   ├── Relationship/   # Feedback forms
│   │   ├── Mandate/        # Mandate management
│   │   ├── Analytics/      # Analytics dashboard
│   │   ├── Tracking/       # Instruction tracking
│   │   └── Account/        # Account management
│   ├── services/           # API service wrappers
│   │   ├── api.js          # Axios instance
│   │   ├── authService.js
│   │   ├── clientService.js
│   │   ├── tradeService.js
│   │   ├── reportService.js
│   │   ├── notificationService.js
│   │   └── auditService.js
│   ├── mocks/              # MSW handlers
│   ├── theme.js            # MUI theme
│   ├── App.jsx             # Main app component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── package.json
├── vite.config.js
└── README.md
```

## API Integration

The portal integrates with the Custody Core Solution backend via REST APIs:

- **Authentication**: `/api/auth/*`
- **Clients**: `/api/clients/*`
- **Trades/Instructions**: `/api/trades`, `/api/instructions/*`
- **Reports**: `/api/reports/*`
- **Notifications**: `/api/notifications/*`
- **Audit**: `/api/audit/*`

All API calls are made through service wrappers in `src/services/` which handle:
- JWT token attachment
- Error handling
- Response transformation

## Authentication Flow

1. User logs in with email/password
2. If MFA is required, user is redirected to MFA verification
3. Upon successful auth, JWT token is stored in localStorage
4. Token is automatically attached to all API requests
5. Session timeout after 10 minutes of inactivity (configurable)

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Deployment

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel`
3. Set environment variables in Vercel dashboard

### Other Platforms

The built app can be deployed to any static hosting service:
- Netlify
- AWS S3 + CloudFront
- Azure Static Web Apps
- GitHub Pages

## Environment Variables

- `VITE_CORE_API` - Base URL for the Custody Core API (default: http://localhost:3000)
- `VITE_SESSION_TIMEOUT` - Session timeout in minutes (default: 10)
- `VITE_ENABLE_MOCKS` - Enable MSW mocking (default: true in dev)

## Testing

```bash
npm test
```

Tests use React Testing Library and Jest.

## Key Features Implementation

### Real-Time Updates
- Dashboard polls for updates every 30 seconds
- Notifications poll every 30 seconds
- Instruction status updates every 10 seconds

### Session Management
- Auto-logout after inactivity
- Activity tracking (mouse, keyboard, scroll)
- Configurable timeout

### Error Handling
- Global error boundaries
- API error interceptors
- User-friendly error messages

### Responsive Design
- Mobile-friendly layout
- Material-UI responsive grid
- Collapsible navigation on mobile

## Integration with Custody Core

The portal is designed to work seamlessly with the Custody Core Solution:

1. **Authentication**: Uses core's `/api/auth/login` endpoint
2. **Data Fetching**: All data comes from core APIs
3. **Instruction Submission**: Posts to core's instruction endpoints
4. **Audit Logging**: Fetches audit trails from core
5. **Notifications**: Receives notifications from core

## Development Notes

- MSW mocks are automatically enabled in development mode
- API calls are proxied through Vite dev server
- Hot module replacement (HMR) for fast development
- Source maps enabled for debugging

## Troubleshooting

### API Connection Issues
- Verify `VITE_CORE_API` is correct
- Check if backend is running
- Enable MSW mocks if backend unavailable

### Authentication Issues
- Clear localStorage
- Check JWT token expiration
- Verify MFA setup

### Build Issues
- Clear `node_modules` and reinstall
- Check Node.js version (v18+)
- Verify all environment variables

## License

ISC

## Support

For issues or questions, contact the development team.

