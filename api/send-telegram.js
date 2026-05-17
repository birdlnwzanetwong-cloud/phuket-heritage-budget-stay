export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({
            error: 'Method not allowed'
        });
    }

    const BOT_TOKEN = '8935653149:AAFQtSw5AW2teyszyW0m5wzuaKz3vKFDgzU';
    const CHAT_ID = '6775142470';

    const data = req.body;

    const message = `
🏨 NEW BOOKING REQUEST

👤 Guest Name: ${data.guestName}
📞 Phone: ${data.phone}
📧 Email: ${data.email}

📅 Check-in: ${data.checkInDate}
📅 Check-out: ${data.checkOutDate}

🛏️ Room Type: ${data.roomType}
👥 Guests: ${data.numGuests}

💬 Special Requests:
${data.specialRequests || 'None'}

🌐 Source: Website Booking
`;

    try {
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            }
        );

        const telegramData = await telegramResponse.json();

        if (!telegramData.ok) {
            throw new Error(telegramData.description);
        }

        return res.status(200).json({
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}