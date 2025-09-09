import pyodbc

def get_connection():
    conn = pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=;"
        "DATABASE=TitulacionesBDNR;"
        "UID=sa;"
        "PWD="
    )
    return conn


