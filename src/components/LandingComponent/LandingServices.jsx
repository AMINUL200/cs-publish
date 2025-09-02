import { research2, research4, services1, services2 } from "../../assets";

const LandingServices = () => {
    const services = [
        {
            id: 1,
            title: "CS Knowledge Hub",
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            image: services1,
            link: "#"
        },
        {
            id: 2,
            title: "CS Consultation & Freelancers Services",
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            image: services2,
            link: "#"
        },
        {
            id: 3,
            title: "CS Author Service",
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            image: research2,
            link: "#"
        },
        {
            id: 4,
            title: "Influence of Human Resource Development",
            description: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
            image: research4,
            link: "#"
        }
    ];

    return (
        <section className="bg-gray-100 py-12">
            <div className=" mx-auto md:mx-20">
                <div className="titlebox text-center mb-12">
                    <h4 className="heading text-3xl font-bold mb-4">Services</h4>
                    <p className="text-lg max-w-2xl font-light" style={{margin:'0 auto'}}>
                        Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus.
                    </p>
                </div>
                
                <div className="service_boxs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <div key={service.id} className="hover:scale-105 transition-transform duration-300">
                                <div className="card rounded-2xl border service_info bg-white shadow-md hover:shadow-lg">
                                    <div className="service_imgbox">
                                        <img 
                                            src={service.image} 
                                            className="img-fluid w-full h-48 object-cover" 
                                            alt={service.title} 
                                        />
                                    </div>
                                    <div className="card-body  p-6 ">
                                        <h5 className="card-title font-bold text-xl mb-3">{service.title}</h5>
                                        {/* <p className="text-gray-600 mb-4">{service.description}</p> */}
                                        <a href={service.link} className="btn1 ">
                                            Read More
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default LandingServices