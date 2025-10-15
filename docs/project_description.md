# Project description

## Development

All development experiences are implemented as mise tasks.

### Prerequisites
- [mise](https://mise.jdx.dev/) must be installed

### Running the Project
```bash
./run
```

This will compile as needed and open `index.html` directly in your browser. No dev server required.

### Build and Test
```bash
./build_and_test
```

This compiles as needed and runs any tests, including linting/static analysis.

## Technologies

Single-page static HTML/CSS/TypeScript app with no backend.
- Vanilla TypeScript (no frameworks)
- TypeScript compiled to JavaScript using tsc
- All tax data embedded directly in the TypeScript file
- Opens directly in browser without requiring a dev server
- Data resets each session (no persistence)

## UI Layout

### Typical example: 
```
┌─────────────────────────────────────────────────────────────────┐
│                     Retirement Tax Calculator                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filing Status: [Married Filing Jointly ▼]                      │
│      Standard Deducation: $25,900                               │
│                                                                 │
│                   10%      12%      20%     22%    30%                     │  # income tax brackets
│                                              15%                │  # LTCG (Long-Term Capital Gains) tax brackets
│         S.D       │         |                                   │  # standard deduction
│          ▼        │         |                                   │
│  ├──Regular Income───────│─────────── LTCG ──────────┤          │
│                                   Total income: $60,000         │
│                                                                 │
│  Regular income: [ $50,000 ]                                    │
│  LTCG: [ $10,000 ]                                              │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                           Taxes                                 │
│                                                                 │
│  Regular Income:                                                │
│    $xxx @ 10% = $yyy                                            │
│    $xxx @ 12% = $yyy                                            │
│    $xxx @ 20% = $yyy                                            │
│                                                                 │
│  Capital Gains:                                                 │
│    $xxx @  0% = $yyy                                            │
│    $xxx @ 15% = $yyy                                            │
│                                                                 │
│  Total taxes: $xxx                                              │
└─────────────────────────────────────────────────────────────────┘
```

### "zero" example:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Retirement Tax Calculator                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filing Status: [Married Filing Jointly ▼]                      │
│      Standard Deducation: $25,900                               │
│                                                                 │
│                   10%      12%      20%     22%    24%           │  # income tax brackets
│                                              15%                │  # LTCG (Long-Term Capital Gains) tax brackets
│         S.D       │         |                                   │  # standard deduction
│          ▼        │         |                                   │
│  ││                                                             │
│                                   Total income: $0              │
│                                                                 │
│  Regular income: [ $0 ]                                         │
│  LTCG: [ $0 ]                                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                           Taxes                                 │
│                                                                 │
│  Regular Income:                                                │
│    $xxx @ 10% = $yyy                                            │
│    $xxx @ 12% = $yyy                                            │
│    $xxx @ 20% = $yyy                                            │
│                                                                 │
│  Capital Gains:                                                 │
│    $xxx @  0% = $yyy                                            │
│    $xxx @ 15% = $yyy                                            │
│                                                                 │
│  Total taxes: $xxx                                              │
└─────────────────────────────────────────────────────────────────┘
```



## Behavior

the user can slide the regular income left-right slider to change the amount of regular income

the user can slide the LTCG left-right slider to change the amount of Long-term capital gains

the LTCG slider "stacks" on top of the regular income slider, so the total income is the sum of the regular income and the LTCG

The standard deduction and tax brackets are set by the filing status

the tax values update in real time as the sliders are moved

the total taxes are the sum of the regular income taxes and the LTCG taxes
