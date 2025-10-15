// Retirement Tax Calculator

interface TaxBracket {
  rate: number;
  min: number;
  max: number | null;
}

interface FilingStatusData {
  standardDeduction: number;
  ordinaryIncome: TaxBracket[];
  longTermCapitalGains: TaxBracket[];
}

interface TaxData {
  [year: string]: {
    [filingStatus: string]: FilingStatusData;
  };
}

// Constants
const MAX_INCOME = 1000000; // Maximum income for slider ($1M)
const YEAR = "2025"; // Using 2025 tax data

// Embedded tax data (from tax-data.json)
const taxData: TaxData = {
  "2024": {
    "single": {
      "standardDeduction": 14600,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 11600 },
        { "rate": 0.12, "min": 11600, "max": 47150 },
        { "rate": 0.22, "min": 47150, "max": 100525 },
        { "rate": 0.24, "min": 100525, "max": 191950 },
        { "rate": 0.32, "min": 191950, "max": 243725 },
        { "rate": 0.35, "min": 243725, "max": 609350 },
        { "rate": 0.37, "min": 609350, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 47025 },
        { "rate": 0.15, "min": 47025, "max": 518900 },
        { "rate": 0.20, "min": 518900, "max": null },
      ],
    },
    "marriedFilingJointly": {
      "standardDeduction": 29200,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 23200 },
        { "rate": 0.12, "min": 23200, "max": 94300 },
        { "rate": 0.22, "min": 94300, "max": 201050 },
        { "rate": 0.24, "min": 201050, "max": 383900 },
        { "rate": 0.32, "min": 383900, "max": 487450 },
        { "rate": 0.35, "min": 487450, "max": 731200 },
        { "rate": 0.37, "min": 731200, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 94050 },
        { "rate": 0.15, "min": 94050, "max": 583750 },
        { "rate": 0.20, "min": 583750, "max": null },
      ],
    },
    "marriedFilingSeparately": {
      "standardDeduction": 14600,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 11600 },
        { "rate": 0.12, "min": 11600, "max": 47150 },
        { "rate": 0.22, "min": 47150, "max": 100525 },
        { "rate": 0.24, "min": 100525, "max": 191950 },
        { "rate": 0.32, "min": 191950, "max": 243725 },
        { "rate": 0.35, "min": 243725, "max": 365600 },
        { "rate": 0.37, "min": 365600, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 47025 },
        { "rate": 0.15, "min": 47025, "max": 291850 },
        { "rate": 0.20, "min": 291850, "max": null },
      ],
    },
    "headOfHousehold": {
      "standardDeduction": 21900,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 16550 },
        { "rate": 0.12, "min": 16550, "max": 63100 },
        { "rate": 0.22, "min": 63100, "max": 100500 },
        { "rate": 0.24, "min": 100500, "max": 191950 },
        { "rate": 0.32, "min": 191950, "max": 243700 },
        { "rate": 0.35, "min": 243700, "max": 609350 },
        { "rate": 0.37, "min": 609350, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 63000 },
        { "rate": 0.15, "min": 63000, "max": 551350 },
        { "rate": 0.20, "min": 551350, "max": null },
      ],
    },
  },
  "2025": {
    "single": {
      "standardDeduction": 15000,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 11925 },
        { "rate": 0.12, "min": 11925, "max": 48475 },
        { "rate": 0.22, "min": 48475, "max": 103350 },
        { "rate": 0.24, "min": 103350, "max": 197300 },
        { "rate": 0.32, "min": 197300, "max": 250525 },
        { "rate": 0.35, "min": 250525, "max": 626350 },
        { "rate": 0.37, "min": 626350, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 48350 },
        { "rate": 0.15, "min": 48350, "max": 533400 },
        { "rate": 0.20, "min": 533400, "max": null },
      ],
    },
    "marriedFilingJointly": {
      "standardDeduction": 30000,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 23850 },
        { "rate": 0.12, "min": 23850, "max": 96950 },
        { "rate": 0.22, "min": 96950, "max": 206700 },
        { "rate": 0.24, "min": 206700, "max": 394600 },
        { "rate": 0.32, "min": 394600, "max": 501050 },
        { "rate": 0.35, "min": 501050, "max": 751600 },
        { "rate": 0.37, "min": 751600, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 96700 },
        { "rate": 0.15, "min": 96700, "max": 600050 },
        { "rate": 0.20, "min": 600050, "max": null },
      ],
    },
    "marriedFilingSeparately": {
      "standardDeduction": 15000,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 11925 },
        { "rate": 0.12, "min": 11925, "max": 48475 },
        { "rate": 0.22, "min": 48475, "max": 103350 },
        { "rate": 0.24, "min": 103350, "max": 197300 },
        { "rate": 0.32, "min": 197300, "max": 250525 },
        { "rate": 0.35, "min": 250525, "max": 375800 },
        { "rate": 0.37, "min": 375800, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 48350 },
        { "rate": 0.15, "min": 48350, "max": 533400 },
        { "rate": 0.20, "min": 533400, "max": null },
      ],
    },
    "headOfHousehold": {
      "standardDeduction": 22500,
      "ordinaryIncome": [
        { "rate": 0.10, "min": 0, "max": 17000 },
        { "rate": 0.12, "min": 17000, "max": 64850 },
        { "rate": 0.22, "min": 64850, "max": 103350 },
        { "rate": 0.24, "min": 103350, "max": 197300 },
        { "rate": 0.32, "min": 197300, "max": 250500 },
        { "rate": 0.35, "min": 250500, "max": 626350 },
        { "rate": 0.37, "min": 626350, "max": null },
      ],
      "longTermCapitalGains": [
        { "rate": 0.00, "min": 0, "max": 64750 },
        { "rate": 0.15, "min": 64750, "max": 566700 },
        { "rate": 0.20, "min": 566700, "max": null },
      ],
    },
  },
};

// State
let regularIncome = 0;
let ltcgIncome = 0;
let currentFilingStatus: FilingStatusData;

// DOM Elements
const regularIncomeBar = document.getElementById('regular-income-bar') as HTMLElement;
const ltcgBar = document.getElementById('ltcg-bar') as HTMLElement;
const regularThumb = document.getElementById('regular-thumb') as HTMLElement;
const ltcgThumb = document.getElementById('ltcg-thumb') as HTMLElement;
const regularIncomeInput = document.getElementById('regular-income-input') as HTMLInputElement;
const ltcgInput = document.getElementById('ltcg-input') as HTMLInputElement;
const totalIncomeSpan = document.getElementById('total-income') as HTMLElement;
const standardDeductionSpan = document.getElementById('standard-deduction') as HTMLElement;
const filingStatusSelect = document.getElementById('filing-status') as HTMLSelectElement;
const incomeBarTrack = document.querySelector('.income-bar-track') as HTMLElement;

// Load tax data
function loadTaxData(): void {
  currentFilingStatus = taxData[YEAR].marriedFilingJointly;
  updateStandardDeduction();
}

// Update standard deduction display
function updateStandardDeduction(): void {
  standardDeductionSpan.textContent = `$${currentFilingStatus.standardDeduction.toLocaleString()}`;
}

// Calculate percentage position for income amount
function incomeToPercent(income: number): number {
  return (income / MAX_INCOME) * 100;
}

// Calculate income from percentage position
function percentToIncome(percent: number): number {
  return Math.round((percent / 100) * MAX_INCOME);
}

// Update visual display of bars and thumbs
function updateDisplay(): void {
  const regularPercent = incomeToPercent(regularIncome);
  const ltcgPercent = incomeToPercent(ltcgIncome);

  // Update regular income bar and thumb
  regularIncomeBar.style.width = `${regularPercent}%`;
  regularThumb.style.left = `${regularPercent}%`;

  // Update LTCG bar (starts where regular income ends)
  ltcgBar.style.left = `${regularPercent}%`;
  ltcgBar.style.width = `${ltcgPercent}%`;
  ltcgThumb.style.left = `${regularPercent + ltcgPercent}%`;

  // Update input fields
  regularIncomeInput.value = regularIncome.toString();
  ltcgInput.value = ltcgIncome.toString();

  // Update total income
  const totalIncome = regularIncome + ltcgIncome;
  totalIncomeSpan.textContent = `$${totalIncome.toLocaleString()}`;

  // Calculate and display taxes
  calculateTaxes();
}

// Calculate taxes based on current income
function calculateTaxes(): void {
  const standardDeduction = currentFilingStatus.standardDeduction;

  // Calculate taxable regular income (after standard deduction)
  const taxableRegularIncome = Math.max(0, regularIncome - standardDeduction);

  // Calculate regular income taxes
  const regularIncomeTaxes = calculateBracketTaxes(
    taxableRegularIncome,
    currentFilingStatus.ordinaryIncome,
  );

  // For LTCG, the income stacks on top of regular income for bracket purposes
  const totalIncomeForLTCG = regularIncome + ltcgIncome - standardDeduction;
  const ltcgStartIncome = Math.max(0, regularIncome - standardDeduction);

  // Calculate LTCG taxes
  const ltcgTaxes = calculateLTCGTaxes(
    ltcgStartIncome,
    totalIncomeForLTCG,
    currentFilingStatus.longTermCapitalGains,
  );

  // Display regular income taxes
  displayRegularIncomeTaxes(regularIncomeTaxes);

  // Display LTCG taxes
  displayLTCGTaxes(ltcgTaxes);

  // Display total taxes
  const totalTax = regularIncomeTaxes.total + ltcgTaxes.total;
  const totalTaxesSpan = document.getElementById('total-taxes') as HTMLElement;
  totalTaxesSpan.textContent = `$${Math.round(totalTax).toLocaleString()}`;
}

// Calculate taxes for regular income brackets
function calculateBracketTaxes(
  taxableIncome: number,
  brackets: TaxBracket[],
): { brackets: Array<{ amount: number; rate: number; tax: number }>; total: number } {
  const result: Array<{ amount: number; rate: number; tax: number }> = [];
  let remainingIncome = taxableIncome;
  let total = 0;

  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;

    const bracketMin = bracket.min;
    const bracketMax = bracket.max ?? Infinity;
    const bracketSize = bracketMax - bracketMin;
    const incomeInBracket = Math.min(remainingIncome, bracketSize);

    if (incomeInBracket > 0) {
      const tax = incomeInBracket * bracket.rate;
      result.push({
        amount: incomeInBracket,
        rate: bracket.rate,
        tax: tax,
      });
      total += tax;
      remainingIncome -= incomeInBracket;
    }
  }

  return { brackets: result, total };
}

// Calculate LTCG taxes (considering stacking on top of regular income)
function calculateLTCGTaxes(
  startIncome: number,
  endIncome: number,
  brackets: TaxBracket[],
): { brackets: Array<{ amount: number; rate: number; tax: number }>; total: number } {
  const result: Array<{ amount: number; rate: number; tax: number }> = [];
  let total = 0;

  if (startIncome >= endIncome) {
    return { brackets: result, total: 0 };
  }

  for (const bracket of brackets) {
    const bracketMin = bracket.min;
    const bracketMax = bracket.max ?? Infinity;

    // Calculate how much LTCG falls in this bracket
    const incomeStart = Math.max(startIncome, bracketMin);
    const incomeEnd = Math.min(endIncome, bracketMax);
    const incomeInBracket = Math.max(0, incomeEnd - incomeStart);

    if (incomeInBracket > 0) {
      const tax = incomeInBracket * bracket.rate;
      result.push({
        amount: incomeInBracket,
        rate: bracket.rate,
        tax: tax,
      });
      total += tax;
    }
  }

  return { brackets: result, total };
}

// Display regular income tax breakdown
function displayRegularIncomeTaxes(taxes: { brackets: Array<{ amount: number; rate: number; tax: number }>; total: number }): void {
  const container = document.getElementById('regular-income-taxes') as HTMLElement;
  container.innerHTML = '';

  if (taxes.brackets.length === 0) {
    container.innerHTML = '<div class="tax-line">$0 @ 0% = $0</div>';
  } else {
    for (const bracket of taxes.brackets) {
      const line = document.createElement('div');
      line.className = 'tax-line';
      line.textContent = `$${Math.round(bracket.amount).toLocaleString()} @ ${(bracket.rate * 100).toFixed(0)}% = $${Math.round(bracket.tax).toLocaleString()}`;
      container.appendChild(line);
    }
  }
}

// Display LTCG tax breakdown
function displayLTCGTaxes(taxes: { brackets: Array<{ amount: number; rate: number; tax: number }>; total: number }): void {
  const container = document.getElementById('capital-gains-taxes') as HTMLElement;
  container.innerHTML = '';

  if (taxes.brackets.length === 0) {
    container.innerHTML = '<div class="tax-line">$0 @ 0% = $0</div>';
  } else {
    for (const bracket of taxes.brackets) {
      const line = document.createElement('div');
      line.className = 'tax-line';
      line.textContent = `$${Math.round(bracket.amount).toLocaleString()} @ ${(bracket.rate * 100).toFixed(0)}% = $${Math.round(bracket.tax).toLocaleString()}`;
      container.appendChild(line);
    }
  }
}

// Handle thumb dragging
function setupThumbDragging(): void {
  let isDragging = false;
  let currentThumb: 'regular' | 'ltcg' | null = null;

  const startDrag = (thumb: 'regular' | 'ltcg', event: MouseEvent): void => {
    isDragging = true;
    currentThumb = thumb;
    event.preventDefault();
  };

  const onMouseMove = (event: MouseEvent): void => {
    if (!isDragging || !currentThumb) return;

    const rect = incomeBarTrack.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const income = percentToIncome(percent);

    if (currentThumb === 'regular') {
      regularIncome = income;
    } else if (currentThumb === 'ltcg') {
      // LTCG thumb controls total income, so LTCG = total - regular
      const totalIncome = income;
      ltcgIncome = Math.max(0, totalIncome - regularIncome);
    }

    updateDisplay();
  };

  const stopDrag = (): void => {
    isDragging = false;
    currentThumb = null;
  };

  regularThumb.addEventListener('mousedown', (e) => startDrag('regular', e));
  ltcgThumb.addEventListener('mousedown', (e) => startDrag('ltcg', e));
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', stopDrag);
}

// Handle input field changes
function setupInputHandlers(): void {
  regularIncomeInput.addEventListener('input', () => {
    regularIncome = Math.max(0, parseInt(regularIncomeInput.value) || 0);
    updateDisplay();
  });

  ltcgInput.addEventListener('input', () => {
    ltcgIncome = Math.max(0, parseInt(ltcgInput.value) || 0);
    updateDisplay();
  });
}

// Initialize the calculator
function init(): void {
  loadTaxData();
  setupThumbDragging();
  setupInputHandlers();
  updateDisplay();
}

// Start the application
init();
