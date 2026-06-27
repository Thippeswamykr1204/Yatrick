# 🌍 YATRIK – AI Travel Planner

YATRIK is an AI-powered travel planning platform that generates personalized travel itineraries based on a user's destination, trip duration, budget, and interests.

The application leverages Generative AI to create day-by-day travel plans, estimate trip costs, recommend hotels and attractions, and allow users to dynamically modify their itinerary.

---

# 🚀 Project Overview

Planning a trip often requires researching destinations, attractions, transportation, accommodations, and budgeting.

YATRIK simplifies this process by using AI to:

- Generate complete travel itineraries in seconds
- Recommend attractions based on user interests
- Provide estimated trip budgets
- Suggest accommodations
- Regenerate individual days of a trip
- Chat with an AI travel assistant
- Save and manage trips

The goal is to provide a seamless and intelligent trip-planning experience.

---

# 🛠 Tech Stack

## Frontend

### Next.js 15
- Server-side rendering support
- Fast routing
- Excellent developer experience
- Production-ready React framework

### TypeScript
- Strong type safety
- Better maintainability
- Reduced runtime errors

### Tailwind CSS
- Rapid UI development
- Consistent design system
- Responsive design support

### Framer Motion
- Smooth animations
- Improved user experience

### Zustand
- Lightweight state management
- Simpler than Redux
- Minimal boilerplate

---

## Backend

### Node.js
- Fast and scalable runtime
- JavaScript across full stack

### Express.js
- Lightweight backend framework
- Easy API development

### TypeScript
- Shared type safety with frontend

---

## Database

### MongoDB Atlas
- Flexible document storage
- Ideal for itinerary-based data
- Easy scalability

### Mongoose
- Schema validation
- Cleaner database interactions

---

## AI Integration

### Google Gemini API
Used to:

- Generate travel itineraries
- Recommend attractions
- Suggest hotels
- Estimate budgets
- Answer travel-related questions

Gemini was chosen because:

- Strong reasoning capabilities
- Fast response times
- Cost-effective API access

---

# 🏗 High-Level Architecture

```text
┌─────────────────────┐
│      Frontend       │
│     Next.js App     │
└──────────┬──────────┘
           │
           │ REST API
           ▼
┌─────────────────────┐
│       Backend       │
│  Node + Express API │
└──────────┬──────────┘
           │
           ├─────────────► Gemini API
           │
           ▼
┌─────────────────────┐
│      MongoDB        │
│      Atlas DB       │
└─────────────────────┘
```

### Flow

1. User submits trip requirements.
2. Frontend sends request to backend.
3. Backend validates data.
4. Gemini generates itinerary.
5. Backend stores trip in MongoDB.
6. Response is returned to frontend.
7. User can edit or regenerate itinerary sections.

---

# 🔐 Authentication & Authorization

## Authentication

Implemented using:

- JSON Web Tokens (JWT)
- Secure password hashing with bcrypt

Workflow:

1. User registers.
2. Password is hashed before storage.
3. User logs in.
4. JWT token is issued.
5. Token is sent in Authorization headers.
6. Protected routes verify token validity.

---

## Authorization

Users can only:

- Access their own trips
- Edit their own itineraries
- Delete their own data

Middleware verifies ownership before allowing modifications.

---

# 🤖 AI Agent Design

The AI Agent is the core component of YATRIK.

## Responsibilities

- Understand travel preferences
- Generate personalized itineraries
- Estimate travel costs
- Recommend attractions
- Recommend accommodations
- Answer trip-related questions
- Regenerate specific travel days

---

## AI Workflow

```text
User Input
      │
      ▼
Prompt Builder
      │
      ▼
Gemini API
      │
      ▼
Structured JSON Response
      │
      ▼
Validation Layer
      │
      ▼
Database Storage
      │
      ▼
Frontend Display
```

---

## Prompt Engineering

The backend creates structured prompts including:

- Destination
- Number of days
- Budget
- Interests
- Travel style

The AI returns structured JSON which is validated before being saved.

This prevents malformed responses and improves reliability.

---

# ✨ Creative / Custom Feature

## Smart Day Regeneration

One unique feature of YATRIK is:

### Regenerate Individual Day

Instead of regenerating an entire itinerary, users can regenerate only a specific day.

Benefits:

- Saves time
- Preserves existing plans
- Produces more flexible itineraries

Example:

Original Day 3:

- Museum Visit
- Local Market
- Dinner

Regenerated Day 3:

- Historical Fort
- River Cruise
- Cultural Show

Without affecting any other day.

---

## Additional Enhancements

- AI Travel Assistant Chat
- Budget Summary Dashboard
- Interactive Itinerary Cards
- Responsive Mobile Design
- Smooth Animations
- Modern Premium UI

---

# 🎨 Design Decisions & Trade-Offs

## Decision 1: MongoDB vs SQL

Chosen:

### MongoDB

Reason:

Travel itineraries contain deeply nested structures:

```json
{
  "days": [
    {
      "activities": []
    }
  ]
}
```

MongoDB stores this naturally without complex joins.

Trade-Off:

Less relational consistency compared to SQL databases.

---

## Decision 2: Zustand vs Redux

Chosen:

### Zustand

Reason:

- Lightweight
- Easier learning curve
- Minimal setup

Trade-Off:

Redux offers more advanced debugging tools.

---

## Decision 3: Gemini API

Chosen:

### Gemini

Reason:

- Fast responses
- Good reasoning
- Lower cost

Trade-Off:

Occasionally returns incomplete structured data which requires backend validation.

---

## Decision 4: Server-Side Architecture

Chosen:

### AI Processing on Backend

Reason:

- Protects API keys
- Better validation
- Centralized business logic

Trade-Off:

Additional backend processing layer.

---

# ⚠ Known Limitations

### 1. AI Hallucinations

Generated recommendations may occasionally contain inaccuracies.

Mitigation:

- Response validation
- Structured prompts

---

### 2. Cost Estimates

Budgets are approximate and may differ from real-world prices.

---

### 3. No Real-Time Booking

The platform currently:

- Does not book hotels
- Does not book flights
- Does not book transportation

It only provides recommendations.

---

### 4. Rate Limits

Gemini API usage may be affected by API quota restrictions.

---

### 5. Internet Dependency

AI itinerary generation requires an active internet connection.

---

# 📦 Local Setup Instructions

## Clone Repository

```bash
git clone https://github.com/Thippeswamykr1204/yatrik.git

cd yatrik
```

---

## Backend Setup

```bash
cd backend

npm install
```

Create:

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret

GEMINI_API_KEY=your_gemini_api_key
```

Run:

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:3000
```

---

# ☁️ Deployment Instructions

## Frontend Deployment

Recommended:

### Vercel

```bash
vercel
```

Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

## Backend Deployment

Recommended:

### Render

```bash
Build Command:
npm install && npm run build

Start Command:
npm start
```

Environment Variables:

```env
PORT
MONGODB_URI
JWT_SECRET
GEMINI_API_KEY
```

---

## Database

### MongoDB Atlas

1. Create cluster
2. Whitelist IPs
3. Create database user
4. Add connection string to backend environment variables

---

# 📸 Screenshots

Add application screenshots here.

```text
/screenshots
    landing-page.png
    dashboard.png
    itinerary.png
    assistant-chat.png
```

---

# 👨‍💻 Author

Thippeswamy K R
Full-Stack Developer

