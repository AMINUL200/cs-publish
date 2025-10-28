import { Link } from "react-router-dom";
import { research2, research4, services1, services2 } from "../../assets";

const LandingServices = ({
  servicesData = [],
  loading = false,
  error = null,
}) => {
  console.log(servicesData);

 
  return (
    <section className="bg-gray-100 py-12">
      <div className=" mx-auto md:mx-20">
        <div className="titlebox text-center mb-12">
          <h4 className="heading text-3xl font-bold mb-4">Services</h4>
          <p
            className="text-lg max-w-2xl font-light"
            style={{ margin: "0 auto" }}
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean
            commodo ligula eget dolor. Aenean massa. Cum sociis natoque
            penatibus.
          </p>
        </div>

        <div className="service_boxs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((service) => (
              <div
                key={service.id}
                className="hover:scale-105 transition-transform duration-300"
              >
                <div className="card rounded-2xl border service_info bg-white shadow-md hover:shadow-lg">
                  <div className="service_imgbox">
                    <img
                      src={service.image}
                      className="img-fluid w-full h-48 object-cover"
                      alt={service.title}
                    />
                  </div>
                  <div className="card-body  p-6 mx-auto  ">
                    <h5 className="card-title font-bold text-xl !mb-1 mx-auto text-center">
                      {service.title}
                    </h5>
                    {/* <p className="text-gray-600 mb-4">{service.description}</p> */}
                    <Link to={`/cms/${service.slug}`} className="btn1 ">
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingServices;
