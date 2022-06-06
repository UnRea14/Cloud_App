import base64
from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_marshmallow import Marshmallow, Marshmallow
from sqlalchemy.ext.mutable import MutableList
import re
import sqlalchemy
import datetime
import os


app = Flask(__name__)
app.config.from_pyfile('config.cfg')
mail = Mail(app)
s = URLSafeTimedSerializer("thisshouldbehidden!")
db = SQLAlchemy(app)
ma = Marshmallow(app)
db_engine = create_engine('mysql://root:@localhost/app_database')


class Images(db.Model):
    ID = db.Column(db.Integer, primary_key = True) #need to change string size later
    name = db.Column(db.String(100))
    bytes = db.Column(db.LargeBinary(200000), nullable=True)
    path = db.Column(db.String(100))
    date_uploaded = db.Column(db.DateTime())

    def __init__(self, name, bytes, path, date_uploaded) -> None:
        self.name = name
        self.bytes = bytes
        self.path = path
        self.date_uploaded = date_uploaded

    def __str__(self) -> str:
        return f"{self.name } has {type(self.bytes)}, path-{self.path}, date-{self.date_uploaded:%b %d, %Y}"

    def delete(self):
        os.remove(self.path)


class Users(db.Model):
    ID = db.Column(db.Integer, primary_key = True) #0 - 99 -> 100 users, need to change string size later
    date_created = db.Column(db.DateTime())
    last_uploaded = db.Column(db.DateTime())
    files_uploaded = db.Column(db.Integer())
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))
    password = db.Column(db.String(100))
    verified = db.Column(db.String(1))
    files_names = db.Column(MutableList.as_mutable(db.PickleType))

    def __init__(self, name, email, password):
        self.date_created = datetime.datetime.now()
        self.last_uploaded = self.date_created
        self.files_uploaded = 0
        self.name = name
        self.email = email
        self.password = password
        self.verified = 'F'
        self.files_names = []
    

    def add_file(self, file):
        #if not check_if_image_in_files_names(file, self.files_names):
        self.files_names.append(file.name)
        self.files_uploaded += 1
        return "image_added"
        #return "image already in database"

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
    link = url_for("confirmEmail", token=token, _external=True)
    msg.body = "Your link is {}".format(link)
    mail.send(msg)
    return jsonify("User registered, verify your email by the email sent to you")


@app.route('/login', methods = ['POST'])
def login():
    if request.method == 'POST':
        user_email = request.json['user_email']
        user_password = request.json['user_password']
        user = Users.query.filter_by(email=user_email).first()
        if not user:
            return jsonify("User doesn't exists in our system")
        if user.verified == 'F':
            return jsonify("User is not verified, verify by the email sent to you")
        if user.verified == 'T' and user.password != user_password:
            return jsonify("Password is incorrect")
        return jsonify(str(user.ID).zfill(2) + ",Login successful " + user.name)


@app.route('/confirmEmail/<token>')
def confirmEmail(token):
    try:
        user_email = s.loads(token, salt="email-confirm", max_age=3600)  # 1 hour
        user = Users.query.filter_by(email=user_email).first()
        setattr(user, 'verified', 'T')
        db.session.commit()
    except SignatureExpired:
        return "<h1>The token is expired!</h1>"
    return "<h1>The token works</h1>"


@app.route('/files/<string:user_ID>', methods = ['GET'])
def viewFiles(user_ID):
    user = Users.query.filter_by(ID=user_ID).first()
    if user:
        return jsonify(user.files_names)
    return jsonify("User doesn't exists in our system")


@app.route('/uploadImage/<string:user_ID>', methods = ['POST'])
def uploadImage(user_ID):
    global image
    if request.method == 'POST':
        bytesOfImage = request.get_data()
        user = Users.query.filter_by(ID=user_ID).first()
        dirname = os.path.dirname(__file__)
        path = dirname + '\\files\\' + user_ID
        name = user_ID + '_' + str(user.files_uploaded)  + '.jpeg'
        if not os.path.isdir(path): #  dir doesn't exists
            os.mkdir(path)
        fullpath = os.path.join(path + "\\" + user_ID + '_' + str(user.files_uploaded)  + '.jpeg')
        date = datetime.datetime.now()
        image = Images(name, bytesOfImage, fullpath, date)
        res = user.add_file(image)
        if res == "image already in database":
            return jsonify(res)
        with open(fullpath, 'wb') as out:
            out.write(bytesOfImage)
        user.last_uploaded = date
        db.session.add(image)
        db.session.commit()
        return jsonify(res)


@app.route('/Image/<string:user_ID>/<string:image_name>', methods = ['GET'])
def getImage(user_ID, image_name):
    user = Users.query.filter_by(ID=user_ID).first()
    if user:
        image = Images.query.filter_by(name=image_name).first()
        if image:
            image_base64 = base64.encodebytes(image.bytes).decode('ascii')
            dict = {'name': image.name,
                'base64': image_base64,
                'date_uploaded': f"{image.date_uploaded:%b %d, %Y}"}
            return jsonify(dict)
        return jsonify("no image")
    return jsonify("user doesn't exists in our system")


@app.route("/deleteImage/<string:user_ID>/<string:image_name>", methods = ['GET'])
def deleteImage(user_ID, image_name):
    user = Users.query.filter_by(ID=user_ID).first()
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


if __name__ == "__main__":
    app.run(host="localhost", port=8080)