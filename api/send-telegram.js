export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            error: "Method not allowed"
        });
    }

    try {
        const BOT_TOKEN = "8935653149:AAFQtSw5AW2teyszyW0m5wzuaKz3vKFDgzU";
        const CHAT_ID = "6775142470";

        // 🔥 SUPER SAFE BODY PARSER (fixes your issue instantly)
        const body = typeof req.body === "string" ? JSON.parse(req.body) : (req.body || {});

        const name = body.name || body.fullName || body.guestName || "N/A";
        const phone = body.phone || body.phoneNumber || "N/A";
        const email = body.email || body.userEmail || "N/A";

        const checkin = body.checkin || body.check_in || "N/A";
        const checkout = body.checkout || body.check_out || "N/A";

        const room = body.room || body.roomType || "N/A";
        const guests = body.guests || body.people || "N/A";

        const requests = body.requests || body.message || "None";

        const message = `
🏨 NEW BOOKING REQUEST

👤 Guest Name: ${name}
📞 Phone: ${phone}
📧 Email: ${email}

📅 Check-in: ${checkin}
📅 Check-out: ${checkout}

🛏️ Room Type: ${room}
👥 Guests: ${guests}

💬 Special Requests:
${requests}

🌐 Source: Website Booking
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