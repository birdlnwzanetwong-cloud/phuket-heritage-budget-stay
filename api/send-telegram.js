export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        // 👇 HARD CODE YOUR VALUES HERE
        const BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";
        const CHAT_ID = "6775142470";

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
        } = req.body || {};

        const message = `
🏨 NEW BOOKING REQUEST

👤 Guest Name: ${name || "N/A"}
📞 Phone: ${phone || "N/A"}
📧 Email: ${email || "N/A"}

📅 Check-in: ${checkin || "N/A"}
📅 Check-out: ${checkout || "N/A"}

🛏️ Room Type: ${room || "N/A"}
👥 Guests: ${guests || "N/A"}

💬 Special Requests:
${requests || "None"}

🌐 Source: ${source || "Website Booking"}
        `.trim();

        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message
                })
            }
        );

        const telegramData = await telegramResponse.json();

        if (!telegramResponse.ok) {
            return res.status(500).json({
                success: false,
                error: telegramData.description || "Telegram API failed"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking sent successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}