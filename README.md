# 🎶 Spotify Jukebox

**Spotify Jukebox** turns your Spotify library into a fully featured, smart radio station — complete with dynamic track selection, song metadata management, and a powerful dashboard.

Built with **Next.js 15**, **Prisma**, and **PostgreSQL**, this project brings intelligent music automation to life.

> 🛰️ Part of [Queue FM](https://github.com/splinesreticulating/queuefm) – a Spotify-powered radio station with a smart, self-updating playlist.

---

## 🚀 Features

- 🎵 **Smart Music Playback**: Dynamically selects and queues songs based on metadata like BPM, energy, key, and recent playback.
- 🎚️ **Admin Dashboard**: Manage tracks, settings, and view detailed playback statistics.
- 📈 **Track Analysis**: Visualize song attributes to optimize listening experience.
- 🔍 **Search and Edit Songs**: Quickly search your collection and fine-tune metadata.
- ⚡ **Serverless APIs**: Efficient, lightweight serverless functions deployed via Vercel.
- 🔐 **Authentication**: Secure login system using NextAuth.js.

---

## 🛠️ Tech Stack

| Technology | Description |
|:---|:---|
| [Next.js](https://nextjs.org/) | React-based framework for frontend and API routes |
| [Prisma](https://www.prisma.io/) | Database ORM for PostgreSQL |
| [PostgreSQL](https://www.postgresql.org/) | Relational database |
| [Vercel](https://vercel.com/) | Hosting and deployment |

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/splinesreticulating/spotify-jukebox.git
cd spotify-jukebox
```

Install dependencies:

```bash
yarn install
```

Set up environment variables:

```bash
cp .env.example .env
```
Then update `.env` with your credentials (Spotify API keys, database connection URL, etc.)

Generate Prisma client:

```bash
yarn prisma generate
```

Push the database schema:

```bash
yarn prisma db push
```

Seed the database:

```bash
yarn prisma:seed
```

Run the local development server:

```bash
yarn dev
```

Visit `http://localhost:3000` in your browser.

---

## ⚙️ Environment Variables

You will need to set the following variables in your `.env` file:

| Variable | Purpose |
|:---|:---|
| `DATABASE_URL` | PostgreSQL database connection string |
| `NEXTAUTH_SECRET` | Secret for session encryption |
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks |

(Additional variables may be needed depending on your setup.)

---

## 🔥 Deployment

The app is optimized for deployment on **Vercel**.

When deploying:
- Make sure your environment variables are set in Vercel dashboard → Project → Settings → Environment Variables.
- The `postinstall` script will automatically run `prisma generate` after installing dependencies.

---

## 🧠 Future Improvements

- 🎚️ Fine-grained playlist creation controls
- 🎶 Crossfade and smart transition support
- 📱 Mobile app integration
- 🎨 UI/UX polish for a more immersive experience
- 🌐 Custom domain setup

---

## 🤝 Contributing

Pull requests and issues are welcome!  
If you have ideas for new features or enhancements, feel free to open an issue or PR.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

## 👋 About the Author

Developed by [Splines Reticulating](https://github.com/splinesreticulating).  
Focused on building smart, user-centric music tools and automation projects.
