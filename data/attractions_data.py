import mysql.connector
from mysql.connector import Error
import json

try:
    connection = mysql.connector.connect(
        host = "localhost",
        port = "3306",
        user = "root",
        password = "Password123",
        database = "website"
    )

    with open("taipei-attractions.json", "r", encoding="utf-8") as file:
        data = json.load(file)
        clist = data["result"]["results"]
    for attractions in clist:
        name = attractions["name"]
        category = attractions["CAT"]
        description = attractions["description"]
        address = attractions["address"]
        transport = attractions["direction"]
        mrt = attractions["MRT"]
        lat = attractions["latitude"]
        lng = attractions["longitude"]
        images = attractions["file"].split("https")
        images_list = []
        for n in range(len(images)):
            new_images_url = "https"+images[n]
            if ".jpg" in new_images_url or ".JPG" in new_images_url or ".png" in new_images_url or ".PNG" in new_images_url:
                images_list.append(new_images_url)
        images=json.dumps(images_list)
        cursor = connection.cursor(dictionary=True)
        cursor.execute("INSERT INTO `attractions`(`name`,`category`,`description`,`address`,`transport`,`mrt`,`lat`,`lng`,`images`) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s);",(name,category,description,address,transport,mrt,lat,lng,images))
        connection.commit()

except Error as e:
    print("資料庫連接失敗：", e)

finally:
    cursor.close()
    connection.close()