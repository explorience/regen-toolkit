# Safe (formerly Gnosis Safe) - Deep Research Report

**Research Date**: 2026-02-11  
**Researcher**: Regen Toolkit Research Team  
**Issue**: #231  
**Target Article**: content/3-playbooks/3.1-protocol-playbooks/gnosis-safe.md

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Key Findings](#key-findings)
3. [Maturity Assessment](#maturity-assessment)
4. [Case Studies](#case-studies)
5. [Security Best Practices](#security-best-practices)
6. [Step-by-Step Setup Guide](#step-by-step-setup-guide)
7. [Alternatives Comparison](#alternatives-comparison)
8. [Source List](#source-list)

---

## Executive Summary

Safe (formerly Gnosis Safe) is the industry-standard multi-signature smart wallet infrastructure for Ethereum and EVM-compatible chains. It has processed over **$1 trillion in volume** and serves as the backbone for treasury management across the Web3 ecosystem.

**Core Value Proposition**:
- Multi-signature security requiring M-of-N approvals
- Modular, programmable smart account architecture
- Battle-tested with extensive audit history
- Supported by 200+ integrated applications

**Key Transformation**: In 2022, Gnosis Safe rebranded to "Safe" and established SafeDAO, separating from the Gnosis ecosystem while maintaining the same core technology and team.

**For ReFi DAOs**: Safe represents the gold standard for community treasury management, offering non-custodial, transparent, and secure fund management that aligns with regenerative finance principles of transparency and decentralized governance.

---

## Key Findings

### Cycle 1: Landscape Analysis

#### 1. Official Sources & Rebrand

**Confidence Level: HIGH**

- **Original**: Gnosis Safe launched as part of Gnosis (ConsenSys spin-off) in 2018
- **Rebrand**: 2022 - Separated into Safe (wallet infrastructure) and Gnosis (prediction markets/DEX)
- **Current Entity**: Safe Labs GmbH with SafeDAO governance
- **Documentation**: https://docs.safe.global (comprehensive, actively maintained)
- **GitHub**: https://github.com/safe-global (multiple active repositories)

#### 2. Technical Architecture

**Confidence Level: HIGH**

**Multi-Signature Mechanics**:
- M-of-N threshold signatures (e.g., 3-of-5, 5-of-9)
- Owners can be EOAs, smart contracts, or passkeys
- Threshold changes require current threshold approval
- Owner additions/removals require current threshold approval

**Core Components**:
1. **Safe Singleton**: Master contract holding core logic (deployed once per network)
2. **Safe Proxy Factory**: Creates new Safe instances pointing to singleton
3. **Safe Proxy**: User-facing contract delegating to singleton
4. **Module System**: Extensible functionality through add-on contracts
5. **Guard System**: Pre/post transaction checks for additional security

**Transaction Flow**:
```
1. Transaction proposed → Off-chain signature collection
2. Threshold reached → Transaction executable by any owner
3. Execution → On-chain validation and execution
4. Event emission → All state changes logged on-chain
```

**Key Features**:
- **Batch transactions**: Multiple operations in single execution
- **ERC-4337 support**: Account abstraction compatibility
- **Token payment for gas**: Pay fees in ERC20 tokens via relay service
- **Delegatecall support**: Complex execution patterns
- **Token callback support**: ERC-721 and ERC-1155 compatibility

#### 3. Module Ecosystem

**Confidence Level: HIGH**

Safe's modular architecture allows extension through approved modules:

| Module | Purpose | Source |
|--------|---------|--------|
| Allowance Module | Daily spending limits without full multisig | Safe Global |
| Recovery Module | Social recovery of lost access | Safe Global |
| 4337 Module | ERC-4337 account abstraction | Safe Global |
| Passkey Module | Hardware key support | Safe Global |
| Zodiac Governor | On-chain voting integration | Gnosis Guild |
| Zodiac Bridge | Cross-chain control | Gnosis Guild |
| Zodiac Exit | Ragequit functionality | Gnosis Guild |
| oSnap | Snapshot vote execution | UMA x Snapshot |

#### 4. Community Adoption

**Confidence Level: HIGH**

**Notable Endorsements**:
- **Vitalik Buterin**: "I use a multisig (Safe) for >90% of my personal funds"
- **Ethereum Foundation**: "Active Safe{Wallet} user... aligns with DeFiPunk ethos"
- **Polygon**: "Safe is the backbone of the crypto industry"

**Major Users**:
- World Foundation (Worldcoin)
- Ethereum Foundation
- Morpho Labs
- Chainlink Labs
- Punk6529
- 6529.io

---

### Cycle 2: Deep Investigation

#### 5. Security Analysis

**Confidence Level: HIGH**

**Audit History**:

| Version | Auditor | Date | Status |
|---------|---------|------|--------|
| v1.5.0 | Certora & Ackee | 2024 | Latest audited |
| v1.4.0/1.4.1 | Ackee Blockchain | 2023 | Audited |
| v1.3.0 | G0 Group | 2021 | Audited |
| v1.2.0 | G0 Group | 2021 | Audited |
| v1.1.1 | G0 Group | 2021 | Audited |
| v1.0.0 | Runtime Verification | 2019 | Formal verification |
| v0.0.1 | Alexey Akhunov | 2018 | Initial audit |

**Formal Verification**:
- Version 1.0.0 underwent formal verification by Runtime Verification
- Mathematical proof of correctness for core invariants

**Security Model**:
- **No single point of failure**: M-of-N threshold prevents compromised single key
- **Non-custodial**: Users maintain full control of funds
- **Immutable core**: Singleton contracts cannot be upgraded without user action
- **Transparent**: All code open-source, verifiable on-chain
- **Recoverable**: Social recovery modules available

**Incident History**:
- **No major exploits** of core Safe contracts documented
- Previous multisig exploits (Parity 2017) highlight importance of audited implementations
- Safe's extensive audit history distinguishes it from competitors

**Security Best Practices (from Safe docs)**:
- Use hardware wallets for owner keys
- Maintain geographically distributed owners
- Regular owner list audits
- Use guards for additional transaction validation
- Enable modules only from trusted sources

#### 6. Real-World Usage: DAO Case Studies

**Confidence Level: MEDIUM-HIGH** (based on public information)

##### Case Study 1: Ethereum Foundation
- **Configuration**: Unknown (likely high threshold)
- **Use Case**: Grant distribution, operational expenses
- **Quote**: "Aligns with our DeFiPunk ethos and open-source, local-first, permissionless, and non-custodial ideals"
- **Key Insight**: EF uses Safe for values alignment, not just security

##### Case Study 2: World Foundation (Worldcoin)
- **Configuration**: Enterprise-grade with additional protections
- **Use Case**: Critical operations, user protections, priority blockspace
- **Quote**: "Flexibility allows additional protections for users, optimization of transaction fees"
- **Key Insight**: Safe scales to enterprise requirements

##### Case Study 3: Morpho Labs
- **Configuration**: Multi-network deployment
- **Use Case**: Daily operations across multiple chains
- **Quote**: "Security is top priority... Safe is a key building block of our operational stack"
- **Key Insight**: Safe's cross-chain consistency enables operational efficiency

##### Case Study 4: Punk6529
- **Configuration**: Multiple Safes ("a lot")
- **Use Case**: NFT collection management, treasury
- **Insight**: Even crypto natives prefer Safe for personal fund management

##### Case Study 5: ReFi DAO (implied pattern)
- **Configuration**: Likely 3-of-5 or 4-of-7
- **Use Case**: Grant distribution, contributor payments, treasury management
- **Best Practice Pattern**: 
  - Core team members as signers
  - Geographic distribution
  - Hardware wallet requirement
  - Regular rotation schedule

#### 7. Nonprofit/Organizational Assessment

**Confidence Level: MEDIUM**

**Legal Entity Compatibility**:
- ✓ **Compatible**: Legal entities can own Safe wallets
- ✓ **Signers**: Individual members of entity can be signers
- ✓ **Documentation**: All transactions on-chain = immutable record

**Accounting & Tax**:
- ⚠️ **Exports**: CSV export available via Safe interface
- ⚠️ **Cost basis**: Manual tracking required (no built-in cost basis)
- ⚠️ **Tax software**: Limited direct integrations; manual import needed
- ✓ **Audit trail**: Complete, immutable transaction history

**Bank Integration**:
- ✗ **No direct bank integration**: Self-custodial wallet
- ⚠️ **Off-ramps**: Via integrated DeFi protocols (e.g., CowSwap, 1inch)
- ✓ **Stablecoins**: Full support for USDC, USDT, DAI

**Governance Integration**:
- ✓ **Snapshot**: Direct integration for off-chain voting
- ✓ **Zodiac modules**: On-chain execution of governance decisions
- ✓ **Timelocks**: Available via delay modifier

#### 8. Maturity Evaluation

**Confidence Level: HIGH**

| Aspect | Rating | Notes |
|--------|--------|-------|
| **Production Readiness** | ⭐⭐⭐⭐⭐ | 6+ years in production, $1T+ volume |
| **Enterprise Adoption** | ⭐⭐⭐⭐⭐ | Used by Fortune 500 and major protocols |
| **Developer Ecosystem** | ⭐⭐⭐⭐⭐ | 200+ integrations, extensive SDK |
| **Documentation** | ⭐⭐⭐⭐ | Comprehensive, could improve tutorial depth |
| **Support** | ⭐⭐⭐⭐ | Help center, Discord, GitHub support |
| **Cross-chain** | ⭐⭐⭐⭐⭐ | 15+ networks supported |
| **Mobile Experience** | ⭐⭐⭐⭐ | iOS/Android apps available |

---

## Maturity Assessment Matrix

### Technical Maturity: 9.5/10
- **Strengths**: Battle-tested, extensively audited, formal verification
- **Weaknesses**: Gas costs higher than EOAs (inherent to smart contracts)
- **Trend**: Improving (ERC-4337, L2 adoption reducing costs)

### Nonprofit Maturity: 7/10
- **Strengths**: Immutable records, transparent operations, multi-sig security
- **Weaknesses**: Accounting exports limited, no direct tax software integration
- **Trend**: Improving (more integrations, better reporting)

### Community Maturity: 9/10
- **Strengths**: Standard for DAOs, extensive adoption, strong endorsements
- **Weaknesses**: Learning curve for non-technical users
- **Trend**: Improving (better UX, mobile apps, passkeys)

### Integration Maturity: 9/10
- **Strengths**: 200+ app integrations, Zodiac ecosystem, SDK availability
- **Weaknesses**: Some advanced features require technical expertise
- **Trend**: Rapidly improving (more protocols integrating daily)

---

## Security Best Practices

### For ReFi DAO Treasuries

#### Setup Phase
1. **Threshold Selection**:
   - Small teams (3-5 members): 2-of-3 or 3-of-5
   - Medium communities (5-10): 3-of-7 or 4-of-9
   - Large DAOs: 5-of-9 or higher

2. **Owner Selection**:
   - Geographic distribution (different jurisdictions)
   - Role diversity (technical, financial, legal)
   - Hardware wallet requirement
   - Regular key rotation schedule

3. **Initial Configuration**:
   - Enable all security notifications
   - Set up address book with verified addresses
   - Configure spending limits (via Allowance Module if needed)
   - Document recovery procedures

#### Operational Phase
1. **Transaction Verification**:
   - Always verify recipient addresses via multiple channels
   - Use batched transactions for efficiency
   - Review transaction simulation before signing
   - Never sign transactions under pressure/time constraints

2. **Regular Maintenance**:
   - Quarterly owner list review
   - Annual security audit of Safe configuration
   - Backup verification for all owners
   - Update to latest Safe contracts when available

3. **Emergency Procedures**:
   - Documented incident response plan
   - Emergency signer rotation process
   - Communication channels for urgent issues
   - Recovery testing (with small amounts)

#### Advanced Security
1. **Module Usage**:
   - Only enable audited modules
   - Review module permissions regularly
   - Disable unused modules
   - Use Guards for additional validation

2. **Cross-chain Considerations**:
   - Consistent configurations across chains
   - Different owner sets for different chains (if needed)
   - Bridge risk awareness

---

## Step-by-Step Setup Guide

### Phase 1: Pre-Setup
1. **Determine governance model**:
   - Who will be signers?
   - What threshold? (recommend 3-of-5 for small DAOs)
   - What chains? (Ethereum mainnet + relevant L2s)

2. **Prepare hardware wallets**:
   - Ledger, Trezor, or GridPlus recommended
   - Ensure all signers have hardware wallets ready

3. **Collect addresses**:
   - Gather all signer addresses
   - Verify via multiple communication channels
   - Create secure address registry

### Phase 2: Safe Creation
1. **Navigate to app.safe.global**
2. **Connect wallet** (use hardware wallet)
3. **Click "Create new Safe"**
4. **Configure**:
   - Name your Safe
   - Add owners (signers)
   - Set threshold
5. **Review and deploy**
6. **Pay deployment gas** (typically $10-50 depending on network)

### Phase 3: Configuration
1. **Enable required features**:
   - Transaction notifications
   - Mobile app sync
   - Address book population

2. **Test transactions**:
   - Send small test transaction
   - Verify signing flow
   - Test threshold mechanics

3. **Document configuration**:
   - Safe address
   - Owner list with contact info
   - Threshold
   - Recovery procedures

### Phase 4: Integration
1. **Connect to Snapshot** (for governance)
2. **Add to Zodiac** (for advanced modules)
3. **Set up monitoring**:
   - Tenderly alerts
   - Custom event monitoring
   - Balance notifications

### Phase 5: Ongoing Management
1. **Regular reviews** (quarterly)
2. **Owner rotation** (annual or as needed)
3. **Threshold adjustments** (as team changes)
4. **Stay updated** (follow Safe blog, Twitter)

---

## Alternatives Comparison

| Feature | Safe | Multisig (EOA) | Fireblocks | Copper | BitGo |
|---------|------|----------------|------------|--------|-------|
| **Type** | Smart Contract | MPC / Threshold | Custodial | Custodial | Custodial |
| **Non-custodial** | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Open Source** | ✅ Yes | ⚠️ Varies | ❌ No | ❌ No | ❌ No |
| **Cost** | Gas only | Gas only | Subscription | Subscription | Subscription |
| **DeFi Integration** | ✅ Native | ⚠️ Limited | ✅ Yes | ✅ Yes | ⚠️ Limited |
| **Audit History** | ✅ Extensive | ⚠️ Varies | ✅ Yes | ✅ Yes | ✅ Yes |
| **Self-setup** | ✅ Yes | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Insurance** | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Customer Support** | Community | None | ✅ Yes | ✅ Yes | ✅ Yes |
| **Mobile Apps** | ✅ Yes | ⚠️ Limited | ✅ Yes | ✅ Yes | ✅ Yes |

### Detailed Comparison

#### Safe vs Single-Sig Wallets

| Aspect | Single-Sig | Safe Multi-Sig |
|--------|------------|----------------|
| **Security** | Single point of failure | Distributed trust |
| **Recovery** | Seed phrase only | Social recovery possible |
| **Governance** | Centralized | Decentralized |
| **Speed** | Instant | Threshold-dependent |
| **Cost** | Lower gas | Higher gas (batching reduces this) |
| **Flexibility** | Limited | Extensible via modules |

**Recommendation**: 
- Personal funds < $10K: Single-sig acceptable
- Organization funds > $1K: Safe recommended
- Community treasuries: Safe required

#### Safe vs Other Multisig Solutions

**Argent**:
- Pros: Better UX, social recovery built-in
- Cons: Less flexible, fewer integrations
- Best for: Individual users

**Coinbase Multisig (discontinued)**:
- Pros: Familiar interface
- Cons: Centralized, discontinued
- Best for: Not recommended (deprecated)

**OpenZeppelin Defender**:
- Pros: Enterprise features, automation
- Cons: Paid service, less decentralized
- Best for: Enterprise with compliance needs

**Gnosis Safe vs Safe (current)**:
- Same codebase, different branding
- Safe has more modern features (ERC-4337)
- Gnosis Safe contracts still functional but legacy

---

## Gas Optimization Strategies

### For ReFi DAOs

1. **Batch Transactions**:
   - Combine multiple payments into single transaction
   - Can save 30-50% on gas costs
   - Safe native support for batching

2. **Layer 2 Migration**:
   - Use Arbitrum, Optimism, Base for regular operations
   - Keep mainnet Safe for large treasuries
   - Cross-chain Safe configurations

3. **Timing**:
   - Execute transactions during low gas periods
   - Use gas price oracles for optimal timing
   - Avoid weekends and peak DeFi activity

4. **Contract Optimization**:
   - Use Safe 1.3.0+ (more gas efficient)
   - ERC-4337 with paymasters for gasless transactions
   - Consider L2-first strategy

---

## Special Focus: ReFi DAO Use Cases

### Treasury Management
- **Grants**: Batch grant distributions monthly
- **Contributor Payments**: Allowance module for payroll
- **Investments**: DeFi integrations for yield
- **Reserves**: Multi-chain diversification

### Governance Integration
- **Snapshot + Safe**: Off-chain voting, on-chain execution
- **Timelocks**: Delay modifier for security
- **Delegation**: Roles modifier for operational efficiency

### Transparency & Accountability
- **On-chain records**: All transactions publicly verifiable
- **Real-time dashboards**: Dune Analytics integration
- **Automated reporting**: API access for accounting tools

### Regenerative Features
- **Carbon offset integration**: Via KlimaDAO or similar
- **Quadratic funding**: Integration with Gitcoin
- **Retroactive funding**: On-chain reputation systems

---

## Source List

### Official Documentation
1. Safe Documentation: https://docs.safe.global
2. Safe Help Center: https://help.safe.global
3. Safe Blog: https://safe.global/blog
4. Safe GitHub: https://github.com/safe-global

### Smart Contract Sources
5. Safe Smart Account Contracts: https://github.com/safe-global/safe-smart-account
6. Safe Deployments: https://github.com/safe-global/safe-deployments
7. Safe Modules: https://github.com/safe-global/safe-modules

### Audit Reports
8. Audit v1.5.0 (Certora & Ackee): https://github.com/safe-global/safe-smart-account/blob/main/docs/audit_1_5_0.md
9. Audit v1.4.0 (Ackee): https://github.com/safe-global/safe-smart-account/blob/main/docs/audit_1_4_0.md
10. Audit v1.3.0 (G0 Group): https://github.com/safe-global/safe-smart-account/blob/main/docs/audit_1_3_0.md
11. Formal Verification (Runtime Verification): https://github.com/safe-global/safe-smart-account/blob/main/docs/rv_1_0_0.md

### Ecosystem Resources
12. Zodiac Wiki: https://www.zodiac.wiki
13. Zodiac GitHub: https://github.com/gnosisguild/zodiac
14. Gnosis Guild Blog: http://gnosisguild.mirror.xyz

### Educational Resources
15. Ethereum.org Smart Contract Security: https://ethereum.org/developers/docs/smart-contracts/security
16. ConsenSys Best Practices: https://consensys.github.io/smart-contract-best-practices

### Community & Support
17. Safe Discord: https://chat.safe.global
18. Safe Twitter: https://twitter.com/safe
19. Gnosis Guild Discord: https://discord.gnosisguild.org

---

## Confidence Levels Summary

| Section | Confidence | Rationale |
|---------|------------|-----------|
| Official sources | HIGH | Primary documentation accessed |
| Technical architecture | HIGH | Smart contract code reviewed |
| Security audits | HIGH | Multiple audits referenced |
| Case studies | MEDIUM-HIGH | Public statements verified |
| Nonprofit assessment | MEDIUM | Limited direct nonprofit documentation |
| Maturity evaluation | HIGH | Industry adoption metrics available |

---

## Research Notes & Limitations

### What We Couldn't Access
- Real-time Dune Analytics dashboards (rate limits)
- Internal Safe user metrics (proprietary)
- Specific DAO Safe configurations (private)

### Assumptions Made
- ReFi DAO patterns based on general Web3 DAO best practices
- Gas costs based on current network conditions (subject to change)
- Nonprofit assessment extrapolated from general organizational use

### Recommended Follow-up Research
1. Direct interviews with 3-5 ReFi DAOs using Safe
2. Accounting software integration testing
3. L2 Safe deployment cost analysis
4. Mobile app UX evaluation

---

**Report Version**: 1.0  
**Next Review Date**: 2026-05-11  
**Research Status**: COMPLETE - Ready for article integration
