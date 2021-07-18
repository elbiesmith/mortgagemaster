// Total monthly payment (loanAmount) * (loanRate/1200)/(1-(1+loanRate/1200)(-loanTerm)
// Remaining Balance BEFORE the first month it equals the amount of the loan
// Interest Payment = Previous remaining balance * loanRate/1200
// Prinicpal Payment = Total Monthly payment - interest payment
// Remaining Balance AFTER each month, Previous Remaining Balance - principal payments.

// payment Calculation (amount * (rate / 1200)) / (1 - Math.pow(1 + rate / 1200, -term));
// interest Calculation balance * (rate / 1200);
let finalCost = 0;
let finalInterest = 0;
let principal = 0;
let finalPayment = 0;


function calcMonthlyPayment(loanAmount, loanRate, loanTerm) {
    return (loanAmount * (loanRate / 1200)) / (1 - Math.pow(1 + loanRate / 1200, -loanTerm));
}

function calcInterest(loanBalance, loanRate) {
    return (loanBalance * (loanRate / 1200));
}

function calculate() {
    buildTable();
    buildSummary();
    // resetForm();
}

function buildTable() {
    let resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = '';
    let results = '';

    let totalPrincipal = parseFloat(document.getElementById('loanAmount').value);
    let loanRate = parseFloat(document.getElementById('loanRate').value);
    let loanTerm = parseInt(document.getElementById('loanTerm').value);

    if (isNaN(totalPrincipal) || isNaN(loanRate) || isNaN(loanTerm)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Please make sure you are using numbers.'
        })
    } else if(totalPrincipal <= 0 || loanTerm <=0 || loanRate <=0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Only positive numbers are allowed.'
        })
    }else {

        let loanBalance = totalPrincipal;
        let monthlyPayment = calcMonthlyPayment(totalPrincipal, loanRate, loanTerm);
        let monthlyInterest = calcInterest(loanBalance, loanRate);
        let interest = monthlyInterest;
        let totalInterest = interest;
        let balance = totalPrincipal;
        finalPayment = monthlyPayment;

        for (let i = 1; i <= loanTerm; i++) {
            results = '';
            if (i == 1) {
                balance = balance - (monthlyPayment - interest)
                results += `
            <tr>
                <td>${i}</td>
                <td>${formatNumber(monthlyPayment)}</td>
                <td>${formatNumber(monthlyPayment - interest)}</td>
                <td>${formatNumber(interest)}</td>
                <td>${formatNumber(totalInterest)}</td>
                <td>${formatNumber(balance)}</td>
            </tr>`;
                totalBalance = balance;
            } else {
                totalInterest += calcInterest(totalBalance, loanRate);
                results += `
            <tr>
                <td>${i}</td>
                <td>${formatNumber(monthlyPayment)}</td>
                <td>${formatNumber(monthlyPayment - calcInterest(totalBalance, loanRate))}</td>
                <td>${formatNumber(calcInterest(totalBalance, loanRate))}</td>
                <td>${formatNumber(totalInterest)}</td>
                <td>${formatNumber(totalBalance - (monthlyPayment - calcInterest(totalBalance, loanRate)))}</td>
            </tr>`
                totalBalance -= (monthlyPayment - calcInterest(totalBalance, loanRate));
            }
            resultTable.innerHTML += results;
        }
        finalInterest = totalInterest;
        finalCost = totalPrincipal + finalInterest;
        principal = totalPrincipal;
    }
}

function buildSummary() {
    let paymentResult = document.getElementById('monthlyPayments');
    let principalResult = document.getElementById('totalPrincipal');
    let interestResult = document.getElementById('totalInterest');
    let costResult = document.getElementById('totalCost');

    paymentResult.innerHTML = formatNumber(finalPayment);
    principalResult.innerHTML = `${formatNumber(principal)}`;
    interestResult.innerHTML = `${formatNumber(finalInterest)}`;
    costResult.innerHTML = `<strong>${formatNumber(finalCost)}</strong>`;
}

function formatNumber(number) {
    let myCurrency = {
        currency: "USD",
        style: "currency"
    };
    return number.toLocaleString('en-US', myCurrency);
}

function resetForm() {
    let form = document.getElementById('loanForm');
    form.reset();
}