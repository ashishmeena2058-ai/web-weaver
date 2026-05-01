// Replicate Real-ESRGAN proxy edge function
// Keeps REPLICATE_API_TOKEN server-side; client posts a video URL/data and polls for status

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
};

const REPLICATE_API = 'https://api.replicate.com/v1';
// Real-ESRGAN video model (latest stable). Falls back gracefully if Replicate refuses.
// Using a popular video upscaler model version
const MODEL_VERSION = 'f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa'; // nightmareai/real-esrgan

interface CreateBody {
  action: 'create';
  videoDataUrl: string; // base64 data URL (small files) OR public URL
  scale?: number;       // 2 or 4
}
interface PollBody {
  action: 'poll';
  predictionId: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const TOKEN = Deno.env.get('REPLICATE_API_TOKEN');
  if (!TOKEN) {
    return json({ error: 'REPLICATE_API_TOKEN not configured' }, 500);
  }

  try {
    const body = await req.json() as CreateBody | PollBody;

    if (body.action === 'create') {
      const scale = body.scale === 4 ? 4 : 2;
      const res = await fetch(`${REPLICATE_API}/predictions`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version: MODEL_VERSION,
          input: {
            image: body.videoDataUrl, // model accepts image/video; for video we use frame extraction client-side
            scale,
            face_enhance: true,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return json({ error: 'replicate_error', detail: data }, res.status);
      }
      return json({ id: data.id, status: data.status });
    }

    if (body.action === 'poll') {
      const res = await fetch(`${REPLICATE_API}/predictions/${body.predictionId}`, {
        headers: { 'Authorization': `Token ${TOKEN}` },
      });
      const data = await res.json();
      if (!res.ok) {
        return json({ error: 'replicate_error', detail: data }, res.status);
      }
      return json({
        status: data.status,
        output: data.output,
        error: data.error,
        progress: data.logs ? extractProgress(data.logs) : null,
      });
    }

    return json({ error: 'unknown_action' }, 400);
  } catch (e) {
    return json({ error: 'server_error', message: String((e as Error).message) }, 500);
  }
});

function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function extractProgress(logs: string): number | null {
  const m = logs.match(/(\d{1,3})%/g);
  if (!m) return null;
  const last = m[m.length - 1];
  const n = parseInt(last);
  return isNaN(n) ? null : n;
}
