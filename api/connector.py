from mysql.connector import pooling

def connect():
	return pooling.MySQLConnectionPool(
		pool_name = "taipei_pool",
		pool_size = 10,
		pool_reset_session = True,
		host = "localhost",
		user = "root",
		password = "Password123",
		database = "website"
	)