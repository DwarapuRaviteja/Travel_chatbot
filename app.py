from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os
app = Flask(__name__)
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("models/gemini-2.5-flash")
@app.route("/")
def index():
    return render_template("index.html")
@app.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message")

    prompt = f"""
    You are a travel information assistant.
    Provide accurate information related to:
    road travel, train travel, air travel, routes, distances,
    travel time, ticket booking, documents, safety tips, costs,
    luggage rules, visas, and best travel options.
    User query: {user_message}
    """
    response = model.generate_content(prompt)
    return jsonify({"reply": response.text})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=10000)

