import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const BrowseJournals = ({
  browsJournalData = [],
  loading = false,
  error = null,
}) => {
  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-500">{error}</p>;

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
          {browsJournalData.map((journal, index) => (
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
                  to="/view-published-manuscript-list"
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
      </div>
    </section>
  );
};

export default BrowseJournals;
