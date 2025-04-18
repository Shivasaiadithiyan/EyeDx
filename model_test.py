import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import classification_report

# -----------------------------
# CONFIGURATION
# -----------------------------
IMAGE_SIZE = (300, 300)
BATCH_SIZE = 32
TEST_DIR = "OCT_Dataset/test"
MODEL_PATH = "best_final.h5"

# -----------------------------
# LOAD MODEL
# -----------------------------
model = load_model(MODEL_PATH)
print(f"✅ Loaded model from {MODEL_PATH}")

# -----------------------------
# TEST DATA GENERATOR
# -----------------------------
test_datagen = ImageDataGenerator(rescale=1./255)

test_generator = test_datagen.flow_from_directory(
    TEST_DIR,
    target_size=IMAGE_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    shuffle=False
)

# -----------------------------
# GET CLASS NAMES
# -----------------------------
class_names = list(test_generator.class_indices.keys())
print("📂 Class names:", class_names)

# -----------------------------
# PREDICT & REPORT
# -----------------------------
test_generator.reset()
Y_pred = model.predict(test_generator)
y_pred = np.argmax(Y_pred, axis=1)

print("\n✅ Classification Report:")
print(classification_report(test_generator.classes, y_pred, 
                            target_names=class_names))
