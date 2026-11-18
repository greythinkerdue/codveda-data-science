# Codveda Data Science Task Portfolio

## Scope
This portfolio implements six selected tasks from the supplied Codveda Data Science Task List, with the provided datasets.

### Selected tasks
- Level 1: Data Cleaning & Preprocessing; Exploratory Data Analysis (EDA)
- Level 2: Predictive Modeling (Regression); Classification
- Level 3: NLP Text Classification; Neural Networks

### Datasets used
- Telecom churn: 3,333 rows total (2,666 train; 667 test), 20 source features plus split marker.
- Housing prediction: 506 rows and 14 columns; header names assigned to the conventional Boston Housing order.
- Social media sentiment: 732 text records, 191 normalized source emotion labels.
- Iris: 150 rows; 3 duplicate rows identified and removed in the processed copy. Not used for selected modeling tasks.

## Key results
- Housing regression: Decision Tree achieved R² = 0.885 and RMSE = 2.906; Random Forest achieved MAE = 2.077.
- Churn classification: Random Forest achieved accuracy = 94.75%, precision = 91.67%, recall = 69.47%, F1 = 79.04%, ROC-AUC = 0.923.
- NLP: Logistic Regression achieved accuracy = 78.23% and macro F1 = 0.687.
- Neural network: MLP achieved accuracy = 90.55%, F1 = 67.36%, and ROC-AUC = 0.888.

## EDA findings
- Overall churn rate: 14.49%.
- Churn rate for customers with an international plan: 42.41%; without a plan: 11.50%.
- Churn rate among customers with 4+ customer-service calls: 51.69%; among those with 0–3 calls: 11.25%.
- Mean daily usage: churned customers 206.9 minutes; non-churned customers 175.2 minutes.

## Data quality
- Churn: 0 missing cells and 0 duplicate records. IQR outliers were flagged for review and retained where plausible.
- Sentiment: index-artifact columns removed; text whitespace normalized; timestamps parsed; emotion labels normalized.
- Housing: no header in source; conventional field names assigned by column order.
- Iris: 3 duplicate rows removed in processed copy.

## Important limitations
1. The sentiment source contains many emotion labels, not a native Positive/Negative/Neutral target. The three-class polarity label is a documented heuristic grouping. Results should be described as derived-label text classification.
2. The housing data is the historical Boston Housing benchmark and is not appropriate for current property pricing. The race-derived `B` feature was excluded from modeling.
3. The churn dataset is imbalanced. Report F1, recall, and ROC-AUC alongside accuracy.
4. Web scraping, clustering, and time-series forecasting were not selected because the brief requires only two tasks per level and the supplied datasets more directly support the selected tasks.

## Reproducibility
Open `notebooks/Codveda_Data_Science_Tasks.ipynb` in Jupyter. Run cells from top to bottom. Required libraries include pandas, numpy, matplotlib, scipy, scikit-learn, and nbformat/Jupyter for notebook execution.

Notebook status: Notebook contains the reproducible Keras implementation; Keras metrics were executed and documented in the report. Re-run the notebook in an environment with TensorFlow/Keras or Keras 3 + PyTorch.
------------------
housing_cols = ["CRIM","ZN","INDUS","CHAS","NOX","RM","AGE","DIS","RAD","TAX","PTRATIO","B","LSTAT","MEDV"]
housing = housing_raw.copy()
housing.columns = housing_cols
X = housing.drop(columns=["MEDV","B"])
y = housing["MEDV"]
X_train_h, X_test_h, y_train_h, y_test_h = train_test_split(X, y, test_size=0.2, random_state=42)

reg_models = {
    "Linear Regression": Pipeline([("scaler", StandardScaler()), ("model", LinearRegression())]),
    "Decision Tree": DecisionTreeRegressor(random_state=42, max_depth=5, min_samples_leaf=3),
    "Random Forest": RandomForestRegressor(n_estimators=300, random_state=42, min_samples_leaf=2, n_jobs=-1)
}
reg_rows = []
for name, model in reg_models.items():
    model.fit(X_train_h, y_train_h)
    pred = model.predict(X_test_h)
    reg_rows.append({"Model": name, "MAE": mean_absolute_error(y_test_h,pred),
                     "RMSE": mean_squared_error(y_test_h,pred)**0.5, "R2": r2_score(y_test_h,pred)})
reg_metrics = pd.DataFrame(reg_rows)
reg_metrics

------------------


[31m---------------------------------------------------------------------------[39m
[31mValueError[39m                                Traceback (most recent call last)
[36mCell[39m[36m [39m[32mIn[4][39m[32m, line 3[39m
[32m      1[39m housing_cols = [[33m"CRIM"[39m,[33m"ZN"[39m,[33m"INDUS"[39m,[33m"CHAS"[39m,[33m"NOX"[39m,[33m"RM"[39m,[33m"AGE"[39m,[33m"DIS"[39m,[33m"RAD"[39m,[33m"TAX"[39m,[33m"PTRATIO"[39m,[33m"B"[39m,[33m"LSTAT"[39m,[33m"MEDV"[39m]
[32m      2[39m housing = housing_raw.copy()
[32m----> [39m[32m3[39m housing.columns = housing_cols
[32m      4[39m X = housing.drop(columns=[[33m"MEDV"[39m,[33m"B"[39m])
[32m      5[39m y = housing[[33m"MEDV"[39m]
[32m      6[39m X_train_h, X_test_h, y_train_h, y_test_h = train_test_split(X, y, test_size=[32m0.2[39m, random_state=[32m42[39m)

[36mFile [39m[32m/opt/pyvenv/lib/python3.13/site-packages/pandas/core/generic.py:6314[39m, in [36mNDFrame.__setattr__[39m[34m(self, name, value)[39m
[32m   6310[39m 
[32m   6311[39m         [38;5;28;01mtry[39;00m:
[32m   6312[39m             object.__getattribute__(self, name)
[32m   6313[39m             [38;5;28;01mreturn[39;00m object.__setattr__(self, name, value)
[32m-> [39m[32m6314[39m         [38;5;28;01mexcept[39;00m AttributeError:
[32m   6315[39m             [38;5;28;01mpass[39;00m
[32m   6316[39m 
[32m   6317[39m         [38;5;66;03m# if this fails, go on to more involved attribute setting[39;00m

[36mFile [39m[32mproperties.pyx:69[39m, in [36mpandas._libs.properties.AxisProperty.__set__[39m[34m()[39m
[32m---> [39m[32m69[39m [33m'Could not get source, probably due dynamically evaluated source code.'[39m

[36mFile [39m[32m/opt/pyvenv/lib/python3.13/site-packages/pandas/core/generic.py:814[39m, in [36mNDFrame._set_axis[39m[34m(self, axis, labels)[39m
[32m    810[39m         This [38;5;28;01mis[39;00m called [38;5;28;01mfrom[39;00m the cython code when we set the `index` attribute
[32m    811[39m         directly, e.g. `series.index = [[32m1[39m, [32m2[39m, [32m3[39m]`.
[32m    812[39m         """
[32m    813[39m         labels = ensure_index(labels)
[32m--> [39m[32m814[39m         self._mgr.set_axis(axis, labels)
[32m    815[39m         self._clear_item_cache()

[36mFile [39m[32m/opt/pyvenv/lib/python3.13/site-packages/pandas/core/internals/managers.py:238[39m, in [36mBaseBlockManager.set_axis[39m[34m(self, axis, new_labels)[39m
[32m    236[39m [38;5;28;01mdef[39;00m[38;5;250m [39m[34mset_axis[39m([38;5;28mself[39m, axis: AxisInt, new_labels: Index) -> [38;5;28;01mNone[39;00m:
[32m    237[39m     [38;5;66;03m# Caller is responsible for ensuring we have an Index object.[39;00m
[32m--> [39m[32m238[39m     [30;43mself[39;49m[30;43m.[39;49m[30;43m_validate_set_axis[39;49m[30;43m([39;49m[30;43maxis[39;49m[30;43m,[39;49m[30;43m [39;49m[30;43mnew_labels[39;49m[30;43m)[39;49m
[32m    239[39m     [38;5;28mself[39m.axes[axis] = new_labels

[36mFile [39m[32m/opt/pyvenv/lib/python3.13/site-packages/pandas/core/internals/base.py:98[39m, in [36mDataManager._validate_set_axis[39m[34m(self, axis, new_labels)[39m
[32m     95[39m     [38;5;28;01mpass[39;00m
[32m     97[39m [38;5;28;01melif[39;00m new_len != old_len:
[32m---> [39m[32m98[39m     [38;5;28;01mraise[39;00m [38;5;167;01mValueError[39;00m(
[32m     99[39m         [33mf[39m[33m"[39m[33mLength mismatch: Expected axis has [39m[38;5;132;01m{[39;00mold_len[38;5;132;01m}[39;00m[33m elements, new [39m[33m"[39m
[32m    100[39m         [33mf[39m[33m"[39m[33mvalues have [39m[38;5;132;01m{[39;00mnew_len[38;5;132;01m}[39;00m[33m elements[39m[33m"[39m
[32m    101[39m     )

[31mValueError[39m: Length mismatch: Expected axis has 1 elements, new values have 14 elements

