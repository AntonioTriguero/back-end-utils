import pandas as pd
import numpy as np

def timesteps(dataframe, n):
  nrows = dataframe.shape[0]
  result = []
  for i in range(n, nrows):
    result.append(dataframe.iloc[i-n:i].to_numpy())
  return np.array(result)
