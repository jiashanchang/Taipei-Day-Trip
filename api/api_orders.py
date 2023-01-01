from flask import Blueprint, request, jsonify, json
import api.connector as connector
from mysql.connector import Error
import jwt
import os
from dotenv import load_dotenv
import datetime
from datetime import datetime
import requests
import random

load_dotenv()

api_orders_bp = Blueprint(
    "api_orders_bp", __name__,
    template_folder = "templates"
)

taipei_pool=connector.connect()

@api_orders_bp.route("/api/orders", methods=["POST"])
def create_new_order():
    JWTtoken = request.cookies.get("JWTtoken")
    data = request.get_json()
    price = data["order"]["price"]
    attraction_id = data["order"]["trip"]["attraction"]["id"]
    attraction_name = data["order"]["trip"]["attraction"]["name"]
    attraction_address = data["order"]["trip"]["attraction"]["address"]
    attraction_image = data["order"]["trip"]["attraction"]["image"]
    date = data["order"]["trip"]["date"]
    time = data["order"]["trip"]["time"]
    contact_name = data["order"]["contact"]["name"]
    contact_email = data["order"]["contact"]["email"]
    contact_phone = data["order"]["contact"]["phone"]
    if JWTtoken:
        jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
        if (contact_name=="") or (contact_email=="") or (contact_phone==""):
            return jsonify({
                "error": True,
                "message": "訂單建立失敗，請填寫完整聯絡資訊"
            })
        else:
            try:
                random_number = (random.randrange(1, 9999))
                current_time = datetime.now()
                current_time = current_time.strftime("%Y%m%d%H%M")
                current_order_number = current_time + "-" + str(random_number) + "-" + str(jwt_decode["id"])
                url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
                headers = {
                    "Content-Type": "application/json",
                    "x-api-key": os.getenv("PARTNER_KEY")
                }
                order = {
                    "prime": data["prime"],
                    "partner_key": os.getenv("PARTNER_KEY"),
                    "merchant_id": os.getenv("MERCHANT_ID"),
                    "details": attraction_name,
                    "amount": price,
                    "cardholder": {
                        "phone_number": contact_phone,
                        "name": contact_name,
                        "email": contact_email
                    },
                    "remember": True
                }
                tappay_response = requests.post(url, json=order, headers=headers).json()
                if tappay_response["status"] == 0:
                    connection_object = taipei_pool.get_connection()
                    cursor = connection_object.cursor(buffered = True, dictionary = True)
                    cursor.execute("INSERT INTO `taipeiorder`(`order_number`, `attraction_id`, `attraction_name`, `attraction_address`, `attraction_image`, `order_date`, `order_time`, `order_price`, `booking_member_id`, `member_member_id`, `contactname`, `contactemail`, `contactphone`) values(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);", [current_order_number, attraction_id, attraction_name, attraction_address, attraction_image, date, time, price, jwt_decode["id"], jwt_decode["id"], contact_name, contact_email, contact_phone])
                    connection_object.commit()
                    cursor.execute("DELETE FROM `booking` WHERE member_id = %s;", [jwt_decode['id']])
                    connection_object.commit()
                    return jsonify({
                        "data": {
                            "number": current_order_number,
                            "payment": {
                                "status": 0,
                                "message": "付款成功"
                            }
                        }
                    })
                else:
                    return jsonify({
                        "data": {
                            "number": current_order_number,
                            "payment": {
                                "status": tappay_response["status"],
                                "message": "付款失敗"
                            }
                        }
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
    else:
        return jsonify({
            "error": True,
            "message": "未登入系統，拒絕存取"
        })

@api_orders_bp.route("/api/order/<orderNumber>", methods=["GET"])
def get_order(orderNumber):
    try:
        JWTtoken = request.cookies.get("JWTtoken")
        connection_object=taipei_pool.get_connection()
        cursor = connection_object.cursor(buffered = True, dictionary = True)
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            cursor.execute("SELECT * From `taipeiorder` WHERE `member_member_id` = %s AND `order_number` = %s;", [jwt_decode['id'], orderNumber])
            cur = cursor.fetchone()
            if cur:
                result = {
                    "data": {
                        "number": orderNumber,
                        "price": cur["order_price"],
                        "trip": {
                            "attraction": {
                                "id": cur["attraction_id"],
                                "name": cur["attraction_name"],
                                "address": cur["attraction_address"],
                                "images": cur["attraction_image"]
                            },
                            "date": cur["order_date"],
                            "time": cur["order_time"]
                        },
                        "contact": {
                            "name":cur["contactname"],
                            "email":cur["contactemail"],
                            "phone":cur["contactphone"]
                        },
                        "status": 1
                    }
                }
                return jsonify(result)
            else:
                return jsonify({
                    "data": None,
                    "message": "無此付款訂單，請確認訂單號碼"
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

@api_orders_bp.route("/api/past_order", methods=["GET"])
def get_past_order():
    try:
        JWTtoken = request.cookies.get("JWTtoken")
        connection_object=taipei_pool.get_connection()
        cursor = connection_object.cursor(buffered = True, dictionary = True)
        if JWTtoken:
            jwt_decode = jwt.decode(JWTtoken, "73546jdbfjh34cd", algorithms="HS256")
            cursor.execute("SELECT * From `taipeiorder` WHERE `member_member_id` = %s ORDER BY `order_number` DESC;", [jwt_decode["id"]])
            all_order = cursor.fetchall()
            past_order_list = []
            if all_order:
                for detail_order in all_order:
                    past_order_list.append({
                        "order_id": detail_order["order_id"],
                        "order_number": detail_order["order_number"],
                        "order_price": detail_order["order_price"],
                        "attraction_id": detail_order["attraction_id"],
                        "attraction_name": detail_order["attraction_name"],
                        "attraction_address": detail_order["attraction_address"],
                        "attraction_image": detail_order["attraction_image"],
                        "order_date": detail_order["order_date"],
                        "order_time": detail_order["order_time"],
                        "member_id": detail_order["member_member_id"],
                        "contact_name":detail_order["contactname"],
                        "contact_email":detail_order["contactemail"],
                        "contact_phone":detail_order["contactphone"]
                    })
                return jsonify({"data": past_order_list})
            else:
                return jsonify({
                    "data": None,
                    "message": "目前暫無歷史訂單"
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