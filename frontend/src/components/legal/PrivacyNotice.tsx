
const PrivacyNotice = () => {
  return (
    <div className="p-6 space-y-4 mt-14 text-center">
    <h1 className="text-3xl font-bold">Privacy Policy</h1>
    <p><strong>Effective Date:</strong> 5/30/2025</p>

    <h2 className="text-xl font-semibold">1. Information We Collect</h2>
    <ul className="list-none pl-6">
      <li>Name and email address</li>
      <li>Uploaded documents, PDFs, images/screenshots</li>
      <li>IP address and usage data</li>
    </ul>

    <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
    <ul className="list-none pl-6">
      <li>Generate flashcards and notes</li>
      <li>Improve our services</li>
      <li>Secure your account</li>
    </ul>

    <h2 className="text-xl font-semibold">3. AI Processing</h2>
    <p>We use Gemini to process uploaded content. Only the submitted content is sent to the AI model. No personal info is shared with Gemini.</p>

    <h2 className="text-xl font-semibold">4. Data Storage</h2>
    <p>Your data is securely stored using MongoDB.</p>

    <h2 className="text-xl font-semibold">5. Your Rights</h2>
    <p>You can delete your uploads or request account deletion.</p>

    <h2 className="text-xl font-semibold">6. Children’s Privacy</h2>
    <p>Users must be 7+. We delete data from children under 7 if discovered.</p>

    <h2 className="text-xl font-semibold">7. Changes</h2>
    <p>We’ll notify users of significant changes to this policy.</p>

    <h2 className="text-xl font-semibold">8. Contact</h2>
    <p>We’ll provide a contact email soon.</p>
  </div>
  )
}

export default PrivacyNotice