import pandas as pd
df = pd.read_csv ('D:/Users/raul.esqueda/Class/test_web/db_catastro.csv')
df.to_json ('D:/Users/raul.esqueda/Class/test_web/catastro.json')