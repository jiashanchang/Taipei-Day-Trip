from flask import Blueprint, request, jsonify, json
import api.connector as connector
from mysql.connector import Error

api_attraction_id_bp = Blueprint(
    "api_attraction_id_bp", __name__,
    template_folder = "templates"
)

taipei_pool=connector.connect()

@api_attraction_id_bp.route("/api/attraction/<attractionId>", methods = ["GET"])
def get_api_attraction_id(attractionId):
    try:
        # attractionId：根據景點編號取得景點資料
        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        cursor.execute("SELECT COUNT(`id`) FROM `attractions`;")
        all_count = cursor.fetchone()
        all_count = all_count["COUNT(`id`)"]
        all_count = int(all_count)
        attractionId = int(attractionId)
        cursor.execute("SELECT * FROM `attractions` WHERE `id`= %s", [attractionId])
        one_data = cursor.fetchall()
        attractions_list = []
        for detail_data in one_data:
            images_list = []
            images = detail_data["images"]
            new_images_url = json.loads(images)
            images_list.append(new_images_url)
            attractions_list.append({
                "id": detail_data["id"],
                "name": detail_data["name"],
                "category": detail_data["category"],
                "description": detail_data["description"],
                "address": detail_data["address"],
                "transport": detail_data["transport"],
                "mrt": detail_data["mrt"],
                "lat": detail_data["lat"],
                "lng": detail_data["lng"],
                "images": images_list
            })
        if all_count >= attractionId:
            return jsonify({"data": attractions_list})
        elif all_count < attractionId:
            return jsonify({
                "error": True,
                "message": "景點編號不正確"
            }),400
        else:
            return jsonify({
                "error": True,
                "message": "伺服器內部錯誤"
            }),500

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