import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faFile,
    faFileText,
    faPieChart,
    faThermometerFull,
    faAtom,
    faLongArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { analyticalJurnalImg, bengaliJurnalImg, biochemistryJurnalImg, biologicalJurnalImg, chemistryJurnalImg, englishJurnalImg, phycialJurnalImg } from '../../assets';

const BrowseJournals = () => {
    const journals = [
        {
            id: 1,
            title: "English",
            icon: faFileText,
            color: "color1",
            image: englishJurnalImg,
            orderClasses: "order-0 order-sm-0 order-md-0 order-lg-0 order-xl-0",
            whiteContent: false,
            borderLeft: true
        },
        {
            id: 2,
            title: "Bengali",
            icon: faFile,
            color: "color4",
            image: bengaliJurnalImg,
            orderClasses: "order-first",
            whiteContent: true,
            borderLeft: false
        },
        {
            id: 3,
            title: "Biological",
            icon: faFile,
            color: "color4",
            image: biologicalJurnalImg,
            orderClasses: "order-1 order-sm-2 order-md-1 order-lg-1 order-xl-1",
            whiteContent: true,
            borderLeft: false
        },
        {
            id: 4,
            title: "Physical",
            icon: faFile,
            color: "color2",
            image: phycialJurnalImg,
            orderClasses: "order-2 order-sm-1 order-md-2 order-lg-2 order-xl-2",
            whiteContent: false,
            borderLeft: false
        },
        {
            id: 5,
            title: "Analytical",
            icon: faPieChart,
            color: "color3",
            image: analyticalJurnalImg,
            orderClasses: "order-4 order-sm-4 order-md-3 order-lg-3 order-xl-3",
            whiteContent: false,
            borderLeft: false
        },
        {
            id: 6,
            title: "Biochemistry",
            icon: faThermometerFull,
            color: "color4",
            image: biochemistryJurnalImg,
            orderClasses: "order-3 order-sm-3 order-md-4 order-lg-4 order-xl-4",
            whiteContent: true,
            borderLeft: false
        },
        {
            id: 7,
            title: "Chemistry",
            icon: faAtom,
            color: "color4",
            image: chemistryJurnalImg,
            orderClasses: "order-5 order-sm-5 order-md-5 order-lg-5 order-xl-5",
            whiteContent: false,
            borderLeft: false
        },
        {
            id: 8,
            title: "Chemistry",
            icon: faAtom,
            color: "color4",
            image: chemistryJurnalImg,
            orderClasses: "order-5 order-sm-6 order-md-6 order-lg-6 order-xl-6",
            whiteContent: true,
            borderLeft: false
        }
    ];

    return (
        <section className="browsjurnal py-10 sm:py-16" id='jurnals'>
            <div className=" mx-auto ">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-5">
                        Browse <span className="text-yellow-400">Journals</span>
                    </h2>
                </div>

                <div className="quick_previewbase">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0">
                        {journals.map((journal, index) => (
                            <div
                                key={journal.id}
                                className={`${journal.orderClasses} flex`}
                            >
                                <div className={`quick_preview_basebox ${journal.whiteContent ? 'white_content' : ''} relative w-full`}>
                                    <div className={`quick_preview ${journal.borderLeft ? 'border-l-0' : ''} p-10 relative z-10 text-center`}>
                                        <div className={`w-20 h-20  mx-auto flex justify-center items-center rounded-3xl mb-4 
                                            ${(index === 1 || index === 2 || index === 4 || index === 7) ? "bg-[#ffba00]" : "bg-white"}`}
                                        >
                                            <FontAwesomeIcon
                                                icon={journal.icon}
                                                className={` text-4xl
                                            ${(index === 1 || index === 2 || index === 4 || index === 7) ? "text-white" : "text-black"}
                                            `}
                                            />

                                        </div>
                                        <h3 className={`text-4xl font-bold mb-3
                                             ${(index === 1 || index === 2 || index === 4 || index === 7) ? "text-[#ffba00]" : "  text-black"}
                                             `}>
                                            {journal.title}
                                        </h3>
                                        <p>
                                            <a className={`d-block text-xl font-bold hover:text-white transition-colors
                                                ${(index === 1 || index === 2 || index === 4 || index === 7) ? "text-[#ffba00] " : "  text-black"}
                                                `}
                                                href="#">
                                                View Journal <FontAwesomeIcon icon={faLongArrowRight} className="ml-2" />
                                            </a>
                                        </p>
                                    </div>
                                    <div className={`color_overly absolute inset-0 z-0
                                          ${(index === 1 || index === 2 || index === 4 || index === 7) ? "bg_black" : ""}
                                        `}></div>
                                    <div className="h-full quick_preview_imgbox absolute inset-0 overflow-hidden">
                                        <img
                                            src={journal.image}
                                            alt={journal.title}
                                            className="w-full h-full object-cover"
                                        />
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

export default BrowseJournals;