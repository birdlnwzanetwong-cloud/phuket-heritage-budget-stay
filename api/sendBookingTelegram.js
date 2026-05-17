export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const BOT_TOKEN = '8935653149:AAFQtSw5AW2teyszyW0m5wzuaKz3vKFDgzU';
    const { bookingData, hotelTelegramID } = req.body;

    if (!bookingData || !hotelTelegramID) {
      return res.status(400).json({ error: 'Missing data' });
    }

    const text = `🏨 NEW BOOKING REQUEST

👤 Guest Name: ${bookingData.guestName}
📞 Phone: ${bookingData.phone}
📧 Email: ${bookingData.email}
📅 Check-in: ${bookingData.checkInDate}
📅 Check-out: ${bookingData.checkOutDate}
🛏️ Room Type: ${bookingData.roomType}
👥 Guests: ${bookingData.numGuests}
💬 Requests: ${bookingData.specialRequests || 'None'}
🌐 Source: Website Booking`;

    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: hotelTelegramID,
        text: text
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.description });
    }

    return res.status(200).json({ success: true, message: 'Booking sent' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
