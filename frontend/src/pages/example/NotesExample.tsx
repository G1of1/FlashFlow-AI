import { Card, CardContent } from "@/components/ui/card";


const NotesExample = () => {
    const topic = "Chemistry: Atomic Structure"
    const notes = `## Atomic Structure: Study Notes

### Subatomic Particles

*   **Protons:**
    *   Positively charged particles in the nucleus.
    *   Define the element (atomic number).
*   **Neutrons:**
    *   Neutral (no charge) particles in the nucleus.
    *   Contribute to the atom's mass.
*   **Electrons:**
    *   Negatively charged particles orbiting the nucleus.
    *   Occupy specific energy levels/shells.

### Atomic Structure Components

*   **Nucleus:**
    *   The atom's central core.
    *   Contains protons and neutrons.
    *   Small size, but contains nearly all of the atom's mass.
*   **Electron Cloud:**
    *   The region surrounding the nucleus.
    *   Where electrons are most likely to be found.
*   **Energy Levels/Shells:**
    *   Specific regions around the nucleus where electrons reside.
    *   Each has a characteristic energy level.
    *   Can hold a specific number of electrons.

### Key Concepts and Definitions

*   **Atomic Number:**
    *   Number of protons in the nucleus.
    *   Identifies the element.
*   **Mass Number:**
    *   Total number of protons and neutrons in the nucleus.
*   **Isotopes:**
    *   Atoms of the same element.
    *   Different numbers of neutrons (different mass numbers).
*   **Ions:**
    *   Atoms that have gained or lost electrons.
    *   Result in a net electrical charge (positive or negative).`
  // Split notes.content on bullet points or line breaks
  const sections = notes
  .split(/##\s+/) // split on headings marked with ##
  .map((section : any) => {
    const [heading, ...bullets] = section.trim().split("\n").filter(Boolean);
    return {
      heading: heading?.trim(),
      bullets: bullets.map((b: any) => b.replace(/^[-*•]\s*/, "").trim()), // clean bullet format
    };
  })
  .filter((s : any) => s.heading); // remove empty sections
  return (
    <div className="min-h-screen text-center flex flex-col items-center p-6 mt-12">
      <h1 className="text-3xl font-bold mb-4">{topic}</h1>
      <Card className="max-w-3xl">
        <CardContent className="p-6 space-y-4 text-gray-800 text-left">
          {sections.map((section: any, index : any) => (
          <div key={index}>
          <h2 className="text-xl font-semibold text-blue-700 mb-2">{section.heading}</h2>
          <ul className="list-none space-y-1 mb-4">
          {section.bullets.map((point : any, idx : any) => (
          <li key={idx} className="list-none">{point}</li>
          ))}
    </ul>
  </div>
))}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotesExample;