import json
import re
import os
import jwt
import uuid
import base64
import sendgrid
import datetime
import sqlalchemy
import secrets
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
s = URLSafeTimedSerializer(app.config['SECRET_KEY'])
db = SQLAlchemy(app)
secure_rng = secrets.SystemRandom()
password = app.config['SQL_PASSWORD']
db_engine = create_engine('mysql://root:' + password + '@localhost/app_database')


class Images(db.Model):
    ID = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100))
    path = db.Column(db.String(200))
    size = db.Column(db.Integer())
    date_uploaded = db.Column(db.DateTime())


    def __init__(self, name, path, date_uploaded, size) -> None:
        self.name = name
        self.path = path
        self.date_uploaded = date_uploaded
        self.size = size


    def __str__(self) -> str:
        return f"{self.name}, path-{self.path},size-{self.size}, date-{self.date_uploaded:%b %d, %Y}"


    def delete(self):
        os.remove(self.path)


class Users(db.Model):
    ID = db.Column(db.Integer, primary_key = True) #0 - 99 -> 100 users
    public_id = db.Column(db.String(50), unique=True)
    date_created = db.Column(db.DateTime())
    last_uploaded = db.Column(db.DateTime())
    files_uploaded = db.Column(db.Integer())
    total_size = db.Column(db.Integer())
    name = db.Column(db.String(50))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(90))
    verified = db.Column(db.String(1))
    LoggedIn = db.Column(db.String(1))
    files_names = db.Column(MutableList.as_mutable(db.PickleType))
    password_code = db.Column(db.Integer())


    def __init__(self, public_id, name, email, password):
        self.date_created = datetime.datetime.now()
        self.last_uploaded = None
        self.files_uploaded = 0
        self.name = name
        self.public_id = public_id
        self.email = email
        self.password = password
        self.verified = 'F'
        self.LoggedIn = 'F'
        self.files_names = []
        self.password_code = -1
        self.total_size = 0
    

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
    """
        טענת כניסה - אימייל
        טענת יציאה - אמת אם האימייל תקין שקר אחרת
    """
    if re.fullmatch(REGEX, user_email):
        return True
    return False


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        """
            טענת כניסה - ארגומנטים של הפוקנציה
            טענת יציאה - את הפונקציה ש'אף' עטפה על המשתמש שמתאים למספר הזהות
        """
        token = None
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
        if not token:
            return jsonify("token is missing")
        try:
            data = jwt.decode(token, app.config['JWT_SECRET'], algorithms="HS256")
        except:
            return jsonify("Token is invalid")
        user = Users.query.filter_by(public_id=data['public_id']).first()
        return f(user, *args, **kwargs)
    return decorated


@app.route('/register', methods = ['POST'])
def register():
    """
        טענת כניסה - שם אימייל וסיסמה
        טענת יציאה - אם מספר המשתמשים גדול או שווה ל100 מחזיר הודעה מספר 1 אחרת והאימייל לא תקין מחזיר הודעה 2 אחרת והאימייל קיים במערכת אז מחזיר הודעה 3 ואחרת יוצר משתמש חדש ושולח לו אימייל אימות ומחזיר הודעה 4
        1="System has reached maximum users, not registering new users"
        2="Email is invalid"
        3="Email already exists in system"
        4="User registered! verify your email by the email sent to you"
        כל ההודעות הופכות לאובייקט גייסון
    """
    rows = db.session.query(Users).count()
    if rows >= 50:
        return jsonify("System has reached maximum users, not registering new users")
    user_name = request.json["name"]
    user_email = request.json["email"]
    user_password = request.json["password"]
    if not checkEmail(user_email):
        return jsonify("Email is invalid")
    email_exists = Users.query.filter_by(email=user_email).first()
    if email_exists:
        return jsonify("Email already exists in system")
    if not user_password.isalnum() or len(user_password) < 8 or len(user_password) > 20:
        return jsonify("Password is invalid")
    hashed_password = generate_password_hash(user_password, method='sha256')
    user = Users(public_id=str(uuid.uuid4()), name=user_name, email=user_email, password=hashed_password)
    db.session.add(user)
    db.session.commit()
    token = s.dumps(user_email, salt=app.config['EMAIL_SALT'])
    from_email = Email("appcool22@gmail.com")
    to_email = To(user_email)
    link = url_for("confirmEmail", token=token, _external=True)
    body = "Your link is {}".format(link)
    content = Content("text/plain", body)
    subject = "Confirm email address"
    mail = Mail(from_email, to_email, subject, content)
    mail_json = mail.get()
    sg.client.mail.send.post(request_body=mail_json)
    return jsonify("User registered!\nVerify your email by the email sent to you")


@app.route('/login', methods = ['POST'])
def login():
    """
        טענת כניסה - אימייל וסיסמה
        טענת יציאה - אם לא קיים משתמש עם אותו אימייל מחזיר הודעה 1 אחרת ואם המשתמש לא מאומת מחזיר הודעה 2 ואחרת אם המשתמש מאומת והסיסמאות לא תואמת מחזיר הודעה 3 אחרת מחזיר טוקן גייסון שמכיל מילון שמכיל מידע על המשתמש
        1="User doesn't exists in our system"
        2="User is not verified, verify by the email sent to you"
        3="Password is incorrect"
        4={'token': token}
        כל ההודעות הופכות לאובייקט גייסון לפני השליחה
    """
    user_email = request.json['email']
    user_password = request.json['password']
    user = Users.query.filter_by(email=user_email).first()
    if not user:
        return jsonify("User doesn't exists in our system")
    if user.verified == 'F':
        return jsonify("User is not verified, verify by the email sent to you")
    if user.verified == 'T' and not check_password_hash(user.password, user_password):
        return jsonify("Password is incorrect")
    if user.LoggedIn == 'T':
        return jsonify("User already logged in")
    if not user_password.isalnum() or len(user_password) < 8 or len(user_password) > 20:
        return jsonify("Password is invalid")
    user.LoggedIn = 'T'
    db.session.commit()
    if user.last_uploaded is not None:
        dict1 = {"public_id": user.public_id,
            "name": user.name,
            "date_created": f"{user.date_created:%b %d, %Y}",
            "last_uploaded": f"{user.last_uploaded:%b %d, %Y}",
            "files_uploaded": user.files_uploaded,
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(weeks=4)}
    else:
        dict1 = {"public_id": user.public_id,
            "name": user.name,
            "date_created": f"{user.date_created:%b %d, %Y}",
            "last_uploaded": "",
            "files_uploaded": user.files_uploaded,
            "email": user.email,
            "exp": datetime.datetime.utcnow() + datetime.timedelta(weeks=4)}
    token = jwt.encode(dict1, app.config['JWT_SECRET'], algorithm="HS256")
    return jsonify({'token': token})


@app.route('/confirmEmail/<string:token>')
def confirmEmail(token):
    """
        טענת כניסה - טוקן
        טענת יציאה - אם נגמר הזמן של הטוקן מחזיר הודעה שמצביעה על כך, אם אין משתמש אם האימייל מחזיר הודעה שמצביעה על כך, אם יש משתמש עם אותו אימייל מאמת אותו ומחזיר הודעה שמאשרת זאת.  
    """
    try:
        user_email = s.loads(token, salt=app.config['EMAIL_SALT'], max_age=86400)  # 1 day
        user = Users.query.filter_by(email=user_email).first()
        if not user:
            return "<h1>User doesn't exists</h1>"
        setattr(user, 'verified', 'T')
        db.session.commit()
    except SignatureExpired:
        return "<h1>The token is expired!</h1>"
    return "<h1>Email Confirmed</h1>"


@app.route('/files', methods = ['GET'])
@token_required
def viewFiles(user):
    """
        טענת כניסה - משתמש
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1 אחרת אם המשתמש לא מחובר מחזיר הודעה 2 אחרת מחזיר את רשימת שמות התמונות של המשתמש(הודעה 3)
        1="User doesn't exists in our system"
        2="User not logged in"
        3=user.files_names
        כל ההודעות הופכות לאובייקט גייסון לפני השליחה
    """
    if user:
        if user.LoggedIn == 'T':
            return jsonify(user.files_names)
        return jsonify("User not logged in")
    return jsonify("User doesn't exists in our system")


@app.route('/uploadImage', methods = ['POST'])
@token_required
def uploadImage(user):
    """
        טענת כניסה - בייטים של תמונה, משתמש
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1, אחרת אם המשתמש לא מחובר מחזיר הודעה 2, אחרת אם נגמר האחסון של המשתמש מחזיר הודעה 3, אחרת מוסיף את התמונה ומחזיר הודעה 4
        1="User doesn't exists in our system"
        2="User not logged in"
        3="You have ran out of space! try deleting some images"
        4="image added"
        כל ההודעות הופכות לאובייקט גייסון לפני השליחה
    """
    if user:
        if user.LoggedIn == 'T':
            bytesOfImage = request.get_data()
            size = len(bytesOfImage)
            if user.total_size + size > 5368709120:
                return jsonify("You have ran out of space! try deleting some images")
            dirname = os.path.dirname(__file__)
            path = dirname + '\\files'
            if "image-name" in request.headers:
                name = request.headers['image-name']
                if not name.isalnum() or (name + ".jpeg") in user.files_names or len(name) > 20 or len(name) < 1:
                    name = str(uuid.uuid4())  + '.jpeg'
                else:
                    name += ".jpeg"
            else:
                name = str(uuid.uuid4())  + '.jpeg'
            if not os.path.isdir(path): #  dir doesn't exists
                os.mkdir(path)
            fullpath = os.path.join(path + "\\" + user.public_id)
            if not os.path.isdir(fullpath): #  dir doesn't exists
                os.mkdir(fullpath)
            fullpath2 = os.path.join(fullpath + "\\" + name)
            print(fullpath2)
            print(len(fullpath2))
            date = datetime.datetime.now()
            image = Images(name, fullpath2, date, size)
            user.add_file(image.name)
            user.total_size += size
            with open(fullpath2, 'wb') as out:
                out.write(bytesOfImage)
            user.last_uploaded = date
            db.session.add(image)
            db.session.commit()
            return jsonify("image added")
        return jsonify("User not logged in")
    return jsonify("User doesn't exists in our system")


@app.route('/Image/<string:image_name>', methods = ['GET'])
@token_required
def getImage(user, image_name):
    """
        טענת כניסה - משתמש ושם של תמונה
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1, אחרת אם משתמש לא מחובר מחזיר הודעה 2, אחרת אם אין תמונה עם אותו שם מחזיר הודעה 3, אחרת יוצר מילון ומחזיר אותו בהודעה 4
        1="User doesn't exists in our system"
        2="User not logged in"
        3="No image"
        4=dict1
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    if user:
        if user.LoggedIn == 'T':
            image = Images.query.filter_by(name=image_name).first()
            if image:
                with open(image.path, 'rb') as out:
                    image_bytes = out.read()
                image_base64 = base64.encodebytes(image_bytes).decode('ascii')
                dict1 = {'name': image.name,
                    'base64': image_base64,
                    'date_uploaded': f"{image.date_uploaded:%b %d, %Y}"}
                return jsonify(dict1)
            return jsonify("No image")
        return jsonify("User not logged in")
    return jsonify("User doesn't exists in our system")


@app.route("/deleteImage/<string:image_name>", methods = ['GET'])
@token_required
def deleteImage(user, image_name):
    """
        טענת כניסה - משתמש ושם של תמונה
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1, אחרת אם משתמש לא מחובר מחזיר הודעה 2, אחרת אם אין תמונה עם אותו שם מחזיר הודעה 3, אחרת מוחק את התמונה ומחזיר הודעה 4
        1="User doesn't exists in our system"
        2="User not logged in"
        3="No image"
        4="Image deleted from cloud"
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    if user:
        if user.LoggedIn == 'T':
            image = Images.query.filter_by(name=image_name).first()
            if image:
                user.total_size -= image.size
                user.remove_file(image.name)
                user.files_uploaded -= 1
                image.delete()
                db.session.delete(image)
                db.session.commit()
                return jsonify("Image deleted from cloud")
            return jsonify("No image")
        return jsonify("User not logged in")
    return jsonify("User doesn't exists in our system")


@app.route("/deleteUser", methods=['GET'])
@token_required
def deleteUser(user):
    """
        טענת כניסה - משתמש ושם של תמונה
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1, אחרת אם משתמש לא מחובר מחזיר הודעה 2, אחרת מוחק את כל התמונות של המשתמש ומוחק את המשתמש ומחזיר הודעה 3
        1="User doesn't exists in our system"
        2="User not logged in"
        3="User deleted"
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    if user:
        if user.LoggedIn == 'T':
            for image_name in user.files_names:
                image = Images.query.filter_by(name=image_name).first()
                image.delete()
                db.session.delete(image)
            db.session.delete(user)
            db.session.commit()
            return jsonify("User deleted")
        return jsonify("User not logged in")
    return jsonify("User doesn't exists in our system")


@app.route("/forgotPassword", methods=['POST'])
def sendChangePasswordEmail():
    """
        טענת כניסה - אימייל
        טענת יציאה - אם המשתמש שבעל האימייל לא קיים מחזיר הודעה 1, אחרת שולח אימייל שמכיל קוד אימות ומחזיר הודעה 2
        1="User doesn't exists in our system"
        2="Email sent"
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    email = request.json['email']
    user = Users.query.filter_by(email=email).first()
    if not user:
        return jsonify("User doesn't exists in our system")
    code = ""
    for i in range(0, 6):
        code += str(secure_rng.randint(0, 9))
    user.password_code = code
    db.session.commit()
    from_email = Email("appcool22@gmail.com")
    to_email = To(email)
    body = "Your code is: {}".format(str(code))
    content = Content("text/plain", body)
    subject = "Change Password code"
    mail = Mail(from_email, to_email, subject, content)
    mail_json = mail.get()
    sg.client.mail.send.post(request_body=mail_json)
    return jsonify("Email containing the code sent")


@app.route("/forgotPassword/code", methods=['POST'])
def forgotPassword():
    """
        טענת כניסה - קוד
        טענת יציאה - אם הקוד לא מתאים מחזיר הודעה 1, אחרת מחזיר טוקן גייסון שמכיל מילון שמכיל מידע על המשתמש ומחזיר הודעה 2
        1="code doesn't match"
        2={"token": token}
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    code = request.json['code']
    user = Users.query.filter_by(password_code=code).first()
    if user:
        token = jwt.encode({"public_id": user.public_id, "exp": datetime.datetime.utcnow() + datetime.timedelta(weeks=4)}, app.config['JWT_SECRET'], algorithm="HS256")
        user.password_code = -1
        return jsonify({"token": token})
    return jsonify("code doesn't match")


@app.route("/changePassword", methods=['POST'])
@token_required
def changePassword(user):
    """
        טענת כניסה - משתמש וסיסמה
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1, אחרת אם סיסמה שהועברה שווה לסיסמה שמאוחסנת בבסיס הנתונים מחזיר הודעה 2, אחרת משנה את סיסמה ומחזיר הודעה 3 
        1="User doesn't exists in our system"
        2="You can't change the same password!"
        3="Password changed successfully"
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    if user:
        password = request.json['password']
        if not password.isalnum() or len(password) < 8 or len(password) > 20:
            return jsonify("Password is invalid")
        if check_password_hash(user.password, password):
            return jsonify("You can't change the same password!")
        user.password =  generate_password_hash(password, method='sha256')
        user.LoggedIn = 'F'
        db.session.commit()
        return jsonify("Password changed successfully")
    return jsonify("User doesn't exists in our system")


@app.route("/tokenValid", methods=['GET'])
@token_required
def isTokenValid(user):
    """
        טענת כניסה - משתמש
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1, אחרת אם המשתמש לא מחובר מחזיר הודעה 2, אחרת מחזיר הודעה 3 
        1="User doesn't exists in our system"
        2="User not logged in"
        3="Login successful"
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    if user:
        if user.LoggedIn == 'T':
            return jsonify("Login successful")
        return jsonify("User not logged in")
    return jsonify("User doesn't exists in our system")


@app.route("/logout", methods=['GET'])
@token_required
def logOut(user):
    """
        טענת כניסה - משתמש
        טענת יציאה - אם המשתמש לא קיים מחזיר הודעה 1, אחרת אם המשתמש לא מחובר מחזיר הודעה 2, אחרת מנתק את המשתמש ומחזיר הודעה 3 
        1="User doesn't exists in our system"
        2="User not logged in"
        3="Logged out"
        כל ההודעות הופכות לאובייקט גייסון לפני שליחה
    """
    if user:
        if user.LoggedIn == 'T':
            user.LoggedIn = 'F'
            db.session.commit()
            return jsonify("Logged out")
        return jsonify("User not logged in")
    return jsonify("User doesn't exists in our system")


if __name__ == "__main__":
    app.run(host="localhost", port=8080)