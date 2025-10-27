#%%
import pandas as pd 
from pathlib  import Path

# Get unique values from a specific column in the CSV
def get_unique_values(csv_file, column_name):
    df = pd.read_csv(csv_file)
    return df[column_name].unique().tolist()

df = pd.read_csv('gendered_with_new_paths.csv')
occupations = get_unique_values('gendered_with_new_paths.csv', 'imgCareer')
AIs = get_unique_values('gendered_with_new_paths.csv', 'AI')
# %%
