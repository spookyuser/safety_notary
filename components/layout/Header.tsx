"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export function Header() {
  const { chain, isConnected } = useAccount();
  const isWrongNetwork = isConnected && chain?.id !== 11155111;

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-russett">
              AI Safety Notary
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-russett-400 hover:text-russett transition"
              >
                Home
              </Link>
              <Link
                href="/submit"
                className="text-russett-400 hover:text-russett transition"
              >
                Submit
              </Link>
              <Link
                href="/incidents"
                className="text-russett-400 hover:text-russett transition"
              >
                Incidents
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isWrongNetwork && (
              <div className="hidden sm:block px-3 py-1 bg-geraldine-100 text-geraldine-800 text-sm rounded-md">
                Wrong Network - Switch to Sepolia
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}
