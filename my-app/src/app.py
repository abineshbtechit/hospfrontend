from flask import Flask, request, jsonify, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

current_token =0


@app.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]

    # later: save to DB

    return jsonify({"message": "Signup successful"})

serving = 0
@socketio.on("next_token")
def next_token():
    global serving, current_token
    if serving < current_token - 1:   # 👈 limit
        serving += 1
        socketio.emit("serve_update", serving)

current_token = 1
bookings = []   # shared queue

@socketio.on("connect")
def connect():
    emit("token_update", current_token)
    emit("booking_list", bookings)

@socketio.on("book_token")
def book_token(data):
    global current_token

    booking = {
        "token": current_token,
        "name": data["name"],
        "phone": data["phone"]
    }

    bookings.append(booking)
    current_token += 1

    socketio.emit("token_update", current_token)
    socketio.emit("booking_list", bookings)


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
