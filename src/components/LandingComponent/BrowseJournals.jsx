import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const BrowseJournals = ({
  browsJournalData = [],
  loading = false,
  error = null,
}) => {
  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

  const navigate = useNavigate()

  return (
    <section className="py-10 sm:py-16 bg-gray-50" id="journals">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-5">
            Browse <span className="text-yellow-400">Journals</span>
          </h2>
          <h5 className="text-gray-600 max-w-2xl mx-auto">
            Discover our collection of specialized scientific journals covering
            various fields of research and innovation.
          </h5>
        </div>
        <div className="grid md:grid-cols-3 gap-4 w-full ">
          {browsJournalData.slice(0, 3).map((journal, index) => (
            <div
              key={journal.id}
              className="relative group h-[250px] md:h-[300px] overflow-hidden rounded-xl shadow-lg cursor-pointer transition-all duration-500"
              style={{
                backgroundImage: `url(${journal.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div
                className={`absolute inset-0 ${
                  index % 2 === 0
                    ? "bg-yellow-400/70 group-hover:bg-yellow-500/80 text-black"
                    : "bg-black/70 group-hover:bg-black/80 text-yellow-400"
                } backdrop-blur-[2px] flex flex-col justify-center items-center text-center px-6 transition-all duration-500`}
              >
                <h3 className="text-2xl md:text-3xl font-extrabold mb-3 leading-snug">
                  {journal.j_title}
                </h3>
                <Link
                  to={`/journal/${journal?.j_title}`}
                  className={`font-bold text-lg flex items-center gap-2 ${
                    index % 2 === 0 ? "text-black" : "text-yellow-400"
                  } hover:underline`}
                >
                  View Journal <FontAwesomeIcon icon={faLongArrowRight} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center pt-6">
          <button
            onClick={() => navigate("/journal")}
            className="bg-gradient-to-r custom-btn px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 inline-flex items-center gap-2 cursor-pointer"
          >
            View All Journal
            <svg
              className="w-5 h-5 transition-transform duration-300 hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default BrowseJournals;
