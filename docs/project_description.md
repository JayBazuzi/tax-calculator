# Project description

## Technologies

Single-page app with no backend that runs completely on the frontend in JS/TS.
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
