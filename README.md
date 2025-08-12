# Technical Analysis Market Dashboard

A modern, interactive stock market dashboard built with Angular 20 that provides real-time technical analysis with customizable indicators and intelligent market insights.

## Features

- **Interactive Price Charts**: Visualize stock prices with SVG-based charts
- **Technical Indicators**: SMA, EMA, RSI, MACD with real-time calculations
- **Time Period Selection**: View data across multiple timeframes (1D, 1W, 1M, 3M, 6M, 1Y)
- **Market Analysis**: Intelligent insights and sentiment analysis
- **Responsive Design**: Modern UI with Tailwind CSS and Material Design
- **Real-time Updates**: Dynamic data generation with realistic price movements

## Technologies

- **Angular 20**: Latest Angular with standalone components and signals
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Angular Material**: Professional UI components
- **RxJS**: Reactive programming patterns

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Market-Dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/demo` directory.

## Usage

1. **Search for Stocks**: Enter a stock symbol (e.g., AAPL, GOOGL, MSFT)
2. **Select Time Period**: Choose from 1D, 1W, 1M, 3M, 6M, or 1Y views
3. **Toggle Indicators**: Enable/disable technical indicators on the chart
4. **View Analysis**: Get market insights and sentiment analysis
5. **Explore Data**: Hover over chart points and indicators for detailed information

## Technical Indicators

- **Simple Moving Average (SMA)**: 20 and 50-period averages
- **Exponential Moving Average (EMA)**: 12 and 26-period averages
- **Relative Strength Index (RSI)**: 14-period momentum oscillator
- **MACD**: Moving Average Convergence Divergence with signal line and histogram

## Project Structure

```
src/
├── app/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Main application pages
│   ├── services/           # Business logic and data services
│   └── app.routes.ts       # Application routing
├── assets/                 # Static assets
└── global_styles.css       # Global styles and Tailwind config
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
