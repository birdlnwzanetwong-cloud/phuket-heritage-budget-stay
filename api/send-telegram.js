export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false });
    }

    try {
        const BOT_TOKEN = 8935653149:AAFQtSw5AW2teyszyW0m5wzuaKz3vKFDgzU;
        const CHAT_ID = 6775142470;

        const body = req.body || {};

        const message = `
🏨 NEW BOOKING REQUEST

👤 Guest Name: ${body.name || "N/A"}
📞 Phone: ${body.phone || "N/A"}
📧 Email: ${body.email || "N/A"}

📅 Check-in: ${body.checkin || "N/A"}
📅 Check-out: ${body.checkout || "N/A"}

🛏️ Room Type: ${body.room || "N/A"}
👥 Guests: ${body.guests || "N/A"}

💬 Special Requests:
${body.requests || "None"}

🌐 Source: Website Booking
        `;

        const telegramRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            }
        );

        const data = await telegramRes.json();

        if (!telegramRes.ok) {
            return res.status(500).json({
                success: false,
                error: data.description
            });
        }

        return res.status(200).json({ success: true });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}