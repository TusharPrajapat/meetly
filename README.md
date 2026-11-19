# Video Conferencing Application

Monorepo structure containing the frontend and backend for the Video Conferencing Application.

## Folder Structure

```text
video-conferencing-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   └── server.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   ├── types/
    │   ├── utils/
    │   ├── App.tsx
    │   └── main.tsx
    ├── public/
    ├── package.json
    └── tsconfig.json
```

## How to Run

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

* Dev Server running at `http://localhost:5173`
