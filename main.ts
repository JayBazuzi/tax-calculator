// Type definitions
interface TaxBracket {
    rate: number;
    min: number;
    max: number;
}

interface FilingStatusData {
    standardDeduction: number | null;
    ordinaryIncome: TaxBracket[];
    longTermCapitalGains: TaxBracket[];
}

interface YearData {
    marriedFilingJointly: FilingStatusData;
}

interface TaxData {
    [year: string]: YearData;
}

interface TaxCalculation {
    amount: number;
    rate: number;
    tax: number;
}

// Load tax data
let taxData: TaxData;

async function loadTaxData(): Promise<void> {
    const response = await fetch('tax-data.json');
    taxData = await response.json();
}

// DOM elements
const filingStatusSelect = document.getElementById('filing-status') as HTMLSelectElement;
const taxYearSelect = document.getElementById('tax-year') as HTMLSelectElement;
const regularIncomeSlider = document.getElementById('regular-income') as HTMLInputElement;
const regularIncomeValue = document.getElementById('regular-income-value') as HTMLInputElement;
const ltcgSlider = document.getElementById('ltcg') as HTMLInputElement;
const ltcgValue = document.getElementById('ltcg-value') as HTMLInputElement;
const totalIncomeDisplay = document.getElementById('total-income') as HTMLElement;
const totalTaxesDisplay = document.getElementById('total-taxes') as HTMLElement;
const regularIncomeTaxesDiv = document.getElementById('regular-income-taxes') as HTMLElement;
const ltcgTaxesDiv = document.getElementById('ltcg-taxes') as HTMLElement;
const ordinaryBracketsDiv = document.getElementById('ordinary-brackets') as HTMLElement;
const ltcgBracketsDiv = document.getElementById('ltcg-brackets') as HTMLElement;

// Utility functions
function formatCurrency(amount: number): string {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function getCurrentTaxData(): FilingStatusData | null {
    const year = taxYearSelect.value;
    const filingStatus = filingStatusSelect.value as keyof YearData;

    if (!taxData[year]) {
        return null;
    }

    const data = taxData[year][filingStatus];

    // Check if data is available
    if (!data.standardDeduction || data.ordinaryIncome.length === 0) {
        return null;
    }

    return data;
}

function calculateTaxForBrackets(income: number, brackets: TaxBracket[]): TaxCalculation[] {
    const calculations: TaxCalculation[] = [];
    let remainingIncome = income;

    for (const bracket of brackets) {
        if (remainingIncome <= 0) break;

        const bracketSize = bracket.max - bracket.min;
        const taxableInThisBracket = Math.min(remainingIncome, bracketSize);

        if (taxableInThisBracket > 0) {
            const tax = taxableInThisBracket * bracket.rate;
            calculations.push({
                amount: taxableInThisBracket,
                rate: bracket.rate,
                tax: tax
            });
            remainingIncome -= taxableInThisBracket;
        }
    }

    return calculations;
}

function calculateTaxes(): void {
    const taxConfig = getCurrentTaxData();

    if (!taxConfig) {
        regularIncomeTaxesDiv.innerHTML = '<div class="tax-line">Tax data not available for selected year</div>';
        ltcgTaxesDiv.innerHTML = '<div class="tax-line">Tax data not available for selected year</div>';
        totalTaxesDisplay.textContent = '$0';
        return;
    }

    const regularIncome = parseInt(regularIncomeSlider.value);
    const ltcg = parseInt(ltcgSlider.value);
    const totalIncome = regularIncome + ltcg;

    // Update total income display
    totalIncomeDisplay.textContent = formatCurrency(totalIncome);

    // Calculate taxable income (after standard deduction)
    const standardDeduction = taxConfig.standardDeduction || 0;
    const taxableRegularIncome = Math.max(0, regularIncome - standardDeduction);

    // Calculate regular income taxes
    const regularIncomeTaxes = calculateTaxForBrackets(taxableRegularIncome, taxConfig.ordinaryIncome);

    // For LTCG, the brackets are based on total taxable income
    const ltcgStartsAt = taxableRegularIncome;

    // Calculate LTCG taxes
    let ltcgTaxes: TaxCalculation[] = [];
    let remainingLTCG = ltcg;

    for (const bracket of taxConfig.longTermCapitalGains) {
        if (remainingLTCG <= 0) break;

        // Determine how much LTCG falls in this bracket
        const bracketStart = Math.max(bracket.min, ltcgStartsAt);
        const bracketEnd = bracket.max;

        if (ltcgStartsAt + remainingLTCG > bracketStart) {
            const incomeAtBracketStart = Math.max(0, bracketStart - ltcgStartsAt);
            const incomeAtBracketEnd = Math.min(remainingLTCG, bracketEnd - ltcgStartsAt);
            const taxableInThisBracket = incomeAtBracketEnd - incomeAtBracketStart;

            if (taxableInThisBracket > 0) {
                const tax = taxableInThisBracket * bracket.rate;
                ltcgTaxes.push({
                    amount: taxableInThisBracket,
                    rate: bracket.rate,
                    tax: tax
                });
                remainingLTCG -= taxableInThisBracket;
            }
        }
    }

    // Display regular income taxes
    if (regularIncomeTaxes.length === 0) {
        regularIncomeTaxesDiv.innerHTML = '<div class="tax-line">$0 @ 0% = $0</div>';
    } else {
        regularIncomeTaxesDiv.innerHTML = regularIncomeTaxes
            .map(calc => `<div class="tax-line">${formatCurrency(calc.amount)} @ ${(calc.rate * 100).toFixed(0)}% = ${formatCurrency(calc.tax)}</div>`)
            .join('');
    }

    // Display LTCG taxes
    if (ltcgTaxes.length === 0) {
        ltcgTaxesDiv.innerHTML = '<div class="tax-line">$0 @ 0% = $0</div>';
    } else {
        ltcgTaxesDiv.innerHTML = ltcgTaxes
            .map(calc => `<div class="tax-line">${formatCurrency(calc.amount)} @ ${(calc.rate * 100).toFixed(0)}% = ${formatCurrency(calc.tax)}</div>`)
            .join('');
    }

    // Calculate and display total taxes
    const totalRegularTax = regularIncomeTaxes.reduce((sum, calc) => sum + calc.tax, 0);
    const totalLTCGTax = ltcgTaxes.reduce((sum, calc) => sum + calc.tax, 0);
    const totalTax = totalRegularTax + totalLTCGTax;

    totalTaxesDisplay.textContent = formatCurrency(totalTax);
}

function updateBracketDisplay(): void {
    const taxConfig = getCurrentTaxData();

    if (!taxConfig) {
        ordinaryBracketsDiv.innerHTML = '<div>Data not available</div>';
        ltcgBracketsDiv.innerHTML = '<div>Data not available</div>';
        return;
    }

    // Display ordinary income brackets
    ordinaryBracketsDiv.innerHTML = taxConfig.ordinaryIncome
        .map(bracket => `<div class="bracket-label">${(bracket.rate * 100).toFixed(0)}%</div>`)
        .join('');

    // Display LTCG brackets
    ltcgBracketsDiv.innerHTML = taxConfig.longTermCapitalGains
        .map(bracket => `<div class="bracket-label">${(bracket.rate * 100).toFixed(0)}%</div>`)
        .join('');
}

function syncSliderAndInput(slider: HTMLInputElement, input: HTMLInputElement): void {
    slider.addEventListener('input', () => {
        input.value = slider.value;
        calculateTaxes();
    });

    input.addEventListener('input', () => {
        const value = parseInt(input.value) || 0;
        const clampedValue = Math.max(0, Math.min(1000000, value));
        input.value = clampedValue.toString();
        slider.value = clampedValue.toString();
        calculateTaxes();
    });
}

function handleTaxYearChange(): void {
    updateBracketDisplay();
    calculateTaxes();
}

// Initialize
async function init(): Promise<void> {
    await loadTaxData();

    // Set up event listeners
    syncSliderAndInput(regularIncomeSlider, regularIncomeValue);
    syncSliderAndInput(ltcgSlider, ltcgValue);

    taxYearSelect.addEventListener('change', handleTaxYearChange);
    filingStatusSelect.addEventListener('change', () => {
        updateBracketDisplay();
        calculateTaxes();
    });

    // Initial display
    updateBracketDisplay();
    calculateTaxes();
}

// Start the application
init();
