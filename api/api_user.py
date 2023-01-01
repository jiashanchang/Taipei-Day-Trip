from flask import Blueprint, request, jsonify, json, make_response
import api.connector as connector
from mysql.connector import Error
import re
import jwt
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import boto3

load_dotenv()

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
        elif not re.match("^[\u4e00-\u9fa5_a-zA-Z0-9_]{5,8}$", name):
            return jsonify({
                "error": True,
                "message": "姓名格式錯誤"
            })
        elif not re.match("^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$", email):
            return jsonify({
                "error": True,
                "message": "電子信箱格式錯誤"
            })
        elif not re.match("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", password):
            return jsonify({
                "error": True,
                "message": "密碼格式錯誤"
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

@api_user_bp.route("/api/member/name",methods=["POST"])
def update_member_name():
    try:
        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        JWTtoken = request.cookies.get("JWTtoken")
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            data = request.get_json()
            newname = data["newname"]
            member_id = jwt_decode["id"]
            member_email = jwt_decode["email"]
            if (newname==""):
                return jsonify({
                    "error": True,
                    "message": "請輸入新的會員名稱"
                })
            elif not re.match("^[\u4e00-\u9fa5_a-zA-Z0-9_]{5,8}$", newname):
                return jsonify({
                    "error": True,
                    "message": "格式錯誤，須介於 5-8 字元"
                })
            else:
                cursor.execute("Update `member` SET `name` =%s WHERE id=%s;",[newname, member_id])
                connection_object.commit()
                JWTtoken = jwt.encode({
                    "id": member_id,
                    "name": newname,
                    "email": member_email,
                    },"73546jdbfjh34cd",algorithm="HS256")
                response = make_response(jsonify({"ok": True}))
                expires=datetime.now() + timedelta(days = 7)
                response.set_cookie(key="JWTtoken", value=JWTtoken, expires=expires)
                return response
        else:
            return jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
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

@api_user_bp.route("/api/member/password",methods=["POST"])
def update_member_password():
    try:
        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        JWTtoken = request.cookies.get("JWTtoken")
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            data = request.get_json()
            member_id = jwt_decode["id"]
            past_password = data["past_password"]
            new_password = data["new_password"]
            if (past_password=="") or (new_password==""):
                return jsonify({
                    "error": True,
                    "message": "請輸入密碼"
                })
            elif not past_password or not new_password:
                return jsonify({
                    "error": True,
                    "message": "密碼輸入錯誤"
                })
            elif not re.match("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$", new_password):
                return jsonify({
                    "error": True,
                    "message": "密碼格式錯誤"
                })

            cursor.execute("SELECT `password` FROM `member` WHERE `id` = %s;",[member_id])
            cur = cursor.fetchone()
            check_password=bcrypt.check_password_hash(cur["password"], past_password)
            if check_password:
                hashed_password = bcrypt.generate_password_hash(new_password).decode("utf8")
                cursor.execute("UPDATE `member` SET `password` = %s WHERE `id` = %s", [hashed_password, member_id])
                connection_object.commit()
                return jsonify({
                    "ok": True,
                    "message": "密碼更新成功"
                })
            else:
                return jsonify({
                    "error": True,
                    "message": "密碼更新失敗"
                })
        else:
            return jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
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

@api_user_bp.route("/api/member/headshot", methods=["GET", "POST"])
def upload_headshot():
    try:
        JWTtoken = request.cookies.get("JWTtoken")
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms=["HS256"])
            client = boto3.client(
                "s3",
                region_name = os.getenv("AWS_REGION_NAME"),
                aws_access_key_id = os.getenv("AWS_ACCESS_KEY_id"),
                aws_secret_access_key = os.getenv("AWS_SCREAT_KEY")
            )
            BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
            file = request.files.get("headshot")
            member_id = jwt_decode["id"]
            
            if request.method == "GET":
                data = client.list_objects(Bucket = BUCKET_NAME, Prefix ="headshot" + "_" + str(member_id))
                if "Contents" in data:
                    response = client.generate_presigned_url("get_object", Params = {
                        "Bucket": BUCKET_NAME,
                        "Key": "headshot" + "_" + str(member_id)
                    }, ExpiresIn = 3600)
                    return jsonify({"data": response})
                else:
                    return jsonify({"data": None})

            if request.method == "POST":
                if file is None:
                    return jsonify({
                        "error": True,
                        "message": "請選擇要上傳的圖片"
                    })
                file.filename = "headshot" + "_" + str(member_id)
                file_name = file.filename

                client.upload_fileobj(
                    file,
                    BUCKET_NAME,
                    file_name
                )
                return jsonify({
                    "ok": True,
                    "message": "圖片上傳成功"
                })
        else:
            return jsonify({
                "error": True,
                "message": "未登入系統，拒絕存取"
            })

    except Error as e:
        print("Error", e)
        return jsonify({
            "error": True,
            "message": "伺服器內部錯誤"
        }),500