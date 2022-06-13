from enum import unique
import re
import os
from secrets import token_bytes
import jwt
import uuid
import base64
import sendgrid
import datetime
import sqlalchemy
from functools import wraps
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.mutable import MutableList
from flask import Flask, jsonify, request, url_for
from sendgrid.helpers.mail import Mail, Email, To, Content
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
app.config.from_pyfile('config.cfg')
sg = sendgrid.SendGridAPIClient(api_key=app.config['API_KEY'])
s = URLSafeTimedSerializer('SECRET_KEY')
db = SQLAlchemy(app)
db_engine = create_engine('mysql://root:@localhost/app_database')


class Images(db.Model):
    ID = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    path = db.Column(db.String(100))
    date_uploaded = db.Column(db.DateTime())

    def __init__(self, name, path, date_uploaded) -> None:
        self.name = name
        self.path = path
        self.date_uploaded = date_uploaded

    def __str__(self) -> str:
        return f"{self.name }, path-{self.path}, date-{self.date_uploaded:%b %d, %Y}"

    def delete(self):
        os.remove(self.path)


class Users(db.Model):
    ID = db.Column(db.Integer, primary_key = True) #0 - 99 -> 100 users
    public_id = db.Column(db.String(50), unique=True)
    date_created = db.Column(db.DateTime())
    last_uploaded = db.Column(db.DateTime())
    files_uploaded = db.Column(db.Integer())
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(100))
    verified = db.Column(db.String(1))
    files_names = db.Column(MutableList.as_mutable(db.PickleType))

    def __init__(self, public_id, name, email, password):
        self.date_created = datetime.datetime.now()
        self.last_uploaded = None
        self.files_uploaded = 0
        self.name = name
        self.public_id = public_id
        self.email = email
        self.password = password
        self.verified = 'F'
        self.files_names = []
    

    def add_file(self, filename):
        if filename not in self.files_names:
            self.files_names.append(filename)
            self.files_uploaded += 1
            return True
        return False

    def remove_file(self, filename):
        self.files_names.remove(filename)


REGEX = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
ins = sqlalchemy.inspect(db_engine)
if not ins.has_table("Users"):
    db.create_all()
    

def checkEmail(user_email):
    if re.fullmatch(REGEX, user_email):
        return True
    return False

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify("token is missing")
        try:
            data = jwt.decode(token, app.config['JWT_SECRET'], algorithms="HS256")
        except:
            return jsonify("token is invalid")
        user = Users.query.filter_by(public_id=data['public_id']).first()
        return f(user, *args, **kwargs)
    return decorated


@app.route('/register', methods = ['POST'])
def register():
    user_name = request.json["name"]
    user_email = request.json["email"]
    user_password = request.json["password"]
    if not checkEmail(user_email):
        return jsonify("Email is invalid")
    email_exists = Users.query.filter_by(email=user_email).first()
    if email_exists:
        return jsonify("Email already exists in system")
    hashed_password = generate_password_hash(user_password, method='sha256')
    user = Users(public_id=str(uuid.uuid4()), name=user_name, email=user_email, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    token = s.dumps(user_email, salt="email-confirm")
    from_email = Email("appcool22@gmail.com")
    to_email = To(user_email)
    link = url_for("confirmEmail", token=token, _external=True)
    body = "Your link is {}".format(link)
    content = Content("text/plain", body)
    subject = "Confirm email address"
    mail = Mail(from_email, to_email, subject, content)
    mail_json = mail.get()
    sg.client.mail.send.post(request_body=mail_json)
    return jsonify("User registered! verify your email by the email sent to you")


@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST':
        user_email = request.json['email']
        user_password = request.json['password']
        user = Users.query.filter_by(email=user_email).first()
        if not user:
            return jsonify("User doesn't exists in our system")
        if user.verified == 'F':
            return jsonify("User is not verified, verify by the email sent to you")
        if user.verified == 'T' and not check_password_hash(user.password, user_password):
            return jsonify("Password is incorrect")
        if user.last_uploaded is not None:
            dict1 = {"public_id": user.public_id,
                "name": user.name,
                "date_created": f"{user.date_created:%b %d, %Y}",
                "last_uploaded": f"{user.last_uploaded:%b %d, %Y}",
                "files_uploaded": user.files_uploaded,
                "email": user.email}
        else:
            dict1 = {"public_id": user.public_id,
                "name": user.name,
                "date_created": f"{user.date_created:%b %d, %Y}",
                "last_uploaded": "",
                "files_uploaded": user.files_uploaded,
                "email": user.email}
        token = jwt.encode(dict1, app.config['JWT_SECRET'], algorithm="HS256")
        return jsonify({'token': token})


@app.route('/confirmEmail/<string:token>')
def confirmEmail(token):
    try:
        user_email = s.loads(token, salt="email-confirm", max_age=86400)  # 1 day
        user = Users.query.filter_by(email=user_email).first()
        setattr(user, 'verified', 'T')
        db.session.commit()
    except SignatureExpired:
        return "<h1>The token is expired!</h1>"
    return "<h1>The token works</h1>"


@app.route('/files', methods = ['GET'])
@token_required
def viewFiles(user):
    if user:
        return jsonify(user.files_names)
    return jsonify("User doesn't exists in our system")


@app.route('/uploadImage', methods = ['POST'])
@token_required
def uploadImage(user):
    if user:
        bytesOfImage = request.get_data()
        dirname = os.path.dirname(__file__)
        path = dirname + '\\files'
        name = user.public_id + '_' + str(user.files_uploaded)  + '.jpeg'
        if not os.path.isdir(path): #  dir doesn't exists
            os.mkdir(path)
        fullpath = os.path.join(path + "\\" + name)
        date = datetime.datetime.now()
        image = Images(name, fullpath, date)
        res = user.add_file(image.name)
        if not res:
            return jsonify("image already in database")
        with open(fullpath, 'wb') as out:
            out.write(bytesOfImage)
        user.last_uploaded = date
        db.session.add(image)
        db.session.commit()
        return jsonify("image added")
    return jsonify("user doesn't exists in our system")


@app.route('/Image/<string:image_name>', methods = ['GET'])
@token_required
def getImage(user, image_name):
    if user:
        image = Images.query.filter_by(name=image_name).first()
        if image:
            with open(image.path, 'rb') as out:
                image_bytes = out.read()
            image_base64 = base64.encodebytes(image_bytes).decode('ascii')
            dict = {'name': image.name,
                'base64': image_base64,
                'date_uploaded': f"{image.date_uploaded:%b %d, %Y}"}
            return jsonify(dict)
        return jsonify("no image")
    return jsonify("user doesn't exists in our system")


@app.route("/deleteImage/<string:image_name>", methods = ['GET'])
@token_required
def deleteImage(user, image_name):
    if user:
        image = Images.query.filter_by(name=image_name).first()
        if image:
            user.remove_file(image.name)
            user.files_uploaded -= 1
            image.delete()
            db.session.delete(image)
            db.session.commit()
            return jsonify("Image deleted from cloud")
        return jsonify("no image")
    return jsonify("user doesn't exists in our system")


@app.route("/deleteUser", methods=['GET'])
@token_required
def deleteUser(user):
    if user:
        for image_name in user.files_names:
            image = Images.query.filter_by(name=image_name).first()
            image.delete()
        db.session.delete(user)
        db.session.commit()
        return jsonify("User deleted")
    return jsonify("user doesn't exists in our system")


if __name__ == "__main__":
    app.run(host="localhost", port=8080)