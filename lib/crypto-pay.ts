// Crypto certificate payment (international lane).
//
// International students pay the certificate fee in USDT on Ethereum (ERC20).
// They send to the address below, submit a claim (name, email, optional tx
// hash), and the claim lands in the BVN OS Approvals queue as a pending
// `provider: "crypto"` row. Benjamin confirms the transfer in his wallet and
// approves it, which flips the row to paid and emails the certificate PDF.
//
// A receiving address is public information, so it lives here as a constant.
// The whole crypto option only renders when `address` is a real value, so an
// empty string cleanly hides the feature instead of shipping a broken UI.

export const CRYPTO_PAY = {
  coin: "USDT",
  // Human label shown on checkout. ERC20 = Ethereum mainnet.
  network: "Ethereum (ERC20)",
  networkShort: "ERC20",
  // Fixed price for the crypto lane. Round number that absorbs the buyer's gas.
  amountUsd: 5,
  // USDT (ERC20) receiving address, Ethereum mainnet. GCash GCrypto receive.
  address: "0xD8cf672e312fB82d449Bf709241405636C3BB428",
};

export function cryptoPayEnabled(): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(CRYPTO_PAY.address.trim());
}
