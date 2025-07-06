"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { ChevronRight, Lock, Shield, Menu, X, Award } from "lucide-react"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white overflow-x-hidden">
      {/* Header */}
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrollY > 50 ? "bg-black/95 backdrop-blur-md border-b border-[#1E2329]/50" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mr-3">
                <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-black rounded-full"></div>
                </div>
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">Hitrex</span>

              <nav className="hidden lg:flex ml-12 space-x-8">
                <a
                  href="#services"
                  className="text-gray-300 hover:text-[#FFB800] transition-colors duration-300 font-medium"
                >
                  Send & Receive
                </a>
                <a
                  href="#invest"
                  className="text-gray-300 hover:text-[#FFB800] transition-colors duration-300 font-medium"
                >
                  Buy & Sell
                </a>
                <a
                  href="#security"
                  className="text-gray-300 hover:text-[#FFB800] transition-colors duration-300 font-medium"
                >
                  Businesses
                </a>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-[#FFB800] transition-colors duration-300 font-medium"
                >
                  About
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center text-[#FFB800] mr-4">
                <span>BTC Price: </span>
                <span className="ml-2">$88,600.00</span>
              </div>
              <Button variant="ghost" className="text-gray-300 hover:text-black font-bold">
  <Link to="/login">Log in</Link>
</Button>

              <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold px-6 py-2 rounded-lg transition-all duration-300">
                <Link to="/signup">Sign up</Link>
              </Button>
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-800 bg-black/95 rounded-lg">
              <nav className="flex flex-col space-y-4 mt-4 px-4">
                <a href="#services" className="text-gray-300 hover:text-[#FFB800] transition-colors">
                  Send & Receive
                </a>
                <a href="#invest" className="text-gray-300 hover:text-[#FFB800] transition-colors">
                  Buy & Sell
                </a>
                <a href="#security" className="text-gray-300 hover:text-[#FFB800] transition-colors">
                  Businesses
                </a>
                <a href="#about" className="text-gray-300 hover:text-[#FFB800] transition-colors">
                  About
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/20 via-[#FFB800]/10 to-black opacity-80"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 lg:w-96 lg:h-96 bg-[#FFB800]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 lg:w-96 lg:h-96 bg-[#FFB800]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 lg:mb-8 leading-tight">
                <span className="text-white">Trusted </span>
                <span className="text-[#FFB800]">By</span>
                <br className="hidden sm:block" />
                <span className="text-white">Millions</span>
              </h1>

              <p className="text-gray-300 text-lg sm:text-xl mb-8 lg:mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Hitrex recovery is the best place to buy, sell, earn, hold, swap & send cryptocurrency.
              </p>

              <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold px-8 sm:px-10 py-4 sm:py-6 text-base sm:text-lg rounded-xl transition-all duration-300 shadow-2xl transform hover:scale-105">
                Create your account
              </Button>
            </div>

            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                <img
                  src="/i1.webp"
                  alt="Mobile App Interface"
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logos Section */}
      <section className="py-6 sm:py-10 border-y border-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-12 items-center justify-items-center">
            <div className="w-full max-w-[140px] transform hover:scale-110 transition-all duration-300 filter grayscale hover:grayscale-0">
              <img src="/media-forbes.svg" alt="Forbes" className="w-full h-auto" />
            </div>
            <div className="w-full max-w-[140px] transform hover:scale-110 transition-all duration-300 filter grayscale hover:grayscale-0">
              <img src="/media-fortune.svg" alt="Fortune" className="w-full h-auto" />
            </div>
            <div className="w-full max-w-[140px] transform hover:scale-110 transition-all duration-300 filter grayscale hover:grayscale-0">
              <img src="/media-bloomberg.svg" alt="Bloomberg" className="w-full h-auto" />
            </div>
            <div className="w-full max-w-[140px] transform hover:scale-110 transition-all duration-300 filter grayscale hover:grayscale-0">
              <img src="/media-nasdaq.svg" alt="Nasdaq" className="w-full h-auto" />
            </div>
            <div className="w-full max-w-[140px] transform hover:scale-110 transition-all duration-300 filter grayscale hover:grayscale-0">
              <img src="/media-business-insider.svg" alt="Business Insider" className="w-full h-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* USDT Investment Section */}
      <section id="invest" className="relative py-24 bg-[#0B0E11] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 bg-[#1E2329] rounded-[32px] p-8 lg:p-12 border border-gray-800/50">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 lg:mb-8 leading-tight">
                <span className="text-white">Invest in </span>
                <span className="text-[#FFB800]">USDT</span>
              </h2>

              <p className="text-gray-300 text-lg sm:text-xl mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Earn over $75,000 worth of Tether (USDT) weekly. Join over 2.4 million users investing in the most
                stable cryptocurrency with guaranteed returns.
              </p>

              <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl">
                Get Started <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[32px]"></div>
                <img
                  src="/private-client-hero.webp"
                  alt="Professional team working"
                  className="w-full h-auto object-cover rounded-[32px] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Swap & Hold Section */}
      <section className="relative py-24 bg-[#0B0E11] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 bg-[#1E2329] rounded-[32px] p-8 lg:p-12 border border-gray-800/50">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 lg:mb-8 leading-tight">
                <span className="text-[#FFB800]">Swap & Hold</span> <span className="text-white">with</span>
                <br />
                <span className="text-white">Confidence</span>
              </h2>

              <p className="text-gray-300 text-lg sm:text-xl mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Swap your cryptocurrencies with just a few clicks and store your assets in our secure wallets.
              </p>

              <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl">
                Get Started <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[32px]"></div>
                <img
                  src="/i8.webp"
                  alt="Swap Interface"
                  className="w-full h-auto object-cover rounded-[32px] shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instant Transactions Section */}
      <section className="py-24 bg-[#0B0E11] overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Instantly Send & Receive */}
            <div className="bg-[#1E2329] rounded-[32px] p-8 lg:p-10 border border-gray-800/50">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                <span className="text-white">Instantly send &</span>
                <br />
                <span className="text-white">receive crypto anytime</span>
              </h3>
              <p className="text-gray-300 text-lg mb-20 max-w-xl mx-auto">
                No waiting, no worrying—transact instantly and globally through the Lightning Network.
              </p>
              <div className="relative -mb-5 w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[32px]"></div>
                <img
                  src="/i3.webp"
                  alt="Send & Receive Interface"
                  className="w-full h-auto object-contain rounded-[32px] shadow-2xl"
                />
              </div>
              {/* <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl mx-auto">
                Get Started <ChevronRight className="h-5 w-5" />
              </Button> */}
            </div>

            {/* Buy the Dip */}
            <div className="bg-[#1E2329] rounded-[32px] p-8 lg:p-10 border border-gray-800/50">
              <h3 className="text-3xl lg:text-4xl font-bold mb-6">
                <span className="text-white">Buy the dip without</span>
                <br />
                <span className="text-white">delay and worry</span>
              </h3>
              <p className="text-gray-300 text-lg mb-14 max-w-xl mx-auto">
                We make buying cryptocurrencies safe and convenient, ensuring a seamless experience.
              </p>
              <div className="relative mb-5  w-full max-w-lg mx-auto transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-[32px]"></div>
                <img
                  src="/i6.webp"
                  alt="Buy Crypto Interface"
                  className="w-full h-auto object-contain rounded-[32px] shadow-2xl"
                />
              </div>
              {/* <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transform hover:scale-105 transition-all duration-300 shadow-xl mx-auto">
                Get Started <ChevronRight className="h-5 w-5" />
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* For Larger Investments */}
      <section className="py-24 bg-gradient-to-r from-gray-900/50 to-black">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="relative">
                <img
                  src="/i2.webp"
                  alt="Desktop Trading Interface"
                  className="rounded-2xl w-full h-auto"
                />
              </div>
            </div>

            <div className="lg:w-1/2 order-1 lg:order-2">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-white">For larger</span>
                <br />
                <span className="text-[#FFB800]">investments</span>
              </h2>

              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Our expert team is here to serve the sophisticated investor investing more than $100,000 of Tether
                (USDT). Get personalized service and exclusive benefits.
              </p>

              <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold">
                Get Started <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-white">Your asset is yours alone</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Unlike other exchanges, Hitrex Recovery builds security into every product and service for your peace of
              mind.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Security Feature 1 */}
            <div className="text-center">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-8">
                <img src="/black-square-bitcoin.svg" alt="" />
              </div>
              <h3 className="text-2xl font-bold mb-6">100% full reserve custody</h3>
              <p className="text-gray-400 leading-relaxed">
                All assets on Hitrex Recovery are held 1:1. We do not use or lend your cryptocurrencies, ever. Your
                asset is yours alone.
              </p>
            </div>

            {/* Security Feature 2 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <img src="/black-square-bitcoin.svg" alt="" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Multisig cold storage</h3>
              <p className="text-gray-400 leading-relaxed">
                Our clients' assets are kept offline in cold storage and require multiple signatures (multisig) to
                identify and authorize a transaction.
              </p>
            </div>

            {/* Security Feature 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-8 ">
              <img src="/black-square-bitcoin.svg" alt="" />
              </div>
              <h3 className="text-2xl font-bold mb-6">Licensed and regulated</h3>
              <p className="text-gray-400 leading-relaxed">
                Hitrex Recovery operates in a secure and licensed environment. We offer services to over 2 million
                active users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-24 bg-gradient-to-r from-gray-900/50 to-black">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="text-white">Real people, ready to help</span>
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Need a hand? Our customer support team is here to help you with your questions.
          </p>
          <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold px-8 py-4 text-lg rounded-xl">
            Get help
          </Button>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl lg:text-5xl font-bold mb-8">
            <span className="text-white">Ready to get started?</span>
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto leading-relaxed">
            Create a free account and start your crypto journey today.
          </p>
          <Button className="bg-[#FFB800] hover:bg-[#FFB800]/90 text-black font-bold px-12 py-6 text-xl rounded-xl transition-all duration-300 shadow-2xl">
            Sign up
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-gray-800/50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row justify-between mb-16">
            <div className="mb-12 lg:mb-0">
              <div className="flex items-center mb-8">
                <div className="mr-3">
                  <div className="w-10 h-10 bg-[#FFB800] rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 bg-black rounded-full"></div>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">Hitrex</span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed">
                The most secure and easy-to-use crypto platform. Send, receive, and invest in cryptocurrencies with
                complete confidence.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
              <div>
                <h4 className="text-lg font-bold mb-6">Services</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer">Buy Crypto</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Sell Crypto</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Swap</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Invest</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Company</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Press</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Support</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Contact Us</li>
                  <li className="hover:text-white transition-colors cursor-pointer">System Status</li>
                  <li className="hover:text-white transition-colors cursor-pointer">API</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold mb-6">Legal</h4>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Cookie Policy</li>
                  <li className="hover:text-white transition-colors cursor-pointer">Compliance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <div className="flex items-center mb-6 lg:mb-0">
              <div className="w-8 h-8 bg-[#FFB800] rounded-full flex items-center justify-center mr-3">
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              <p className="text-gray-400">© 2024 Hitrex. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
