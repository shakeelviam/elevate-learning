# Elevate Learning — Full-Stack Website

A production-ready, bilingual (Arabic/English) website for Elevate Learning, Kuwait's premier language training institute. Built with Next.js 15, Tailwind CSS 4, Sanity CMS, Clerk Auth, and Resend.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- A [Sanity.io](https://sanity.io) account
- A [Clerk](https://clerk.com) account
- A [Resend](https://resend.com) account

### 1. Clone & Install

```bash
git clone <your-repo-url> elevate-learning
cd elevate-learning
npm install
```

### 2. Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in all required values in `.env.local` (see comments in the file).

### 3. Set Up Sanity

```bash
# Log into Sanity CLI
npx sanity login

# Deploy the schema
npm run sanity -- deploy

# Start Sanity Studio locally
npm run sanity
```

Access Studio at: http://localhost:3333

Populate `siteSettings` first — this powers the home page hero, contact info, and navigation.

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en`.

---

## 🌐 Features

| Feature | Status |
|---------|--------|
| Bilingual EN/AR with full RTL | ✅ |
| Sanity CMS (all content editable) | ✅ |
| Clerk authentication | ✅ |
| Resend email (registration + contact) | ✅ |
| Course listing with filters | ✅ |
| Course detail with enrollment modal | ✅ |
| Registration stored in Sanity | ✅ |
| User dashboard with registrations | ✅ |
| Blog with pagination | ✅ |
| SEO: metadata, hreflang, JSON-LD | ✅ |
| Server-side sitemap.xml | ✅ |
| WhatsApp floating button | ✅ |
| VPS-ready (no Vercel APIs) | ✅ |
| PM2 + Dockerfile | ✅ |
| MyFatoorah hook (ready, not wired) | 🔜 Phase 2 |
| LMS integration hook | 🔜 Phase 3 |

---

## 📁 Project Structure

```
elevate-learning/
├── src/
│   ├── app/
│   │   ├── [locale]/          # All localized pages
│   │   │   ├── page.tsx       # Home
│   │   │   ├── courses/       # Course list + detail
│   │   │   ├── blog/          # Blog list + post
│   │   │   ├── dashboard/     # User dashboard (protected)
│   │   │   ├── contact/       # Contact + email action
│   │   │   ├── about/
│   │   │   ├── faq/
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/
│   │   │   └── registration/  # Registration API + Phase 2 hook
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── layout/            # Header, Footer, WhatsApp
│   │   ├── ui/                # Shadcn-style primitives
│   │   ├── home/              # Hero, Stats, Testimonials, FAQ
│   │   ├── courses/           # CourseCard, CourseFilters, EnrollButton
│   │   ├── forms/             # RegistrationModal
│   │   └── shared/            # PortableText, SectionHeader
│   ├── i18n/                  # next-intl config
│   ├── lib/                   # utils, email, validations
│   ├── hooks/                 # useToast
│   └── types/                 # TypeScript types
├── sanity/
│   ├── schemas/               # All Sanity document types
│   ├── plugins/               # Desk structure
│   └── lib/                   # Client, imageUrl, queries
├── messages/
│   ├── en.json                # English strings
│   └── ar.json                # Arabic strings
├── sanity.config.ts
├── ecosystem.config.cjs       # PM2 config
└── Dockerfile
```

---

## 🚢 VPS Deployment

### With PM2

```bash
# Install PM2 globally
npm install -g pm2

# Build
npm run build

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### With Docker

```bash
docker build \
  --build-arg NEXT_PUBLIC_APP_URL=https://yourdomain.com \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx \
  --build-arg NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id \
  -t elevate-learning .

docker run -d \
  -p 3000:3000 \
  --env-file .env.local \
  --restart unless-stopped \
  elevate-learning
```

### Nginx Reverse Proxy (recommended)

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Use Certbot for SSL: `certbot --nginx -d yourdomain.com`

---

## 🔜 Phase 2: MyFatoorah Payment

To add payment:

1. Uncomment the payment fields in `sanity/schemas/registration.ts`
2. Add `MYFATOORAH_API_KEY` to `.env.local`
3. Create `src/lib/myfatoorah.ts` with the payment client
4. Uncomment the payment block in `src/app/api/registration/route.ts`
5. Add a webhook endpoint at `/api/webhooks/myfatoorah`

---

## 🔜 Phase 3: LMS Integration

1. Uncomment the LMS fields in `sanity/schemas/registration.ts`
2. Add `LMS_API_URL` and `LMS_API_KEY` to `.env.local`
3. In the payment webhook handler, call LMS API to provision user and grant course access

---

## 📧 Sanity Studio

Access at `/studio` when running the app, or at `http://localhost:3333` with `npm run sanity`.

**First steps in Studio:**
1. Create `siteSettings` — hero content, contact info, social links
2. Create at least one `instructor`
3. Create courses with images, descriptions, and syllabi
4. Create schedules for courses
5. Add testimonials
6. Write blog posts

---

## 🧪 Testing Checklist

- [ ] Home page loads in English, switch to Arabic → layout mirrors (RTL)
- [ ] Browse courses, filter by category/level
- [ ] View course detail, see schedules
- [ ] Submit registration form → check Sanity Studio for new entry
- [ ] Contact form → check institute email
- [ ] Sign up with Clerk → see dashboard → registrations shown
- [ ] `/sitemap.xml` returns valid XML
- [ ] `npm run build` succeeds without errors

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 App Router (TypeScript strict)
- **Styling**: Tailwind CSS 4 + custom design system
- **CMS**: Sanity v3 with document internationalization
- **Auth**: Clerk
- **Email**: Resend
- **Validation**: Zod + React Hook Form
- **i18n**: next-intl (EN/AR, RTL)
- **Deployment**: Node.js 20 standalone on Ubuntu VPS

---

*Made with ❤️ for Kuwait 🇰🇼*
