// Vercel Serverless Function: api/send-line.js
// Expects POST JSON body with booking fields:
// { guestName, phone, email, checkInDate, checkOutDate, roomType, numGuests, specialRequests }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};
  const CHANNEL = process.env.LINE_CHANNEL_TOKEN;
  const HOTEL_ID = process.env.HOTEL_LINE_ID;
  const NOTIFY_TOKEN = process.env.LINE_NOTIFY_TOKEN;

  if ((!CHANNEL || !HOTEL_ID) && !NOTIFY_TOKEN) {
    return res.status(500).json({ error: 'Server not configured: missing LINE_CHANNEL_TOKEN/HOTEL_LINE_ID or LINE_NOTIFY_TOKEN' });
  }

  const message = `🏨 NEW BOOKING REQUEST\n\n👤 Guest Name: ${body.guestName || 'N/A'}\n📞 Phone: ${body.phone || 'N/A'}\n📧 Email: ${body.email || 'N/A'}\n📅 Check-in: ${body.checkInDate || 'N/A'}\n📅 Check-out: ${body.checkOutDate || 'N/A'}\n🛏️ Room Type: ${body.roomType || 'N/A'}\n👥 Number of Guests: ${body.numGuests || 'N/A'}\n💬 Special Requests: ${body.specialRequests || 'None'}`;

  try {
    const pushEnabled = CHANNEL && HOTEL_ID;

    if (pushEnabled) {
      const response = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHANNEL}`
        },
        body: JSON.stringify({ to: HOTEL_ID, messages: [{ type: 'text', text: message }] })
      });

      if (response.ok) {
        return res.status(200).json({ success: true });
      }

      const text = await response.text();
      if (!NOTIFY_TOKEN) {
        return res.status(response.status).json({ error: `LINE API error: ${response.status} ${text}` });
      }

      // If LINE push failed, fall back to LINE Notify.
      console.warn('LINE push failed, falling back to LINE Notify:', response.status, text);
    }

    if (NOTIFY_TOKEN) {
      const form = new URLSearchParams();
      form.append('message', message);
      const notifyResp = await fetch('https://notify-api.line.me/api/notify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${NOTIFY_TOKEN}`
        },
        body: form.toString()
      });

      if (notifyResp.ok) {
        return res.status(200).json({ success: true, fallback: 'notify' });
      }

      const notifyText = await notifyResp.text();
      return res.status(502).json({ error: `LINE notify error: ${notifyResp.status} ${notifyText}` });
    }

    return res.status(500).json({ error: 'No valid LINE delivery method configured' });
  } catch (err) {
    console.error('send-line error', err);
    return res.status(500).json({ error: err.message });
  }
}

