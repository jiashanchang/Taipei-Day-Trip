from flask import Blueprint, request, jsonify, json
import api.connector as connector
from mysql.connector import Error
import jwt

api_booking_bp = Blueprint(
    "api_booking_bp", __name__,
    template_folder = "templates"
)

taipei_pool=connector.connect()

@api_booking_bp.route("/api/booking", methods = ["GET"])
def get_booking():
    try:
        JWTtoken = request.cookies.get("JWTtoken")
        connection_object=taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            cursor.execute("SELECT member.id, member.name, member.email, attractions.id, attractions.name, attractions.address, attractions.images, booking.date, booking.time, booking.price FROM `attractions` INNER JOIN `booking` on attractions.id=booking.attraction_id INNER JOIN member on member.id=booking.member_id WHERE member.id= %s;", [jwt_decode["id"]])
            cur = cursor.fetchone()
            if cur:
                new_images_url = json.loads(cur["images"])
                result = {
                    "data": {
                        "attraction": {
                            "id": cur["id"],
                            "name": cur["name"],
                            "address": cur["address"],
                            "images": new_images_url[0]
                        },
                        "date": cur["date"],
                        "time": cur["time"],
                        "price": cur["price"]
                    }
                }
                return result
            else:
                return jsonify({"data": None})
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

@api_booking_bp.route("/api/booking", methods = ["POST"])
def create_booking():
    try:
        JWTtoken = request.cookies.get("JWTtoken")
        connection_object=taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        if JWTtoken:
            data = request.get_json()
            attraction_id=data["attraction_id"]
            date=data["date"]
            time=data["time"]
            price=data["price"]
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            cursor.execute("SELECT * FROM `member` INNER JOIN `booking` on member.id=booking.member_id WHERE member.id= %s;", [jwt_decode["id"]])
            cur = cursor.fetchone()
            if (date == "") or (time == "") or (price == ""):
                return jsonify({
                    "error": True,
                    "message": "行程資訊不完整，請重新填寫"
                })
            elif cur == None:
                cursor.execute("INSERT INTO `booking` (`member_id`, `attraction_id`, `date`, `time`, `price`) values(%s, %s, %s, %s, %s);", [jwt_decode["id"], attraction_id, date, time, price])
                connection_object.commit()
                return jsonify({
                    "ok": True,
                    "message": "成功預定行程"
                })
            else:
                cursor.execute("UPDATE `booking` SET `attraction_id` = %s, `date` = %s, `time` = %s, price = %s WHERE member_id = %s;",[attraction_id, date, time, price, jwt_decode["id"]])
                connection_object.commit()
                return jsonify({
                    "update": True,
                    "message": "行程更新成功"
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

@api_booking_bp.route("/api/booking", methods = ["DELETE"])
def delete_booking():
    try:
        JWTtoken = request.cookies.get("JWTtoken")
        connection_object=taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            cur = cursor.execute("DELETE FROM `booking` WHERE `member_id`= %s", [jwt_decode["id"]])
            connection_object.commit()
            return jsonify({
                "ok": True,
                "message": "已成功刪除當前行程"
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