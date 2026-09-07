# kiatri-site

Marketing/sales website for Kiatri hosted VoIP & call center services. Static
Next.js site — informs and builds trust, then hands off to WHMCS
(`calling.kiatri.com`) for actual checkout and billing. No backend or
database of its own.

## Stack
- Next.js 14 (App Router), static export (`output: 'export'`)
- TypeScript
- Tailwind CSS

## Local development
```bash
npm install
npm run dev       # http://localhost:3000
```

## Production build
```bash
npm run build      # outputs static site to ./out
```

## Deploying
Configured for Netlify out of the box (`netlify.toml`: build = `npm run
build`, publish = `out`). The `out/` folder is plain static HTML/CSS/JS, so it
also works unmodified on Vercel, GitHub Pages, S3+CloudFront, or any static
host — see `SETUP.md` for details.

See `SETUP.md` before launch — there are WHMCS product/bundle IDs and
placeholder content that must be replaced with real values first.
