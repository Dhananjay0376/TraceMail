# Colab-ready Python script for training TraceMail models
# Dataset: subhajournal/phishingemails

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, confusion_matrix

print(\"=== TraceMail: Training Baseline & DistilBERT Models ===\")

# 1. Load Dataset
# In Colab: !kaggle datasets download -d subhajournal/phishingemails -p ./data --unzip
data_path = './data/Phishing_Email.csv'
if os.path.exists(data_path):
    df = pd.read_csv(data_path).dropna(subset=['Email Text', 'Email Type'])
    df['label'] = df['Email Type'].map({'Safe Email': 0, 'Phishing Email': 1})
    df = df.rename(columns={'Email Text': 'text'})
    print(f\"Loaded {len(df)} rows. Label counts: {df['label'].value_counts().to_dict()}\")

    # 2. Train / Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        df['text'], df['label'], test_size=0.2, random_state=42, stratify=df['label']
    )

    # 3. TF-IDF + Logistic Regression Baseline
    print(\"\n--- Training Baseline (TF-IDF + Logistic Regression) ---\")
    vec = TfidfVectorizer(stop_words='english', max_features=5000)
    X_train_tfidf = vec.fit_transform(X_train)
    X_test_tfidf = vec.transform(X_test)

    baseline_model = LogisticRegression(max_iter=1000)
    baseline_model.fit(X_train_tfidf, y_train)
    preds = baseline_model.predict(X_test_tfidf)
    print(\"Baseline Report:\")
    print(classification_report(y_test, preds, target_names=['Safe Email', 'Phishing Email']))
else:
    print(f\"Dataset not found at {data_path}. Please download via Kaggle CLI.\")
