import React from "react";

const Location = () => {
  return (
    <section
      id="location"
      className="flex w-full flex-col items-center gap-12 pb-12 pt-32"
    >
      <div className="relative flex h-60 w-full flex-col items-center justify-center px-4 text-center 2xl:p-0">
        <img
          src="./faq-bg.jpg"
          alt=""
          className="absolute left-0 top-0 z-0 h-full w-full object-cover brightness-50"
        />

        <div className="z-10 flex flex-col">
          <h2 className="text-3xl font-bold text-gray-50 md:text-4xl">
            LOCATION AND HOURS
          </h2>
          <p className="mt-2 text-gray-100">
            Find our office location and operating hours below.
          </p>
        </div>
      </div>
      <div className="container flex flex-col items-center gap-8 px-4 2xl:flex-row 2xl:px-0">
        <div className="flex flex-col 2xl:w-1/2">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Medical Center</h2>
            <p className="mt-2 text-gray-600">
              Our medical center is equipped with state-of-the-art facilities
              and a dedicated team of professionals to provide the best care
              possible. Visit us for consultations, treatments, and more.
            </p>
          </div>
          {/* Contact & Address */}
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Address */}
            <div className="flex items-center space-x-4">
              <img
                src="https://cdn-icons-png.freepik.com/256/9472/9472928.png?ga=GA1.1.1408066928.1741193827&semt=ais_hybrid"
                alt="Office"
                className="h-20 w-20"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  📍 Address
                </h3>
                <p className="text-sm text-gray-600">
                  Tashkent, Badamzar 8 <br />
                  +998 88-188-00-39 <br />
                  Uzbekistan
                </p>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                📞 Contact Information
              </h3>
              <p className="text-sm text-gray-600">+998 88-188-00-39</p>
              <p className="text-sm text-gray-600">info@medicalcenter.com</p>
              <button className="mt-4 rounded-lg bg-[#858C9C] px-4 py-2 text-white shadow-md hover:bg-green-700">
                Get Directions
              </button>
            </div>
          </div>
        </div>

        {/* Map */}
        <div className="h-80 w-full 2xl:w-1/2">
          <iframe
            className="h-full w-full rounded-lg shadow-lg"
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d2995.5711450857557!2d69.29144707624468!3d41.33993797130583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDHCsDIwJzIzLjgiTiA2OcKwMTcnMzguNSJF!5e0!3m2!1sen!2s!4v1743164480921!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Location;
