from sqlalchemy import create_engine
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, jsonify, request, url_for
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_marshmallow import Marshmallow, Marshmallow
import sqlalchemy.types as types
import re

import sqlalchemy

    
app = Flask(__name__)
app.config.from_pyfile('config.cfg')
mail = Mail(app)
s = URLSafeTimedSerializer("thisshouldbehidden!")
db = SQLAlchemy(app)
ma = Marshmallow(app)
db_engine = create_engine('mysql://root:@localhost/app_database')

"""
class Node(types.UserDefinedType):
    nodeID_counter = 0
    cache_ok = True
    def __init__(self, parentID = -1) -> None:
        self.nodeID = Node.nodeID_counter
        Node.nodeID_counter += 1
        self.parentID = parentID

    def get_col_spec(self, **kw):
        return "NODE(%s)" % self.nodeID

    def bind_processor(self, dialect):
        def process(value):
            return value
        return process

    def result_processor(self, dialect, coltype):  
        def process(value):
            return value
        return process



class FileNode(Node):
    def __init__(self, filename) -> None:
        super().__init__(-1)
        self.filename = filename

    def __str__(self):
        return f"FileNode {self.nodeID} -> hold file {self.filename}"

    def get_col_spec(self, **kw):
        return "FILENODE(%s)" % self.filename


class FolderNode(Node):
    cache_ok = True
    def __init__(self, foldername) -> None:
        super().__init__(-1)
        self.children = []
        self.foldername = foldername

    def get_col_spec(self, **kw):
        return f"FOLDERNODE({len(self.children)})"

    def addChild(self, childNode):
        self.children.append(childNode)
        childNode.parentID = self.nodeID

    def removeChild(self, childNode):
        childNode.parentID = -1
        self.children.remove(childNode)

    def traverse(self):
        for node in self.children:
            print(node)
            if type(node)==FolderNode:
                node.traverse()

    def __str__(self):
        return f"FolderNode {self.nodeID} -> hold {len(self.children)} nodes"
        """



class Users(db.Model):
    #filetree = db.Column(FolderNode("Home"))
    name = db.Column(db.String(100))
    email = db.Column(db.String(100), primary_key = True)
    password = db.Column(db.String(100))
    verified = db.Column(db.String(1))

    def __init__(self, name, email, password):
        self.name = name
        self.email = email
        self.password = password
        self.verified = 'F'
        #self.filetree = FolderNode("Home")
            

class UsersSchema(ma.Schema):
    class Meta:
        fields = ('name', 'email', 'password', 'verified')#, 'filetree'

users_Schema = UsersSchema()
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
    link = url_for("confirm_email", token=token, _external=True)
    msg.body = "Your link is {}".format(link)
    mail.send(msg)
    return jsonify("User registered, verify your email by the email sent to you")


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


@app.route('/filetree', methods = ['GET'])
def viewfiletree():
    user_email = request.json["user_email"]
    user = Users.query.filter_by(email=user_email).first()
    return jsonify(user.filetree)


@app.route('/uploadImage', methods = ['POST'])
def uploadImage():#  security problem here
    #image_size = request.json["image_size"]
    print("here---------------------------------------")



if __name__ == "__main__":
    app.run(host="localhost", port=8080)