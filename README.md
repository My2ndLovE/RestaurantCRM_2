# Happy Potato Loyalty App

A modern, feature-rich loyalty rewards application built with React, Vite, and Tailwind CSS v4, designed for the Happy Potato restaurant brand.

## 🎨 Features

- **Points Tracking**: Real-time points balance and progress visualization
- **Daily Check-In**: Streak-based rewards system
- **Interactive Games**: 
  - Flavor Spin (Wheel of Fortune)
  - Lucky Scratch Cards
- **Rewards Redemption**: Browse and redeem exclusive offers
- **Rate & Earn**: Submit feedback to earn bonus points
- **Referral System**: Share and earn rewards
- **Leaderboard**: Weekly top earners ranking
- **Tier Status**: Track loyalty tier progression

## 🚀 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **Animations**: Framer Motion + Lottie React
- **Icons**: Lucide React

## 📦 Installation

```bash
cd loyalty-app
npm install
```

## 🛠️ Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 🏗️ Build

```bash
npm run build
```

Build output will be in the `loyalty-app/dist` directory.

## 🌐 Deployment to Cloudflare Pages

### Automatic Deployment (Recommended)

1. **Connect Repository**:
   - Go to [Cloudflare Pages Dashboard](https://dash.cloudflare.com/)
   - Click "Create a project"
   - Connect your GitHub account
   - Select the `RestaurantCRM_2` repository

2. **Configure Build Settings**:
   - **Framework preset**: Vite
   - **Build command**: `cd loyalty-app && npm install && npm run build`
   - **Build output directory**: `loyalty-app/dist`
   - **Root directory**: `/` (leave as root)
   - **Node version**: 18 or higher

3. **Deploy**:
   - Click "Save and Deploy"
   - Cloudflare will automatically build and deploy your app
   - You'll get a `*.pages.dev` URL

### Manual Deployment

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the project
cd loyalty-app
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy dist --project-name=happy-potato-loyalty
```

## 🎨 Brand Colors

- **Primary Yellow**: `#FFD100`
- **Primary Red**: `#E31837`
- **Primary Purple**: `#5E2750`
- **Accent Orange**: `#FFA500`
- **Dark Brown**: `#4E342E`
- **Warm Cream Background**: `#FFFDF5`

## 📱 Features Overview

### Home Page
- Hero carousel with promotional banners
- Points card with tier progress
- Daily check-in streak tracker
- Quick actions (Scan Receipt, Spin & Win)
- Hot deals section

### Earn Page
- QR code scanner for receipt validation
- Rate & Earn feedback system
- Referral program

### Game Page
- Flavor Spin wheel game
- Lucky Scratch cards
- Potato Trivia (coming soon)
- Weekly leaderboard

### Rewards Page
- Browse available rewards
- Filter by category
- Redeem with points

### Profile Page
- Transaction history
- My vouchers
- Tier status details

## 🔧 Environment Variables

No environment variables required for the demo version. All data is mocked in `src/data/mockData.js`.

## 📄 License

MIT

## 🤝 Contributing

This is a demo project for the Happy Potato restaurant loyalty program.
