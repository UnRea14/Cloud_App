from flask_mysqldb import MySQL
from flask import Flask, jsonify, request, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import re

REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

app = Flask(__name__)
app.config.from_pyfile('config.cfg')
mail = Mail(app)
s = URLSafeTimedSerializer("thisshouldbehidden!")

mysql = MySQL(app)
with app.app_context():
    db_cursor = mysql.connection.cursor()


def checkEmail(user_email):
    if re.fullmatch(REGEX, user_email):
        return True
    return False


@app.route('/register', methods = ['POST'])
def register():
    user_name = request.json["user_name"]
    user_email = request.json["user_email"]
    user_password = request.json["user_password"]# later need to encrypt the password
    db_cursor = mysql.connection.cursor()
    check = db_cursor.execute("SELECT * FROM users WHERE email = %s", [user_email])
    if check:
        return jsonify("Email already exists in system")
    if not checkEmail(user_email):
        return jsonify("Email is invalid")
    db_cursor.execute("INSERT INTO users (name, email, password, verified) VALUES (%s, %s, %s, %s)", [user_name, user_email, user_password, 'F'])
    mysql.connection.commit()
    token = s.dumps(user_email, salt="email-confirm")
    msg = Message("Confirm Email", sender="appcool22@gmail.com", recipients=[user_email])
    link = url_for("confirm_email", token=token, _external=True)
    msg.body = "Your link is {}".format(link)
    mail.send(msg)
    return jsonify("User registered, verify your email by the email sent to you in your email")

@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        user_email = s.loads(token, salt="email-confirm", max_age=3600)  # 1 hour
        db_cursor = mysql.connection.cursor()
        db_cursor.execute("UPDATE users SET verified = %s WHERE email = %s", ['T', user_email])
        mysql.connection.commit()
    except SignatureExpired:
        return "<h1>The token is expired!</h1>"
    return "<h1>The token works</h1>"


if __name__ == "__main__":
    app.run(host="localhost", port=8080, debug=True)