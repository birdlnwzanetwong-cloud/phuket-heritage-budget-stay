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

  if (!CHANNEL || !HOTEL_ID) {
    return res.status(500).json({ error: 'Server not configured: missing LINE_CHANNEL_TOKEN or HOTEL_LINE_ID' });
  }

  const message = `🏨 NEW BOOKING REQUEST\n\n👤 Guest Name: ${body.guestName || 'N/A'}\n📞 Phone: ${body.phone || 'N/A'}\n📧 Email: ${body.email || 'N/A'}\n📅 Check-in: ${body.checkInDate || 'N/A'}\n📅 Check-out: ${body.checkOutDate || 'N/A'}\n🛏️ Room Type: ${body.roomType || 'N/A'}\n👥 Number of Guests: ${body.numGuests || 'N/A'}\n💬 Special Requests: ${body.specialRequests || 'None'}`;

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CHANNEL}`
      },
      body: JSON.stringify({ to: HOTEL_ID, messages: [{ type: 'text', text: message }] })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ error: `LINE API error: ${response.status} ${text}` });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('send-line error', err);
    return res.status(500).json({ error: err.message });
  }
}
