# Token Standards Research: ERC-20, ERC-721, ERC-1155

## Overview

Token standards are technical specifications that define how tokens function on the Ethereum blockchain. They ensure interoperability between different tokens and smart contracts, allowing developers to build applications that work with any compliant token.

---

## ERC-20: Fungible Token Standard

### What is ERC-20?
ERC-20 (Ethereum Request for Comments 20) is a technical standard for creating fungible tokens on the Ethereum blockchain. Proposed by developer Fabian Vogelsteller in November 2015, it is the most widely used token standard in the Ethereum ecosystem.

### Key Characteristics
- **Fungible**: Each token is identical in type and value to any other token. 1 ERC-20 token equals 1 other ERC-20 token of the same contract.
- **Interoperable**: Enables tokens to be compatible with wallets, exchanges, and other smart contracts
- **Standardized API**: Provides a common interface for token operations

### Required Functions
1. `name()` - Returns the token's name
2. `symbol()` - Returns the token's symbol (e.g., "ETH", "DAI")
3. `decimals()` - Returns the number of decimal places (typically 18)
4. `totalSupply()` - Returns the total number of tokens in circulation
5. `balanceOf(address _owner)` - Returns the token balance of a specific address
6. `transfer(address _to, uint256 _value)` - Transfers tokens from sender to recipient
7. `transferFrom(address _from, address _to, uint256 _value)` - Transfers tokens on behalf of another address
8. `approve(address _spender, uint256 _value)` - Allows a third party to spend a specific amount
9. `allowance(address _owner, address _spender)` - Returns the amount a spender can transfer

### Events
- `Transfer` - Emitted when tokens are transferred
- `Approval` - Emitted when approval is granted

### Known Issue: Token Reception
As of June 2024, over $83 million in ERC-20 tokens have been lost due to tokens being sent to contracts that cannot handle them. The standard lacks a mandatory function for receiving contracts to implement, meaning tokens sent to incompatible contracts may become permanently stuck.

---

## ERC-721: Non-Fungible Token (NFT) Standard

### What is ERC-721?
ERC-721 (Ethereum Request for Comments 721) is a standard for non-fungible tokens (NFTs). Proposed by William Entriken, Dieter Shirley, Jacob Evans, and Nastassia Sachs in January 2018, it defines a framework for creating unique, distinguishable digital assets.

### Key Characteristics
- **Non-Fungible**: Each token is unique and cannot be exchanged 1:1 with another
- **Unique Identification**: Each NFT is identified by a unique `uint256` tokenId within its smart contract
- **Variable Value**: NFTs from the same contract can have different values based on age, rarity, or attributes

### Required Functions
1. `balanceOf(address _owner)` - Returns the number of NFTs owned by an address
2. `ownerOf(uint256 _tokenId)` - Returns the owner of a specific NFT
3. `safeTransferFrom(address _from, address _to, uint256 _tokenId)` - Safely transfers NFT (with data validation)
4. `transferFrom(address _from, address _to, uint256 _tokenId)` - Transfers NFT (basic)
5. `approve(address _approved, uint256 _tokenId)` - Approves a specific address to transfer an NFT
6. `setApprovalForAll(address _operator, bool _approved)` - Approves an operator to manage all NFTs
7. `getApproved(uint256 _tokenId)` - Returns the approved address for an NFT
8. `isApprovedForAll(address _owner, address _operator)` - Checks if an operator is approved for all NFTs

### Events
- `Transfer` - Emitted when NFT ownership changes
- `Approval` - Emitted when NFT approval is granted
- `ApprovalForAll` - Emitted when operator approval changes

### Common Use Cases
- Digital art and collectibles
- Gaming assets (weapons, characters, items)
- Domain names
- Event tickets
- Ownership certificates
- Access keys and credentials

---

## ERC-1155: Multi-Token Standard

### What is ERC-1155?
ERC-1155 is a multi-token standard that allows a single smart contract to manage multiple token types—both fungible and non-fungible. Proposed by Enjin and adopted by the Ethereum Foundation in June 2018, it aims to improve efficiency over separate ERC-20 and ERC-721 implementations.

### Key Characteristics
- **Multi-Token**: Single contract manages multiple token types (fungible, non-fungible, or semi-fungible)
- **Efficient**: Reduces gas costs by handling multiple token types in one contract
- **Batch Operations**: Supports batch transfers and balance queries
- **Flexible**: Can emulate ERC-20 (supply > 1) and ERC-721 (supply = 1)

### Key Functions
1. `safeBatchTransferFrom()` - Transfers multiple token types in one transaction
2. `balanceOfBatch()` - Queries multiple balances in a single call
3. `setApprovalForAll()` - Approves an operator for all token types
4. `onERC1155BatchReceived()` - Hook for receiving tokens safely

### Advantages Over Separate Standards
- **Gas Efficiency**: Single deployment for multiple token types
- **Reduced Complexity**: One contract instead of multiple
- **Batch Operations**: Transfer multiple assets in one transaction
- **Flexibility**: Can create semi-fungible tokens (e.g., concert tickets that become collectibles after the event)

---

## Comparison Table

| Feature | ERC-20 | ERC-721 | ERC-1155 |
|---------|--------|---------|----------|
| Token Type | Fungible | Non-Fungible | Both |
| Unique ID | No | Yes (tokenId) | Yes (per token type) |
| Use Case | Currencies, governance tokens | Digital art, collectibles | Gaming, mixed assets |
| Batch Transfer | No | No | Yes |
| Gas Efficiency | Standard | Higher per NFT | Most efficient |
| Standard Finalized | 2015 | 2018 | 2018 |

---

## Sources

- Ethereum.org Developer Documentation
- EIP-20: ERC-20 Token Standard
- EIP-721: Non-Fungible Token Standard
- EIP-1155: Multi Token Standard
- Binance Academy
- Ledger Academy

---

*Research compiled for Maya | Regen Toolkit*
