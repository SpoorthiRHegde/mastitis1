from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier, VotingClassifier
from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app)

# Load the dataset
dataframe = pd.read_csv('dataset_95.csv')
data=dataframe.drop_duplicates( keep=False)

# Define features and target
X = data[['Temperature', 'Hardness', 'Pain', 'Milk Yield', 'Milk Color']]
y = data['Mastitis']

# Split the dataset
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train the Random Forest model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
gb_model = GradientBoostingClassifier(n_estimators=100, random_state=42)
svc_model = SVC(kernel='rbf', probability=True, random_state=42)
model = VotingClassifier(
    estimators=[
        ('RandomForest', rf_model),
        ('GradientBoosting', gb_model),
        ('SVM', svc_model)
    ],
    voting='soft' 
)
model.fit(X_train, y_train)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        temperature = data['temperature']
        hardness = data['hardness']
        pain = data['pain']
        milk_yield = data['milk_visibility']
        milk_color = data['milk_color']

        # Prepare input data for prediction
        input_data = pd.DataFrame([[temperature, hardness, pain, milk_yield, milk_color]],
                                  columns=['Temperature', 'Hardness', 'Pain', 'Milk Yield', 'Milk Color'])

        # Make prediction
        prediction = model.predict(input_data)[0]
        result = {
            'prediction': "Mastitis Detected" if prediction == 1 else "No Mastitis"
        }
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
