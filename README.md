# 🎨 3D GitHub Contributions Visualizer

Transform your GitHub contribution history into a stunning, interactive 3D experience. Explore your coding journey through beautiful visualizations with real-time data and immersive graphics.

## 📸 Screenshots

![leerob_contributions_3d](https://github.com/user-attachments/assets/0c23ecc5-2b39-4e63-a920-6c6f32e5f2f6)

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


## 🤝 Contributing

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
