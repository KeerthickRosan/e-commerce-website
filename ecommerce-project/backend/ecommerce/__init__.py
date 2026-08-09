import os
try:
    import pymysql
    pymysql.install_as_MySQLdb()
except Exception:
    # If pymysql isn't available yet, Django will fail later; keep import lazy-safe.
    pass
