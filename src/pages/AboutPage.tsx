import { teamMembers } from "../data/team";

export default function AboutPage() {
  return (
    <div className="w-full flex flex-col items-center px-6 py-10">

      {/* Title */}
      <h1 className="text-4xl font-bold mb-4 text-center">Our Team</h1>

      {/* Subtitle */}
      <p className="text-gray-600 text-center max-w-2xl mb-12">
        Born from the academic collaboration. This project is a testament to the
        collective brilliance of our academic community at FIIT STU in Bratislava.
      </p>

      {/* Team grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl w-full">

        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="bg-white rounded-lg shadow border overflow-hidden flex flex-col"
          >
            {/* Image */}
            <div className="w-full h-80 bg-gray-100 flex items-center justify-center overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text section */}
            <div className="p-4 flex flex-col grow">
              <h2 className="text-xl font-semibold mb-1">{member.name}</h2>
              <p className="text-gray-700 mb-3">{member.role}</p>

              <p className="text-gray-600 mb-3">{member.email}</p>

              {/* LinkedIn placeholder */}
              <div className="mt-auto">
                <div className="inline-block px-2 py-1 bg-blue-200 rounded cursor-pointer opacity-40">
                  <span className="text-blue-700 font-bold">in</span>
                </div>
              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
