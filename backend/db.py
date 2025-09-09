import pyodbc

def get_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=DESKTOP-HI6U3GK\SQLEXPRESS;"
        "DATABASE=TitulacionesBDNR;"
        "UID=sa;"
        "PWD="
    )
    return conn

