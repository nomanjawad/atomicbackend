# SEO Scripts Integration Guide

## OBJECTIVE
Implement dynamic SEO script injection in a Next.js 15 App Router project. Scripts are managed via an admin panel and fetched from an API endpoint.

---

## PREREQUISITES
- Next.js 15 with App Router (`/app` directory)
- TypeScript enabled
- Environment variable: `NEXT_PUBLIC_API_URL`

---

## IMPLEMENTATION TASKS

### TASK 1: Create Environment Variable

**FILE:** `.env.local` (create if not exists)

**ACTION:** Add the following line:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> Replace `http://localhost:5000/api` with the actual backend API URL in production.

---

### TASK 2: Create SEO Scripts Service

**FILE:** `src/lib/seo-scripts.ts` (create new file)

**FULL FILE CONTENT:**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface SeoScript {
  id: string;
  name: string;
  content: string;
  priority: number;
}

export interface SeoScriptsData {
  head: SeoScript[];
  bodyStart: SeoScript[];
  bodyEnd: SeoScript[];
}

export async function getSeoScripts(route: string, locale: string = 'en'): Promise<SeoScriptsData> {
  try {
    const res = await fetch(
      `${API_URL}/seo-scripts/by-route?route=${encodeURIComponent(route)}&locale=${locale}`,
      { 
        next: { revalidate: 60 },
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
    if (!res.ok) {
      throw new Error('Failed to fetch SEO scripts');
    }
    
    const data = await res.json();
    return data.success ? data.data : { head: [], bodyStart: [], bodyEnd: [] };
  } catch (error) {
    console.error('SEO Scripts fetch error:', error);
    return { head: [], bodyStart: [], bodyEnd: [] };
  }
}

export function extractScriptContent(html: string): string {
  const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  return match ? match[1] : html;
}
```

---

### TASK 3: Create Body Scripts Component (Client Component)

**FILE:** `src/components/SeoScripts.tsx` (create new file)

**FULL FILE CONTENT:**
```tsx
'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { getSeoScripts, extractScriptContent, type SeoScriptsData } from '@/lib/seo-scripts';

interface Props {
  locale?: string;
}

export default function SeoScripts({ locale = 'en' }: Props) {
  const pathname = usePathname();
  const [scripts, setScripts] = useState<SeoScriptsData | null>(null);

  useEffect(() => {
    getSeoScripts(pathname, locale).then(setScripts);
  }, [pathname, locale]);

  if (!scripts) return null;

  return (
    <>
      {scripts.bodyStart.map((script) => (
        <div
          key={script.id}
          dangerouslySetInnerHTML={{ __html: script.content }}
        />
      ))}

      {scripts.bodyEnd.map((script) => (
        <Script
          key={script.id}
          id={`seo-body-end-${script.id}`}
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: extractScriptContent(script.content) }}
        />
      ))}
    </>
  );
}
```

---

### TASK 4: Create Head Scripts Component (Server Component)

**FILE:** `src/components/SeoHeadScripts.tsx` (create new file)

**FULL FILE CONTENT:**
```tsx
import { getSeoScripts } from '@/lib/seo-scripts';

interface Props {
  route: string;
  locale?: string;
}

export default async function SeoHeadScripts({ route, locale = 'en' }: Props) {
  const scripts = await getSeoScripts(route, locale);

  if (!scripts.head.length) return null;

  return (
    <>
      {scripts.head.map((script) => (
        <div
          key={script.id}
          dangerouslySetInnerHTML={{ __html: script.content }}
        />
      ))}
    </>
  );
}
```

---

### TASK 5: Update Root Layout

**FILE:** `src/app/layout.tsx` (modify existing file)

**CHANGES REQUIRED:**

1. Add imports at the top of the file:
```tsx
import SeoScripts from '@/components/SeoScripts';
import SeoHeadScripts from '@/components/SeoHeadScripts';
```

2. Inside the `<head>` tag, add:
```tsx
<SeoHeadScripts route="/" locale="en" />
```

3. Inside the `<body>` tag (at the beginning), add:
```tsx
<SeoScripts locale="en" />
```

**EXAMPLE LAYOUT STRUCTURE:**
```tsx
import SeoScripts from '@/components/SeoScripts';
import SeoHeadScripts from '@/components/SeoHeadScripts';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <SeoHeadScripts route="/" locale="en" />
      </head>
      <body>
        <SeoScripts locale="en" />
        {children}
      </body>
    </html>
  );
}
```

---

## API REFERENCE

### Endpoint
```
GET /api/seo-scripts/by-route
```

### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `route` | string | Yes | Current page path (e.g., `/`, `/about-us`, `/blog`) |
| `locale` | string | No | Language code (default: `en`) |

### Response Format
```json
{
  "success": true,
  "data": {
    "head": [
      { "id": "uuid", "name": "Script Name", "content": "<script>...</script>", "priority": 10 }
    ],
    "bodyStart": [],
    "bodyEnd": []
  }
}
```

---

## VALID ROUTES

The following routes are configured in the admin panel:
- `/` (Home)
- `/about-us`
- `/blog`
- `/contact-us`
- `/csr`
- `/gallery`
- `/industry`
- `/privacy-policy`
- `/services`
- `/success-stories`
- `/terms-condition`
- `/training-programs`

---

## SCRIPT TYPES

| Type | HTML Location | Description |
|------|---------------|-------------|
| `head` | Inside `<head>` tag | Google Analytics, Meta tags, Structured data |
| `body_start` | Right after `<body>` opening tag | GTM noscript fallbacks |
| `body_end` | Before `</body>` closing tag | Chat widgets, deferred scripts |

---

## VERIFICATION

After implementation, verify by:

1. Start the backend server (API must be running)
2. Start the Next.js frontend
3. Open browser DevTools > Network tab
4. Look for request to `/api/seo-scripts/by-route`
5. Verify response contains expected scripts
6. Check Elements tab to confirm scripts are injected in correct locations

---

## FILE SUMMARY

| File Path | Action | Type |
|-----------|--------|------|
| `.env.local` | Create/Update | Environment |
| `src/lib/seo-scripts.ts` | Create | Service |
| `src/components/SeoScripts.tsx` | Create | Client Component |
| `src/components/SeoHeadScripts.tsx` | Create | Server Component |
| `src/app/layout.tsx` | Modify | Layout |
