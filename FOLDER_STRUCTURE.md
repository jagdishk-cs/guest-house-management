# Folder Structure

```
abg/
├── backend/
│   ├── config/db.js          # MongoDB connection (Atlas / local only)
│   ├── controllers/          # API business logic
│   ├── middleware/           # Auth, validation, async errors
│   ├── models/               # Mongoose schemas → MongoDB collections
│   ├── routes/               # Express REST routes
│   ├── seed/                 # Database seed scripts
│   └── server.js             # API entry point
├── frontend/
│   └── src/
│       ├── services/
│       │   ├── api.js        # REST API methods
│       │   └── client.js     # HTTP client + cross-page sync
│       └── ...
├── DATABASE.md               # MongoDB Atlas / local setup guide
└── README.md
```

**Data flow:** React UI → `api.js` → Express API → **MongoDB** (permanent collections)
