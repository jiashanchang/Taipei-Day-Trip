from flask import Blueprint, request, jsonify, json, make_response
import api.connector as connector
from mysql.connector import Error
import jwt
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta

api_user_bp = Blueprint(
    "api_user_bp", __name__,
    template_folder = "templates"
)

taipei_pool=connector.connect()

bcrypt = Bcrypt()

@api_user_bp.route("/api/user",methods=["POST"])
def register():
    try:
        data = request.get_json()
        name=data["name"]
        email=data["email"]
        password=data["password"]
        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor()
        cursor.execute("SELECT `email` FROM `member` WHERE `email` = %s;",[email])
        cur = cursor.fetchone()
        if cur:
            return jsonify({
                "error": True,
                "message":"已有此Email，請重新註冊"
            })
        elif (name == "") or (email == "") or (password == ""):
            return jsonify({
                "error": True,
                "message": "請輸入姓名、信箱或密碼"
            })
        else:
            hashed_password = bcrypt.generate_password_hash(password).decode("utf8")
            cursor = connection_object.cursor(dictionary = True)
            cursor.execute("INSERT INTO `member` (`name`, `email`, `password`) VALUES (%s, %s, %s);",[name, email, hashed_password])
            connection_object.commit()
            return jsonify({
                "ok": True,
                "message": "註冊成功，請登入系統"
            })

    except Error as e:
        print("Error", e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }),500

    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()

@api_user_bp.route("/api/user/auth",methods=["GET"])
def get_user_data():
    try:
        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        JWTtoken = request.cookies.get("JWTtoken")
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            return jsonify({
                "data": {
                    "id": jwt_decode["id"],
                    "name": jwt_decode["name"],
                    "email": jwt_decode["email"]
                }
            })
        else:
            return jsonify({"data": None})

    except Error as e:
        print("Error", e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }),500

    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()

@api_user_bp.route("/api/user/auth",methods=["PUT"])
def login():
    try:
        data = request.get_json()
        email=data["email"]
        password=data["password"]
        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        cursor.execute("SELECT * FROM `member` WHERE `email` = %s;",[email])
        cur = cursor.fetchone()
        if cur :
            hash_password = cur["password"]
            check_password=bcrypt.check_password_hash(hash_password, password)
            if check_password:
                JWTtoken = jwt.encode({
                    "id": cur["id"],
                    "name": cur["name"],
                    "email": cur["email"],
                    },"73546jdbfjh34cd",algorithm="HS256")
                response = make_response(jsonify({"ok": True}))
                expires=datetime.now() + timedelta(days = 7)
                response.set_cookie(key="JWTtoken", value=JWTtoken, expires=expires)
                return response
            else:
                return jsonify({
                    "error": True,
                    "message": "信箱或密碼有誤"
                })
        elif (email == "" ) or (password == ""):
            return jsonify({
                "error": True,
                "message": "請輸入信箱或密碼"
            })
        else:
            return jsonify({
                "error": True,
                "message": "無此帳號，請重新輸入"
            })

    except Error as e:
        print("Error", e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }),500

    finally:
        if (connection_object.is_connected()):
            cursor.close()
            connection_object.close()

@api_user_bp.route("/api/user/auth",methods=["DELETE"])
def logout():
     response = make_response(jsonify({"ok": True}))
     response.set_cookie(key="JWTtoken", value="", expires=0)
     return response