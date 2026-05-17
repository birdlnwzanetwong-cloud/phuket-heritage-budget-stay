/**
 * Fixed Vercel Serverless Function - Telegram Booking Handler
 * Deploy to: api/sendBookingTelegram.js
 */

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    try {
        // Bot token - in production, use environment variable
        const BOT_TOKEN = "8935653149:AAFQtSw5AW2teyszyW0m5wzuaKz3vKFDgzU";
        
        const { bookingData, hotelTelegramID } = req.body;

        // Validate input
        if (!bookingData || !hotelTelegramID) {
            return res.status(400).json({ 
                success: false, 
                error: "Missing bookingData or hotelTelegramID" 
            });
        }

        // Format the message
        const message = `<b>🏨 NEW BOOKING REQUEST</b>

<b>👤 Guest Name:</b> ${escapeHtml(bookingData.guestName || "N/A")}
<b>📞 Phone:</b> ${escapeHtml(bookingData.phone || "N/A")}
<b>📧 Email:</b> ${escapeHtml(bookingData.email || "N/A")}

<b>📅 Check-in:</b> ${escapeHtml(bookingData.checkInDate || "N/A")}
<b>📅 Check-out:</b> ${escapeHtml(bookingData.checkOutDate || "N/A")}

<b>🛏️ Room Type:</b> ${escapeHtml(bookingData.roomType || "N/A")}
<b>👥 Number of Guests:</b> ${escapeHtml(bookingData.numGuests || "N/A")}

<b>💬 Special Requests:</b>
${escapeHtml(bookingData.specialRequests || "None")}

<b>🌐 Source:</b> Direct Website Booking`;

        // Send to Telegram
        const telegramRes = await fetch(
            `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: hotelTelegramID,
                    text: message,
                    parse_mode: "HTML"
                })
            }
        );

        const data = await telegramRes.json();

        if (!telegramRes.ok) {
            console.error("Telegram API Error:", data);
            return res.status(400).json({
                success: false,
                error: data.description || "Failed to send message"
            });
        }

        return res.status(200).json({ 
            success: true,
            message: "Booking sent successfully"
        });

    } catch (err) {
        console.error("Backend Error:", err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
}

/**
 * Escape HTML special characters for Telegram HTML parse mode
 */
function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
