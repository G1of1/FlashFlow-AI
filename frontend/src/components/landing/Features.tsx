const Features = () => (
  <section id="features" className="bg-gradient-to-b from-orange-500 to-yellow-500 text-light py-20 px-6 text-center">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-primary">AI Flashcards and Notes that will help you ace that exam!</h1>
      <p className="text-p4s text-white mb-6">Our AI Flashcards and Notes are generated with the latest LLMs. They are bound to help you understand those tricky conecepts and master them. You'll feel confident in your comprehension and pass those test, quizzes, or exams.</p>
      <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
      <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { icon: '📄', title: 'Multi-Format Uploads', desc: 'Upload notes as PDF, DOCX, or images.' },
          { icon: '⚡', title: 'AI-Powered Summaries', desc: 'Smart summarization of long-form notes.' },
          { icon: '🧠', title: 'Quiz-Ready Flashcards', desc: 'Generate flashcards from key terms & concepts.' },
        ].map(({ icon, title, desc }, i) => (
          <div key={i} className="text-center px-4 bg-white rounded-lg p-6 hover:translate-y-[-2px] transition-transform space-y-2 duration-300">
            <div className="text-4xl mb-4">{icon}</div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-sm text-gray-500">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features;
