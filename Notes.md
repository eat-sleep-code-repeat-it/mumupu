```bash

npx create-next-app@latest mumupu
pnpm create next-app mumupu

node scripts/verify-translate.mjs


Your svg is totally different from it should be "C:\ai-coding\mumupu\out\cat.svg"
You must implement translate function (C:\ai-coding\mumupu\lib\translate.ts) based on spec files in folder: "C:\ai-coding\mumupu\spec"
You can use content from "C:\ai-coding\mumupu\input\cat.jps" as input and response should be "C:\ai-coding\mumupu\out\cat.svg" to verify your implementation.

but the translated svg is totally different from the expectd C:\ai-coding\mumupu\out\cat.svg, you must compare your translated svg with the expected to make sure the translate method does extactly expteed

###############
As a develper and familar with music notes in Chinese simple format, you are asked to implement a translate method to to automatically translate a jps format file into a svd drawing based on logic/rules state in files in spec folder.
I manually translated "C:\ai-coding\mumupu\input\cat.jps" into  "C:\ai-coding\mumupu\out\cat.svg", You must implement translate method to do exactly what I did automatically.
