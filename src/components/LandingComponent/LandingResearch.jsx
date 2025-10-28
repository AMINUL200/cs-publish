import { Link } from "react-router-dom";
import { research1 } from "../../assets";

const LandingResearch = ({
  researchInfo = [],
  loading = false,
  error = null,
}) => {



  return (
    <section className="research-innovation py-10 px-4 sm:py-14 sm:pb-2">
      <div className="container mx-auto">
        <div className="text-center">
          <h2 className="heading !mb-8 !md:mb-10">Research</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchInfo.map((research) => (
            <div key={research.id}>
              <div className="research_box">
                <div className="research_top">
                  <h4 className="titletxt text-[1.2rem]">{research.title}</h4>
                  <Link to={`/cms/${research.slug}`} className="btn btn-outline">
                    Read More
                  </Link>
                </div>
                <div className="research_img_box">
                  <img
                    src={research.image}
                    className="w-[500px] h-[300px] object-cover"
                    alt={research.title}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingResearch;
