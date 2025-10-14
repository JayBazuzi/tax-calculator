# Project description

## Development

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

```
┌─────────────────────────────────────────────────────────────────┐
│                     Retirement Tax Calculator                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filing Status: [Married Filing Jointly ▼]                      │
│                                                                 │
│                   10%      12%      20%                         │  # income tax brackets
│                                              15%                │  # LTCG (Long-Term Capital Gains) tax brackets
│         S.D       │                                             │  # standard deduction
│          ▼        │                                             │
│  ├──Regular Income───────│─────────── LTCG ──────────┤          │
│                                   Total income: $100,000        │
│
│  Regular income: [ $xxx ]                                                │
│  LTCG: [ $xxx ]                                                        │
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

The standard deduction and tax brackets are set by the filing status

the tax values update in real time as the sliders are moved

the total taxes are the sum of the regular income taxes and the LTCG taxes
