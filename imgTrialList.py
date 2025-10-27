#%%
import pandas as pd 
from pathlib  import Path

# Read in the CSV
df = pd.read_csv('gendered_with_new_paths.csv')
df.head()

# convert all floats to ints where possible
for col in df.select_dtypes(include=['float']).columns:
    if all(df[col].dropna().apply(float.is_integer)):
        df[col] = df[col].astype('Int64')

# Change all rows that are blank to NaN
df = df.replace(r'^\s*$', pd.NA, regex=True)

# Convert the df into a js object list
listOfDicts = df.to_dict(orient='records')

# Save the list of dicts as a js file
with open('genderedImageList.js', 'w') as f:
    f.write('const genderedImageList = [\n')
    for item in listOfDicts:
        f.write('  ' + str(item).replace("'", '"') + ',\n')
    f.write('];\n')



# %%
