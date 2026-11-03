// Vercel Serverless Function: proxy server-to-server ke Apps Script Web App.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ok:false,error:'Method not allowed'});
  const endpoint = process.env.APPS_SCRIPT_WEB_APP_URL;
  if (!endpoint) return res.status(500).json({ok:false,error:'APPS_SCRIPT_WEB_APP_URL belum diatur di Vercel.'});
  try {
    const upstream = await fetch(endpoint, {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify(req.body || {})
    });
    const data = await upstream.json();
    return res.status(upstream.ok ? 200 : upstream.status).json(data);
  } catch (err) {
    return res.status(502).json({ok:false,error:'Gagal menghubungi backend Apps Script: ' + err.message});
  }
}
