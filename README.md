# EyeDx
Ai based oct scan classification

#1. DataSet
Run this python script to download the dataset from kaggle

import kagglehub

path = kagglehub.dataset_download("paultimothymooney/kermany2018")

print("Path to dataset files:", path)

------------------------------------------------------------------------

#2. Model Training
Update the path to dataset in the model.py
Run the model.py to train the model

------------------------------------------------------------------------

#3. Model Testing
Run the model_test.py python script to get the model accuracy and
the metrics like f1 score and recall for model evaluauation

------------------------------------------------------------------------
