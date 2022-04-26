from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_marshmallow import Marshmallow, Marshmallow
import re

from sqlalchemy import ForeignKey

    
app = Flask(__name__)
app.config.from_pyfile('config.cfg')
mail = Mail(app)
s = URLSafeTimedSerializer("thisshouldbehidden!")
db = SQLAlchemy(app)
ma = Marshmallow(app)
Base = db.declarative_base()
    

class Node(Base):
    __tablename__ = "Node"
    nodeID = db.Column(db.Integer, primary_key = True)
    parentID = db.Column(db.Integer)
    __mapper_args__ = {
        'polymorphic_identity':'Node'
    }
    


class fileNode(Node):
    __tablename__ = "fileNode"
    nodeID = db.Column(db.Integer, ForeignKey('Node.nodeID'), primary_key = True)
    parentID = db.Column(db.Integer, ForeignKey('Node.parentID'))
    __mapper_args__ = {
        'polymorphic_identity':'fileNode'
    }


class Users(db.Model):
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), primary_key = True)
    password = db.Column(db.String(100))
    verified = db.Column(db.String(1))
    tree = Node(0,1)

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.verified = 'F'
            

class UsersSchema(ma.Schema):
    class Meta:
        fields = ('name', 'email', 'password', 'verified')

users_Schema = UsersSchema()
REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'


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
    email_exists = Users.query.filter_by(email=user_email).first()
    if email_exists:
        return jsonify("Email already exists in system")
    user = Users(user_name, user_email, user_password)
    db.session.add(user)
    db.session.commit()
    token = s.dumps(user_email, salt="email-confirm")
    msg = Message("Confirm Email", sender="appcool22@gmail.com", recipients=[user_email])
    link = url_for("confirm_email", token=token, _external=True)
    msg.body = "Your link is {}".format(link)
    mail.send(msg)
    return jsonify("User registered, verify your email by the email sent to you in your email")


@app.route('/login', methods = ['GET', 'POST'])
def login():
    if request.method == 'POST':
        user_email = request.json['user_email']
        user_password = request.json['user_password']
        user = Users.query.filter_by(email=user_email).first()
        if not user:
            return jsonify("User doesn't exists in our system")
        if user.verified == 'F':
            return jsonify("User is not verified, verify by the email sent to you")
        elif user.verified == 'T' and user.password == user_password:
            return jsonify("Login successful")


@app.route('/confirm_email/<token>')
def confirm_email(token):
    try:
        user_email = s.loads(token, salt="email-confirm", max_age=3600)  # 1 hour
        user = Users.query.filter_by(email=user_email).first()
        setattr(user, 'verified', 'T')
        db.session.commit()
    except SignatureExpired:
        return "<h1>The token is expired!</h1>"
    return "<h1>The token works</h1>"


@app.route('/uploadImage')
def uploadImage():
    return jsonify("ok")


if __name__ == "__main__":
    app.run(host="localhost", port=8080)