from flask import Blueprint, request, jsonify, json
import api.connector as connector
from mysql.connector import Error

api_categories_bp = Blueprint(
    "api_categories_bp", __name__,
    template_folder = "templates"
)

taipei_pool=connector.connect()

@api_categories_bp.route("/api/categories", methods = ["GET"])
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