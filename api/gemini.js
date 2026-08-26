const GEMINI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

export default async (request, response) => {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return response.status(500).json({
      error: 'Gemini is not configured. Set GEMINI_API_KEY in the Vercel project environment variables.'
    });
  }

  try {
    const geminiResponse = await fetch(`${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request.body)
    });

    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      console.error('Gemini API returned an error:', geminiResponse.status, JSON.stringify(data));
      return response.status(geminiResponse.status).json({
        error: data?.error?.message || `Gemini request failed with status ${geminiResponse.status}.`
      });
    }

    return response.status(200).json(data);
  } catch (error) {
    console.error('Gemini proxy error:', error);
    return response.status(502).json({ error: 'Unable to reach Gemini.' });
  }
};
