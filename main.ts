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

// State
let regularIncome = 0;
let ltcgIncome = 0;
let taxData: TaxData;
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
async function loadTaxData(): Promise<void> {
  const response = await fetch('tax-data.json');
  taxData = await response.json();
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
async function init(): Promise<void> {
  await loadTaxData();
  setupThumbDragging();
  setupInputHandlers();
  updateDisplay();
}

// Start the application
init();
