let expenses = [];

function addExpense() {
    const category = document.getElementById("category").value.trim();
    const amount = Number(document.getElementById("amount").value);

    if (!category || amount <= 0) {
        alert("Please enter a valid category and amount.");
        return;
    }

    expenses.push({ category: category, amount: amount });

    const li = document.createElement("li");
    li.textContent = `${category}: ₹${amount}`;
    document.getElementById("expenseList").appendChild(li);

    document.getElementById("category").value = "";
    document.getElementById("amount").value = "";
}

async function analyzeBudget() {
    const income = Number(document.getElementById("income").value);

    if (income <= 0) {
        alert("Please enter a valid monthly income.");
        return;
    }

    const response = await fetch("/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ income: income, expenses: expenses })
    });

    const result = await response.json();

    document.getElementById("result").classList.remove("hidden");
    document.getElementById("incomeResult").textContent = result.income.toFixed(2);
    document.getElementById("expenseResult").textContent = result.total_expense.toFixed(2);
    document.getElementById("balanceResult").textContent = result.balance.toFixed(2);
    document.getElementById("recommendation").textContent = result.recommendation;

    const summary = document.getElementById("categorySummary");
    summary.innerHTML = "";

    for (const [category, amount] of Object.entries(result.categories)) {
        const li = document.createElement("li");
        li.textContent = `${category}: ₹${amount.toFixed(2)}`;
        summary.appendChild(li);
    }
}
