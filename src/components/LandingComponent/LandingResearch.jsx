import { Link } from "react-router-dom";
import { research1 } from "../../assets";

const LandingResearch = ({
  researchInfo = [],
  loading = false,
  error = null,
}) => {

  const STORAGE_URL = import.meta.env.VITE_STORAGE_URL;


  return (
    <section className="research-innovation py-10 px-4 sm:py-14 sm:pb-2">
      <div className="container mx-auto">
        <div className="text-center">
          {/* <h2 className="heading !mb-8 !md:mb-10">Research And Innovation</h2> */}
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Research And<span className="text-yellow-400"> Innovation</span> 
        </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {researchInfo.slice(0, 3).map((research) => (
            <div key={research.id}>
              <div className="research_box !mb-0">
                <div className="research_top">
                  <h4 className="titletxt text-[1.2rem]">{research.title}</h4>
                  <Link to={`/cms/${research.slug}`} className="btn btn-outline">
                    Read More
                  </Link>
                </div>
                <div className="research_img_box">
                  <img
                    src={`${STORAGE_URL}${research.image}`}
                    className="w-[100%] h-[300px] object-cover"
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
