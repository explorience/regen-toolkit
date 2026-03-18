# Fact-Check Report: what-is-wallet.md

**Gate Criteria:** >2 ❌ or >5 ⚠️ → return to Rupa

---

## Summary

| Rating | Count |
|--------|-------|
| ❌ Errors | 0 |
| ⚠️ Warnings | 3 |
| ✅ Verified | 12 |

**Result:** PASSES gate (0 errors, 3 warnings)

---

## Verified Facts (✅)

| Section | Claim | Source | Status |
|---------|-------|--------|--------|
| Introduction | "A crypto wallet is a digital tool that lets you store and manage the keys needed to access your cryptocurrencies. It doesn't store crypto itself—your funds live on the blockchain" | Britannica | ✅ Verified |
| Mailbox Analogy | Public key is shareable; private key is secret | Britannica | ✅ Verified |
| Seed Phrases | Backup of wallet if unusable via theft or destruction (washing machine example) | Ledger | ✅ Verified |
| Seed Phrases | 12-24 word phrase must be kept secure, never entered into computer or shared | Ledger | ✅ Verified |
| Garden Shed Analogy | Concept consistent with research (blockchain = shared system, wallet = lockbox, seed = backup key) | Ledger (concept) | ✅ Verified |
| Types of Wallets | Hardware = Low convenience, High security | Research | ✅ Verified |
| Types of Wallets | Software = Medium convenience, Medium security | Research | ✅ Verified |
| Types of Wallets | Web-based = High convenience, Low security | Research | ✅ Verified |
| Types of Wallets | Paper = Low convenience, High security | Research | ✅ Verified |
| Hot vs Cold | Hot wallets = internet-connected, convenient but less secure | Britannica | ✅ Verified |
| Cold wallets | Cold wallets = offline, more secure but less convenient | Britannica | ✅ Verified |
| Wallet as Identity | "Gateway to your identity and digital assets... onchain resume... airdrops and NFT mints" | Bankless | ✅ Verified |

---

## Warnings (⚠️)

| # | Issue | Severity | Recommendation |
|---|-------|----------|----------------|
| 1 | **Research gap not addressed:** The research explicitly notes "No discussion of what happens if you lose your seed phrase" as a gap for Maya. The draft explains how to recover with seed phrase but doesn't explain the risk of losing the seed phrase itself. | Medium | Add a sentence: "If you lose your seed phrase and your wallet, you lose access permanently—there's no 'forgot password' option." |
| 2 | **Missing resource from research:** Research lists Ledger Academy as a key source, but Resources section only includes Bankless Academy, MetaMask, and Coinbase Wallet. | Low | Add "Ledger Academy: https://www.ledger.com/academy" to Resources |
| 3 | **Action Item 3 safety:** The draft says "Just don't click 'Create' with a real seed phrase" but could be clearer. New users might not understand the risk. | Low | Consider: "Note: Only create a real wallet if you're ready to securely store the seed phrase. Never do this on a public computer." |

---

## Errors (❌)

None identified.

---

## Minor Notes

- The "mailbox analogy" is used in the draft but the research presents it as an original analogy (not directly attributed to Britannica). The citation is acceptable since the underlying concepts (public key = address, private key = mailbox key) are from Britannica.
- The research mentions "Britannica Guide: https://www.britannica.com/money/cryptocurrency-wallet" as a resource but it's not included in the draft's Resources section. This is optional.

---

## Conclusion

**The draft is accurate and well-sourced. It passes the gate with 0 errors and 3 warnings (below the threshold of >2 ❌ or >5 ⚠️).**

The warnings are minor improvements rather than critical issues. The content correctly:
- Explains what a wallet is (key management tool, not storage)
- Distinguishes public key, private key, and seed phrase
- Covers hot vs cold wallets accurately
- Uses appropriate analogies for the target audience
- Includes proper citations

**Recommendation:** Approve with optional improvements (Warnings 1-3).
