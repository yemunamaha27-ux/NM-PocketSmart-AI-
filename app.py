from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    income = float(data.get("income", 0))
    expenses = data.get("expenses", [])

    total_expense = sum(float(item.get("amount", 0)) for item in expenses)
    balance = income - total_expense

    categories = {}
    for item in expenses:
        category = item.get("category", "Other")
        amount = float(item.get("amount", 0))
        categories[category] = categories.get(category, 0) + amount

    if income <= 0:
        recommendation = "Please enter a valid monthly income."
    elif total_expense > income:
        recommendation = "Your expenses are higher than your income. Reduce non-essential spending immediately."
    elif total_expense >= income * 0.8:
        recommendation = "You are spending a high portion of your income. Try to save at least 20%."
    elif total_expense >= income * 0.6:
        recommendation = "Your spending is moderate. Review your largest category and look for savings."
    else:
        recommendation = "Good job! Your current spending is within a comfortable range. Consider increasing savings."

    return jsonify({
        "income": income,
        "total_expense": total_expense,
        "balance": balance,
        "categories": categories,
        "recommendation": recommendation
    })

if __name__ == "__main__":
    app.run(debug=True)
