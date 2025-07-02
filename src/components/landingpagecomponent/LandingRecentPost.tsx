// import React from 'react';
import { recentPost1, recentPost2, recentPost3, recentPost4 } from "../../assets";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

const recentPosts = [
  {
    id: 1,
    title: "Perioperative Challenges in Orthogeriatric Patients with Cold Agglutinin Haemolytic",
    image: recentPost1,
    date: "21/07/2022",
    authors: "Alexander Fisher, Emily Walsh",
  },
  {
    id: 2,
    title: "Advances in Neurodegenerative Disease Research and Treatment",
    image: recentPost2,
    date: "15/08/2022",
    authors: "Sarah Johnson, Michael Chen",
  },
  {
    id: 3,
    title: "Innovative Approaches to Cardiovascular Disease Prevention",
    image: recentPost3,
    date: "03/09/2022",
    authors: "David Wilson, Jennifer Lee",
  },
  {
    id: 4,
    title: "Emerging Trends in Pediatric Oncology",
    image: recentPost4,
    date: "12/10/2022",
    authors: "Robert Taylor, Olivia Martinez",
  }
];

const LandingRecentPost = () => {
  return (
    <section className="section recent-post">
      <div className="container-fluid ">
        <div className="titlebox text-center pb-8">
          <h4 className="heading">Recent <span className="color_yellow">Post</span></h4>
          <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus.</p>
        </div>

        <div className="recent-post-slider">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            // navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000 }}
            breakpoints={{
              576: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 3,
              },
            }}
            loop={true}
          >
            {recentPosts.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="item">
                  <div className="card rounded">
                    <div className="imgwrrap">
                      <div className="txtwraap">
                        <h5 className="card-title">{post.title}</h5>
                      </div>
                      <img src={post.image} className="w-full h-80" alt={post.title} />
                    </div>
                    <div className="card-body bg-white p-5">
                      <div className="mb-4">
                        <span className="date">
                          <span className='mr-3'>
                            <FontAwesomeIcon icon={faCalendar} />
                          </span>
                          {post.date}
                        </span>
                        <p className="card-text text-gray-700 text-xl ">{post.authors}</p>
                      </div>
                      <div className='flex justify-center items-center'>
                        <a href="#" className="bg-[#ffba00] hover:bg-black hover:text-white px-20 py-2 rounded-2xl transition-all duration-300 ">Read More</a>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default LandingRecentPost;