from dotenv import load_dotenv
import os

# Define the path to the .env file, which is one directory level above the current directory
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')

# Load the environment variables from the specified .env file
load_dotenv(dotenv_path)
import mysql.connector
from mysql.connector import Error

class MySQLDatabase:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MySQLDatabase, cls).__new__(cls)
            try:
                if os.getenv('ENVIRONMENT') == 'PROD':
                    cls._instance.connection = mysql.connector.connect(
                        host=os.getenv('DB_HOST'),
                        user=os.getenv('DB_USER'),
                        passwd=os.getenv('DB_PASSWORD'),
                        database=os.getenv('DB_NAME'),
                        # ssl_ca=os.getenv('DB_ROOT_CERT'),
                        # ssl_key=os.getenv('DB_KEY'),
                        # ssl_cert=os.getenv('DB_CERT')
                    )
                else:
                    cls._instance.connection = mysql.connector.connect(
                        host=os.getenv('DB_HOST'),
                        user=os.getenv('DB_USER'),
                        passwd=os.getenv('DB_PASSWORD'),
                        database=os.getenv('DB_NAME')
                    )
                if cls._instance.connection.is_connected():
                    print("MySQL Database connection successful")
            except Error as e:
                print(f"Error: '{e}'")
        return cls._instance

    def execute_query(self, query):
        cursor = self.connection.cursor()
        try:
            cursor.execute(query)
            self.connection.commit()
            print("Query successful")
        except Error as e:
            print(f"Error: '{e}'")

    def read_query(self, query):
        cursor = self.connection.cursor()
        try:
            cursor.execute(query)
            result = cursor.fetchall()
            return result
        except Error as e:
            print(f"Error: '{e}'")
            return None

# Usage
db = MySQLDatabase()  # Singleton instance

# # Example of executing a query
# db.execute_query("INSERT INTO your_table (column1, column2) VALUES ('value1', 'value2')")

# # Example of reading data from database
# results = db.read_query("SELECT * FROM your_table")
# for result in results:
#     print(result)
