export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        // Make sure body exists
        if (!req.body) {
            return res.status(400).json({
                success: false,
                error: 'Missing request body'
            });
        }

        // Destructure booking data safely
        const {
            name,
            phone,
            email,
            checkin,
            checkout,
            room,
            guests,
            requests,
            source
        } = req.body;

        // Build message
        const message = `
🏨 NEW BOOKING REQUEST

👤 Guest Name: ${name || 'N/A'}
📞 Phone: ${phone || 'N/A'}
📧 Email: ${email || 'N/A'}

📅 Check-in: ${checkin || 'N/A'}
📅 Check-out: ${checkout || 'N/A'}

🛏️ Room Type: ${room || 'N/A'}
👥 Guests: ${guests || 'N/A'}

💬 Special Requests:
${requests || 'None'}

🌐 Source: ${source || 'Website Booking'}
        `.trim();

        // Telegram config
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // Safety check
        if (!BOT_TOKEN || !CHAT_ID) {
            throw new Error('Missing Telegram environment variables');
        }

        // Send to Telegram
        const telegramResp = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            }
        );

        const telegramData = await telegramResp.json();

        // Handle Telegram failure
        if (!telegramResp.ok) {
            throw new Error(
                telegramData.description || 'Telegram API failed'
            );
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Booking sent to Telegram'
        });

    } catch (err) {
        console.error('Telegram Booking Error:', err);

        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}