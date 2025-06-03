# 🎨 3D GitHub Contributions Visualizer

Transform your GitHub contribution history into a stunning, interactive 3D experience. Explore your coding journey through beautiful visualizations with real-time data and immersive graphics.

## ✨ Features

- **🎯 Interactive 3D Visualization**: Navigate through your contribution history with smooth controls
- **🌓 Dark/Light Mode Support**: Seamlessly switch between themes with system preference detection
- **📊 Real-time Stats**: View total contributions, active days, and activity rates at a glance
- **🖼️ Export Functionality**: Save your 3D visualization as high-quality PNG images
- **📱 Responsive Design**: Optimized for all screen sizes and devices
- **⚡ Fast Performance**: Built with React Three Fiber for smooth 3D rendering
- **🎨 Beautiful UI**: Modern, clean interface with smooth animations
- **🔍 Detailed Tooltips**: Hover over bars to see contribution details for specific dates

## 📸 Screenshots

<!-- Add your screenshots here -->

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, pnpm, or bun
- A GitHub account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/3D-github-contribution-graph.git
   cd 3D-github-contribution-graph
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your GitHub token to `.env.local`:
   ```
   GITHUB_TOKEN=your_github_personal_access_token
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎮 Usage

1. **Enter a GitHub Username**: Type any public GitHub username in the input field
2. **Load Contributions**: Click the "Load" button to fetch and visualize the data
3. **Explore in 3D**: 
   - **Scroll** to zoom in/out
   - **Drag** to orbit around the visualization
   - **Hover** over bars to see detailed contribution information
4. **Switch Themes**: Use the theme toggle in the top-right corner
5. **Export Image**: Click "Export" to download your visualization as a PNG

## 🛠️ Tech Stack

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **3D Graphics**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [React Three Drei](https://github.com/pmndrs/drei)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom design system
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) components
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **API**: GitHub GraphQL API for contribution data

## 🏗️ Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # UI component library
│   ├── github-3d-contributions.tsx  # Main 3D component
│   └── theme-toggle.tsx   # Theme switcher
├── hooks/                 # Custom React hooks
│   └── use-theme.tsx     # Theme management
├── lib/                   # Utility functions
└── styles/               # Additional styles
```

## 🎨 Customization

### Color Scheme
The contribution colors follow GitHub's standard:
- **Empty**: `#2d333b` (no contributions)
- **Light Green**: `#39d353` (low activity)
- **Medium Green**: `#26a641` (medium activity)
- **Dark Green**: `#006d32` (high activity)
- **Darkest Green**: `#0e4429` (very high activity)

### 3D Settings
You can customize the 3D visualization by modifying:
- `BAR_SPACING`: Distance between contribution bars
- `Environment preset`: Lighting and background atmosphere
- Camera position and controls

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation when necessary

## 📊 API Limits

The application uses GitHub's API which has rate limits:
- **Authenticated requests**: 5,000 per hour
- **Unauthenticated requests**: 60 per hour

Make sure to add your GitHub token to avoid hitting rate limits quickly.

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch data" error**
   - Check if the GitHub username exists
   - Verify your GitHub token is valid
   - Check your internet connection

2. **3D visualization not loading**
   - Ensure WebGL is supported in your browser
   - Try disabling browser extensions
   - Clear browser cache

3. **Theme not switching**
   - Check if JavaScript is enabled
   - Clear localStorage data

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub](https://github.com) for providing the contribution data API
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) for amazing 3D capabilities
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Vercel](https://vercel.com) for deployment platform

## 🔗 Links

- **Live Demo**: [Your deployment URL]
- **GitHub Repository**: [Your repository URL]
- **Issues**: [Report bugs and request features]

---

<div align="center">
  <p>Made with ❤️ by [Your Name]</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>