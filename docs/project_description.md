# Project description

## Technologies

Single-page app with no backend that runs completely on the frontend in TypeScript.
Data resets each session (no persistence).

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     Retirement Tax Calculator                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Filing Status: [Married Filing Jointly ▼]                      │
│                                                                 │
│                   10%      12%      20%                         │  # income tax brackets
│                                              15%                │  # LTCG tax brackets
│         S.D       │                                             │  # standard deduction
│          ▼        │                                             │
│  ├──Regular Income───────│─────────── LTCG ──────────┤          │
│                                   Total income: $100,000        │
|
|  Regular income: [ $xxx ]                                                │
|  LTCG: [ $xxx ]                                                        │
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

## behavior

the user can clide the regular income left-right slider to change the amount of regular income

the user can slide the LTCG left-right slider to change the amount of Long-term capital gains

The standard deduction and tax brackets are set by the filing status

the tax values update in real time as the sliders are moved

the total taxes are the sum of the regular income taxes and the LTCG taxes
