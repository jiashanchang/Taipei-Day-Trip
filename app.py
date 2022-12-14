from flask import *
import os
from dotenv import load_dotenv

load_dotenv()

# 匯入 blueprint
from api.api_attractions import api_attractions_bp
from api.api_user import api_user_bp
from api.api_booking import api_booking_bp
from api.api_orders import api_orders_bp

app=Flask(__name__, static_folder="public", static_url_path="/")
app.config["JSON_AS_ASCII"]=False
app.config["TEMPLATES_AUTO_RELOAD"]=True
app.config['JSON_SORT_KEYS'] = False # 關閉 JSON 自動排序

# 將 blueprint 註冊到 app
app.register_blueprint(api_attractions_bp)
app.register_blueprint(api_user_bp)
app.register_blueprint(api_booking_bp)
app.register_blueprint(api_orders_bp)

# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")
@app.route("/pastorders")
def pastorders():
	return render_template("pastorders.html")
@app.route("/memberonly")
def memberonly():
	return render_template("memberonly.html")

app.run(host="0.0.0.0", port=3000, debug=True)