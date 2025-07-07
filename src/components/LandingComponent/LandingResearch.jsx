import { research1 } from "../../assets";

const LandingResearch = () => {
  // Research data array
  const researchData = [
    {
      id: 1,
      title: "Influence of Human Resource Development Practices",
      image: research1,
      link: "#"
    },
    {
      id: 2,
      title: "Advanced Machine Learning Techniques",
      image: research1, // You can import research2, research3 etc.
      link: "#"
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions",
      image: research1,
      link: "#"
    },
    {
      id: 4,
      title: "Biomedical Engineering Innovations",
      image: research1,
      link: "#"
    },
    {
      id: 5,
      title: "Cybersecurity in Modern Enterprises",
      image: research1,
      link: "#"
    },
    {
      id: 6,
      title: "Urban Planning and Smart Cities",
      image: research1,
      link: "#"
    }
  ];

  return (
    <section className="research-innovation py-20">
      <div className="container mx-auto">
        <div className="text-center">
          <h4 className="heading mb-8">Research and <span className="color_yellow">Innovation</span></h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchData.map((research) => (
            <div key={research.id}>
              <div className="research_box">
                <div className="research_top">
                  <h4 className="titletxt text-[1.2rem]">{research.title}...</h4>
                  <a href={research.link} className="btn btn-outline">Read More</a>
                </div>
                <div className="research_img_box">
                  <img
                    src={research.image}
                    className="w-[100%]"
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