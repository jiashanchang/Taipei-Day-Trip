from flask import Blueprint, request, jsonify, json
import api.connector as connector
from mysql.connector import Error

api_attractions_bp = Blueprint(
    "api_attractions_bp", __name__,
    template_folder = "templates"
)

taipei_pool=connector.connect()

@api_attractions_bp.route("/api/attractions", methods = ["GET"])
def get_api_attractions_list():
    try:
        query_page = int(request.args.get("page", 0)) # page：要取得的分頁，每頁 12 筆資料
        query_keyword = request.args.get("keyword", "") # keyword：完全比對景點分類、或模糊比對景點名稱，沒給定不做篩選
        one_page_count = query_page*12

        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)

        # 用 page 搜尋
        if query_keyword == None:
            cursor.execute("SELECT COUNT(`id`) FROM `attractions`;")
            next_page = cursor.fetchone()
            next_page = next_page["COUNT(`id`)"]/12
            next_page = int(next_page)
            cursor.execute("SELECT * FROM `attractions` ORDER BY `id` LIMIT %s,12;",[one_page_count])
            all_data = cursor.fetchall()
            attractions_list = []
            for detail_data in all_data:
                new_images_url = json.loads(detail_data["images"])
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
                    "images": new_images_url
                })
            if next_page > query_page:
                query_page += 1
                return jsonify({
                    "nextPage": query_page,
                    "data": attractions_list
                })
            elif next_page == query_page:
                return jsonify({
                    "nextPage": None,
                    "data": attractions_list
                })
            else:
                return jsonify({
                    "error": True,
                    "message": "查無相關景點資料"
                })

        # 用 keyword 搜尋
        else:
            cursor.execute("SELECT COUNT(*) FROM `attractions` WHERE `category` = %s or `name` LIKE %s;",[query_keyword, "%"+query_keyword+"%"])
            next_page = cursor.fetchone()
            next_page = next_page["COUNT(*)"]/12
            next_page = int(next_page)
            cursor.execute("SELECT * FROM `attractions` WHERE `category` = %s or `name` LIKE %s LIMIT %s, 12;", [query_keyword, "%"+query_keyword+"%", one_page_count])
            all_data = cursor.fetchall()
            attractions_list = []
            for detail_data in all_data:
                new_images_url = json.loads(detail_data["images"])
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
                    "images": new_images_url
                })
            if next_page > query_page:
                query_page += 1
                return jsonify({
                    "nextPage": query_page,
                    "data": attractions_list
                })
            elif next_page == query_page:
                return jsonify({
                    "nextPage": None,
                    "data": attractions_list
                })
            else:
                return jsonify({
                    "error": True,
                    "message": "查無相關景點資料"
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

@api_attractions_bp.route("/api/attraction/<attractionId>", methods = ["GET"])
def get_api_attraction_id(attractionId):
    try:
        # attractionId：根據景點編號取得景點資料
        connection_object = taipei_pool.get_connection()
        cursor = connection_object.cursor(dictionary = True)
        attractionId = int(attractionId)
        cursor.execute("SELECT * FROM `attractions` WHERE `id`= %s", [attractionId])
        detail_data = cursor.fetchone()
        if detail_data != None:
            new_images_url = json.loads(detail_data["images"])
            return jsonify({
                "data": {
                    "id": detail_data["id"],
                    "name": detail_data["name"],
                    "category": detail_data["category"],
                    "description": detail_data["description"],
                    "address": detail_data["address"],
                    "transport": detail_data["transport"],
                    "mrt": detail_data["mrt"],
                    "lat": detail_data["lat"],
                    "lng": detail_data["lng"],
                    "images": new_images_url
                }
            })
        else:
            return jsonify({
                "error": True,
                "message": "景點編號不正確"
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

@api_attractions_bp.route("/api/categories", methods = ["GET"])
def get_api_categories_list():
    try:
        # 取得景點分類名稱列表
        connection_object = taipei_pool.get_connection()
        cursor=connection_object.cursor(dictionary = True)
        query_categories = request.args.get("categories")
        cursor.execute("SELECT DISTINCT `category` FROM `attractions`")
        all_categories = cursor.fetchall()
        categories_list = []
        for detail_categories in all_categories:
            categories_list.append(detail_categories["category"])
        return jsonify({"data": categories_list})

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