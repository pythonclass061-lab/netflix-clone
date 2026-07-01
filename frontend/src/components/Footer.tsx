export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 py-16 netflix-container">
      <p className="mb-8">Questions? Call <a href="tel:000-800-919-1694" className="underline hover:text-gray-300">000-800-919-1694</a></p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="space-y-3">
          <a href="#" className="block hover:underline">FAQ</a>
          <a href="#" className="block hover:underline">Investor Relations</a>
          <a href="#" className="block hover:underline">Privacy</a>
          <a href="#" className="block hover:underline">Speed Test</a>
        </div>
        <div className="space-y-3">
          <a href="#" className="block hover:underline">Help Centre</a>
          <a href="#" className="block hover:underline">Jobs</a>
          <a href="#" className="block hover:underline">Cookie Preferences</a>
          <a href="#" className="block hover:underline">Legal Notices</a>
        </div>
        <div className="space-y-3">
          <a href="#" className="block hover:underline">Account</a>
          <a href="#" className="block hover:underline">Ways to Watch</a>
          <a href="#" className="block hover:underline">Corporate Information</a>
          <a href="#" className="block hover:underline">Only on Netflix</a>
        </div>
        <div className="space-y-3">
          <a href="#" className="block hover:underline">Media Centre</a>
          <a href="#" className="block hover:underline">Terms of Use</a>
          <a href="#" className="block hover:underline">Contact Us</a>
        </div>
      </div>
      <div className="mt-8">
        <select className="bg-black border border-gray-600 text-white px-4 py-2 rounded">
          <option value="en">🌐 English</option>
          <option value="ne">🇳🇵 Nepali</option>
        </select>
      </div>
      <p className="mt-6 text-sm">Netflix Clone - For Educational Purposes</p>
    </footer>
  )
}
