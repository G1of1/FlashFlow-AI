import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-s2 text-p1 py-8 px-6 text-center bottom-0 right-0">
    <p className="text-sm mb-4">© 2025 FlashFlowAI. All rights reserved.</p>
    <div className="flex justify-center space-x-6 text-sm">
      <Link to="/privacy" className="hover:text-gray-200">Privacy Policy</Link>
      <Link to="/terms" className="hover:text-gray-200">Terms of Use</Link>
    </div>
  </footer>
);

export default Footer;