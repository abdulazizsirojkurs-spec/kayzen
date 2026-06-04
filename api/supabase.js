// Vercel serverless proxy — Supabase JS kutubxonasini o'z domenimizdan beradi.
// Sabab: tashqi CDN'lar (jsdelivr, unpkg) ba'zi tarmoqlarda bloklangan/sekin.
// Vercel server jsdelivr'ga to'g'ridan-to'g'ri ulanadi (CORS yo'q) va keshlab beradi.

module.exports = async (req, res) => {
  const CDN_URLS = [
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
    'https://unpkg.com/@supabase/supabase-js@2',
    'https://esm.sh/@supabase/supabase-js@2?bundle',
  ];

  let lastError = null;
  for (const url of CDN_URLS) {
    try {
      const r = await fetch(url, { redirect: 'follow' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const text = await r.text();
      // Edge keshlash — 24 soat
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
      res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
      res.setHeader('X-Source', url);
      res.status(200).send(text);
      return;
    } catch (e) {
      lastError = e;
      console.error('CDN xato:', url, e.message);
    }
  }

  res.status(502).setHeader('Content-Type', 'text/plain').send(
    '// Supabase yuklab bo\'lmadi: ' + (lastError && lastError.message)
  );
};
