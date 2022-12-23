from mysql.connector import pooling
import os
from dotenv import load_dotenv

load_dotenv()

def connect():
	return pooling.MySQLConnectionPool(
		pool_name = "taipei_pool",
		pool_size = 10,
		pool_reset_session = True,
		host = "localhost",
		user = "root",
		password = os.getenv("password"),
		database = "website"
	)