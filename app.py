from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

chat_history = []

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    global chat_history

    chat_history.append(f"User: {user_message}")

    conversation = "\n".join(chat_history)

    prompt = f"""
    You are a travel information assistant.

    Follow these rules strictly:

    1. Give answers in short points.
    2. Each point must be on a new line.
    3. Avoid long paragraphs.
    4. Use bullet points when possible.
    5. Provide clear travel information like:
    - Distance
    - Travel time
    - Cost
    - Best options

    Conversation History:
    {conversation}

    Now answer the latest user query clearly.
    """

    response = model.generate_content(prompt)
    bot_reply = response.text
    bot_reply = bot_reply.replace(". ", ".\n")
    chat_history.append(f"Bot: {bot_reply}")

    return jsonify({"reply": bot_reply})

if __name__ == "__main__":
    app.run(debug=True)
