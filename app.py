from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os

app = Flask(__name__)
CORS(app)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

chat_history = []

SYSTEM_PROMPT = """
You are TravelGPT AI, a professional travel assistant.

Capabilities:
- Travel planning
- Tourist attractions
- Budget estimation
- Route guidance
- Hotel recommendations
- Transport suggestions
- Itinerary generation
- Travel safety tips

Response Rules:
1. Use headings when appropriate.
2. Use bullet points.
3. Keep answers clear and structured.
4. Mention estimated costs when possible.
5. Mention travel time and distance when relevant.
6. Avoid long paragraphs.
7. Be friendly and professional.
8. Format responses nicely for a chat application.

If information is unavailable, clearly say it is an estimate.
"""

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()
        user_message = data.get("message", "").strip()

        if not user_message:
            return jsonify({
                "success": False,
                "reply": "Please enter a message."
            })

        global chat_history

        chat_history.append({
            "role": "user",
            "message": user_message
        })

        conversation = ""

        for item in chat_history[-10:]:
            conversation += f"{item['role']}: {item['message']}\n"

        prompt = f"""
{SYSTEM_PROMPT}

Conversation History:
{conversation}

User Question:
{user_message}

Provide the best travel-related response.
"""

        response = model.generate_content(prompt)

        bot_reply = response.text

        chat_history.append({
            "role": "assistant",
            "message": bot_reply
        })

        return jsonify({
            "success": True,
            "reply": bot_reply
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "reply": str(e)
        })


@app.route("/new-chat", methods=["POST"])
def new_chat():
    global chat_history
    chat_history = []

    return jsonify({
        "success": True,
        "message": "New chat started."
    })


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )
