#!/bin/bash
# Update frontmatter of overnight batch articles to match regen-toolkit format

cd "/root/Zettelkasten/03 Libraries/regen-toolkit"

# Article 1: coordination-transparency.md (issue: 75)
cat > /tmp/fm1.txt << 'EOF'
---
title: "Coordination and Transparency"
section: "1.1"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "B"
    name: Greenpill Local Regen Guide
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 820
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 75
assignees:
  - explorience
---
EOF

# Get content without frontmatter
sed '/^---$/,/^---$/d' content/1-foundations/1.1-why-web3/coordination-transparency.md > /tmp/content1.md
cat /tmp/fm1.txt /tmp/content1.md > content/1-foundations/1.1-why-web3/coordination-transparency.md

# Article 2: common-concerns.md (issue: 74)
cat > /tmp/fm2.txt << 'EOF'
---
title: "Common Concerns"
section: "1.1"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "B"
    name: Greenpill Local Regen Guide
  - code: "C"
    name: CryptoAltruists Web3 Impact Toolkit
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 810
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 74
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.1-why-web3/common-concerns.md > /tmp/content2.md
cat /tmp/fm2.txt /tmp/content2.md > content/1-foundations/1.1-why-web3/common-concerns.md

# Article 3: what-web3-can-cant-do.md (issue: 78)
cat > /tmp/fm3.txt << 'EOF'
---
title: "What Web3 Can and Can't Do"
section: "1.1"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "B"
    name: Greenpill Local Regen Guide
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 795
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 78
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.1-why-web3/what-web3-can-cant-do.md > /tmp/content3.md
cat /tmp/fm3.txt /tmp/content3.md > content/1-foundations/1.1-why-web3/what-web3-can-cant-do.md

# Article 4: relates-to-existing-work.md (issue: 76)
cat > /tmp/fm4.txt << 'EOF'
---
title: "Relates to Existing Work"
section: "1.1"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "A"
    name: ReFi DAO Local ReFi Toolkit
  - code: "B"
    name: Greenpill Local Regen Guide
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 830
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 76
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.1-why-web3/relates-to-existing-work.md > /tmp/content4.md
cat /tmp/fm4.txt /tmp/content4.md > content/1-foundations/1.1-why-web3/relates-to-existing-work.md

# Article 5: stories-regens-leap.md (issue: 77)
cat > /tmp/fm5.txt << 'EOF'
---
title: "Stories: Regens Who Made the Leap"
section: "1.1"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "O"
    name: Reimagining Power Case Studies
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 815
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 77
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.1-why-web3/stories-regens-leap.md > /tmp/content5.md
cat /tmp/fm5.txt /tmp/content5.md > content/1-foundations/1.1-why-web3/stories-regens-leap.md

# Article 6: what-is-decentralization.md (issue: 92)
cat > /tmp/fm6.txt << 'EOF'
---
title: "What is Decentralization?"
section: "1.2"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "B"
    name: Greenpill Local Regen Guide
  - code: "D"
    name: Bankless Academy
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 805
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 92
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.2-decentralization/what-is-decentralization.md > /tmp/content6.md
cat /tmp/fm6.txt /tmp/content6.md > content/1-foundations/1.2-decentralization/what-is-decentralization.md

# Article 7: trust-transparency.md (issue: 91)
cat > /tmp/fm7.txt << 'EOF'
---
title: "Trust and Transparency"
section: "1.2"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "B"
    name: Greenpill Local Regen Guide
  - code: "E"
    name: SuperBenefit Knowledge Garden
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 800
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 91
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.2-decentralization/trust-transparency.md > /tmp/content7.md
cat /tmp/fm7.txt /tmp/content7.md > content/1-foundations/1.2-decentralization/trust-transparency.md

# Article 8: what-is-wallet.md (issue: 114)
cat > /tmp/fm8.txt << 'EOF'
---
title: "What is a Wallet?"
section: "1.5"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "G"
    name: Foundation Getting Started in Web3
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 785
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 114
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.5-wallets-security/what-is-wallet.md > /tmp/content8.md
cat /tmp/fm8.txt /tmp/content8.md > content/1-foundations/1.5-wallets-security/what-is-wallet.md

# Article 9: setting-up-first-wallet.md (issue: 113)
cat > /tmp/fm9.txt << 'EOF'
---
title: "Setting Up Your First Wallet"
section: "1.5"
track: 1
status: draft
author: regen-toolkit-builder
sources:
  - code: "G"
    name: Foundation Getting Started in Web3
  - code: "A"
    name: ReFi DAO Local ReFi Toolkit
  - code: "NEW"
    name: Original analysis
audience:
  - grounded-regen
estimated_words: 815
created: 2026-01-15
updated: 2026-02-12
priority: tier-1
critical_paths:
  - forest-city
  - huron-university
issue: 113
assignees:
  - explorience
---
EOF

sed '/^---$/,/^---$/d' content/1-foundations/1.5-wallets-security/setting-up-first-wallet.md > /tmp/content9.md
cat /tmp/fm9.txt /tmp/content9.md > content/1-foundations/1.5-wallets-security/setting-up-first-wallet.md

echo "Frontmatter updated for all 9 articles"
