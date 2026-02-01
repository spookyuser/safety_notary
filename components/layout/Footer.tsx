export function Footer() {
  return (
    <footer className="border-t border-napa bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-russett-400">
          <p>AI Safety Notary - Sepolia Testnet</p>
          <a
            href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-russett mt-2 sm:mt-0"
          >
            Get free Sepolia ETH
          </a>
        </div>
      </div>
    </footer>
  );
}
