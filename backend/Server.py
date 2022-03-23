from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
import re

    
app = Flask(__name__)
app.config.from_pyfile('config.cfg')
mail = Mail(app)
s = URLSafeTimedSerializer("thisshouldbehidden!")


class Database_Service:
    def __init__(self, app):
        self.db = SQLAlchemy(app)
    
    def execute_command(self, sql_command, values = []):
        cursor = self.db.connection.cursor()
        return self.cursor.execute(sql_command, values)

    def commit(self):
        self.db.commit()

    def check_if_table_exists(self, table_name):
        cursor = self.mysql.connection.cursor()
        cursor.execute_command("SELECT * FROM information_schema.tables WHERE table_name = %s", [table_name])
        if cursor.fetchone()[0] == 1:
            return True
        return False
    
class Users(Database_Service.db.model):
    name = Database_Service.db.column(Database_Service.db.string[100])
    email = Database_Service.db.column(Database_Service.db.string[100])
    password = Database_Service.db.column(Database_Service.db.string[100])
    verified = Database_Service.db.column(Database_Service.db.string[1])


    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.verified = 'F'
            



REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'

ds = Database_Service(app)

def checkEmail(user_email):
    if re.fullmatch(REGEX, user_email):
        return True
    return False


@app.route('/register', methods = ['POST'])
def register():
    user_name = request.json["user_name"]
    user_email = request.json["user_email"]
    user_password = request.json["user_password"]# later need to encrypt the password
    if not checkEmail(user_email):
        return jsonify("Email is invalid")
    check = Users.query.filter_by(email=user_email).first()
    if check:
        return jsonify("Email already exists in system")
    user = Users(user_name, user_email, user_password)
    ds.db.session.add(user)
    ds.commit()
    """
    token = s.dumps(user_email, salt="email-confirm")
    msg = Message("Confirm Email", sender="appcool22@gmail.com", recipients=[user_email])
    link = url_for("confirm_email", token=token, _external=True)
    msg.body = "Your link is {}".format(link)
    mail.send(msg)
    return jsonify("User registered, verify your email by the email sent to you in your email")"""

@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        user_email = s.loads(token, salt="email-confirm", max_age=3600)  # 1 hour
        ds.execute_command("UPDATE users SET verified = %s WHERE email = %s", ['T', user_email])
        ds.commit()
    except SignatureExpired:
        return "<h1>The token is expired!</h1>"
    return "<h1>The token works</h1>"


if __name__ == "__main__":
    app.run(host="localhost", port=8080)