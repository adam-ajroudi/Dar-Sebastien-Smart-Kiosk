# 🏛️ Dar Sebastien Smart Kiosk

<div align="center">

![Status](https://img.shields.io/badge/Status-Work%20in%20Progress-orange?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![AI](https://img.shields.io/badge/AI-Gemini%202.5-blue?style=for-the-badge&logo=google)
![Proprietary](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)

**An AI-powered interactive kiosk for the International Cultural Center of Hammamet, Tunisia**

[Features](#-features) • [Installation](#-installation) • [Configuration](#-configuration) • [Roadmap](#-roadmap)

</div>

---

## 🎯 Project Overview

This project is being developed for **Dar Sebastien**, the International Cultural Center of Hammamet (Centre Culturel International de Hammamet), located in the historic villa built by Romanian financier George Sebastian in the 1920s.

The goal is to deploy an **interactive AI assistant on a large touchscreen kiosk** to:
- Welcome visitors to the cultural center
- Provide accurate historical information about the villa and its founder
- Answer questions about events, exhibitions, and the annual Hammamet Festival
- Serve visitors in multiple languages (Arabic, French, and English)

> ⚠️ **Work in Progress**: This application is currently under active development. Features may be incomplete or subject to change as we work with the cultural center to refine the experience.

---

## ✨ Features

### Currently Implemented

| Feature | Description |
|---------|-------------|
| 🎭 **Elishaar AI Guide** | Virtual cultural guide persona with elegant, knowledgeable responses |
| 🌍 **Multilingual Support** | Arabic (تونسية), French, and English with auto-detection |
| 🎙️ **Voice Input** | Speak questions using Web Speech API |
| 📚 **RAG Knowledge Base** | Retrieval-Augmented Generation for accurate historical answers |
| 🖥️ **Kiosk-Optimized UI** | Large touch targets, inactivity timeout, idle screen loop |
| 🎨 **Mediterranean Design** | Elegant theme inspired by the villa's aesthetic |

### Planned Features

- [ ] Background video loop on idle screen
- [ ] Integration with event calendar
- [ ] Admin panel for content management
- [ ] Offline mode support
- [ ] Analytics and visitor insights

---

## 🏗️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **AI Model** | Google Gemini 2.5 Flash (Free Tier) |
| **Vector Database** | ChromaDB |
| **Voice Recognition** | Web Speech API |
| **Styling** | Custom CSS Design System |
| **Deployment** | Netlify |

---

## 🚀 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gemini API key ([Get one free](https://aistudio.google.com/apikey))

### Setup

```bash
# Clone the repository
git clone https://github.com/adam-ajroudi/Dar-Sebastien-Smart-Kiosk.git
cd Dar-Sebastien-Smart-Kiosk

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Gemini API key to .env.local
# GEMINI_API_KEY=your_api_key_here

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the kiosk interface.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required: Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: ChromaDB Configuration (uses local by default)
CHROMA_HOST=localhost
CHROMA_PORT=8000
```

### Adding Knowledge Content

The kiosk uses RAG (Retrieval-Augmented Generation) to answer questions accurately. You can add documents via the API:

```bash
# Add text content
curl -X POST http://localhost:3000/api/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "text": "George Sebastian built the villa in 1920...",
    "title": "Villa History"
  }'

# Upload a PDF
curl -X POST http://localhost:3000/api/ingest \
  -F "file=@document.pdf"
```

---

## 📁 Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/           # AI chat endpoint
│   │   └── ingest/         # Document upload endpoint
│   ├── globals.css         # Design system
│   ├── layout.tsx          # Root layout with fonts
│   └── page.tsx            # Main kiosk page
├── components/
│   ├── ChatInterface.tsx   # Chat UI with voice input
│   └── IdleScreen.tsx      # Animated welcome screen
├── lib/
│   ├── ai/
│   │   ├── chat.ts         # Gemini integration
│   │   └── persona.ts      # Elishaar persona definition
│   └── rag/
│       ├── ingest.ts       # Document processing
│       └── vectorStore.ts  # ChromaDB operations
└── knowledge/              # Sample knowledge base files
```

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- ✅ Basic chat interface
- ✅ Multilingual support
- ✅ Voice input
- ✅ RAG pipeline
- 🔄 Document ingestion

### Phase 2: Content & Polish
- [ ] Official historical content from the center
- [ ] Background video for idle screen
- [ ] Refined UI animations
- [ ] Error handling improvements

### Phase 3: Production
- [ ] Admin dashboard
- [ ] Event calendar integration
- [ ] Kiosk hardware configuration
- [ ] Analytics & monitoring

### Phase 4: Enhancement
- [ ] Offline capability
- [ ] Photo/artifact gallery
- [ ] Virtual tour integration
- [ ] Visitor feedback system

---

## 🏛️ About Dar Sebastien

Dar Sebastien is a stunning Art Deco villa built in the 1920s by Romanian financier George Sebastian. Located on the Mediterranean coast in Hammamet, Tunisia, the villa is renowned for its beautiful architecture, iconic swimming pool, and lush gardens.

Since 1964, the villa has served as the **International Cultural Center of Hammamet** and is the primary venue for the annual **Festival International de Hammamet**, one of the oldest and most prestigious cultural festivals in the Arab world.

---

## 🤝 Contributing

This project is being developed specifically for Dar Sebastien. If you're interested in contributing or adapting this for another cultural institution, please open an issue to discuss.

---

## 📄 License

**Proprietary Software** - All Rights Reserved

This software is developed exclusively for the International Cultural Center of Hammamet (Dar Sebastien). Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

© 2026 - Developed for Centre Culturel International de Hammamet

---

<div align="center">

**Developed with ❤️ for the preservation and celebration of Tunisian cultural heritage**

*Centre Culturel International de Hammamet • Dar Sebastien • Hammamet, Tunisia*

</div>
