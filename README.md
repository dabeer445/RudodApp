# Rodud Trucking App

A React Native mobile application for managing and tracking shipments. This app allows users to create orders, track shipments, and manage delivery details.

## Features

- 📦 Order Management
  - Create new shipping orders
  - View order details and status
  - Cancel existing orders
  - Real-time status updates

- 💬 In-App Communication
  - Chat functionality for each order
  - Real-time messaging with support
  - Message history and notifications

- 🔄 Real-time Updates
  - Live order status tracking
  - Push notifications for status changes
  - Automatic data refresh

## Tech Stack

- **Frontend**
  - React Native
  - @gluestack-ui/themed for UI components
  - Axios for API requests
  - React Navigation for routing

- **State Management**
  - Custom hooks for API calls
  - Local state management with useState
  - Context API for global state

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- React Native development environment setup
- iOS/Android development environment

### Installation

1. Clone the repository
```bash
git clone [your-repo-url]
cd [your-project-name]
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Install iOS dependencies (iOS only)
```bash
cd ios
pod install
cd ..
```

4. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your configuration:
```
API_URL=your_api_url
```

5. Start the application
```bash
# Start Metro bundler
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android
```

## Project Structure

```
src/
├── components/        # Reusable components
├── screens/          # Screen components
├── services/         # API services
├── hooks/            # Custom hooks
├── navigation/       # Navigation configuration
├── context/         # Context providers
└── utils/           # Utility functions
```

## Key Components

### OrdersScreen
- Displays list of orders
- Implements infinite scroll
- Pull-to-refresh functionality
- Order filtering and sorting

### ChatContainer
- Real-time messaging interface
- Message history
- File/image sharing
- Typing indicators

### Custom Hooks
- `useApi`: Manages API calls and loading states
- `useAuth`: Handles authentication state
- `useOrders`: Manages order data and operations

## API Integration

The app integrates with a RESTful API:
- Base URL: `http://<LARAVEL API URL>api/v1`
- Authentication: Bearer token
- Pagination: Link-based pagination

### Key Endpoints

- `/orders` - Order management
- `/messages` - Chat functionality
- `/auth` - Authentication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Guidelines

### Code Style
- Follow ESLint configuration
- Use functional components
- Implement proper TypeScript types
- Follow component composition patterns

### Testing
- Write unit tests for utility functions
- Write integration tests for key features
- Use React Native Testing Library

### Performance Considerations
- Implement proper list virtualization
- Optimize image loading
- Minimize re-renders
- Use proper memoization

## Deployment

### iOS
1. Configure certificates in Apple Developer Portal
2. Update version in Xcode
3. Build and submit to App Store

### Android
1. Configure signing keys
2. Update version in build.gradle
3. Generate signed APK/Bundle
4. Submit to Play Store

## Troubleshooting

Common issues and solutions:

1. Build Errors
   - Clear watchman: `watchman watch-del-all`
   - Clear metro: `yarn start --reset-cache`
   - Rebuild iOS: `cd ios && pod install && cd ..`

2. Runtime Errors
   - Check API connectivity
   - Verify environment variables
   - Check authentication status
