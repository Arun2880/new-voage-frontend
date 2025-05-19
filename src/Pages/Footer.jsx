import React from "react";
// import "./footer.css";
import Logo from "../images/f-logo.png";

const Footer = () => {
  return (
   <footer
      className="text-center text-lg-start p-2 text-muted"
      style={{ backgroundColor: "#2a438b" }}
    >
      {/* Section: Links */}
      <section className="text-light">
        <div className="container text-center text-md-start mt-5">
          <div className="row mt-3">
            {/* Why Us */}
            <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <i className="fas fa-gem text-light me-3"></i>Why Us?
              </h6>
              <p>
                It's the perfect time to start investing your energy in learning
                new languages and expanding your horizons.
              </p>
            </div>

            {/* Home Links */}
         <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
            
              <h6 className="text-uppercase fw-bold mb-4">Useful Links</h6>
              <p>
                <a href="index" className=" text-light text-decoration-none" target="_blank">Home</a>
              </p>
              <p>
                <a href="about" className=" text-light text-decoration-none" target="_blank">About</a>
              </p>
              <p>
                <a href="https://voagelearning.com/index#courses" className=" text-light text-decoration-none" target="_blank">Our Course</a>
              </p>
              <p>
                <a href="contact" className=" text-light text-decoration-none" target="_blank">Contact Us</a>
              </p>
            </div>
          
            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
             
              <h6 className="text-uppercase fw-bold mb-4">Useful links</h6>
              <p>
                <a href="contact" className=" text-light text-decoration-none" target="_blank">Enquiry Now</a>
              </p>
              <p>
                <a href="free-class" className=" text-light text-decoration-none" target="_blank">Book Free Demo</a>
              </p>
              <p>
                <a href="https://voagelearning.com/index#courses" className=" text-light text-decoration-none" target="_blank">Langauge Course</a>
              </p>
            </div>

            {/* Contact Info */}
            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <a
                  href="mailto:enquiry@voagelearning.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reset text-decoration-none"
                >
                  <i className="fas fa-envelope me-3"></i>
                  enquiry@voagelearning.com
                </a>
              </p>
              <p>
                <a
                  href="tel:+919520311515"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reset text-decoration-none"
                >
                  <i className="fas fa-phone me-3"></i>+91 9520311515
                </a>
              </p>
              <p>
                <a
                  href="tel:+918923343700"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-reset text-decoration-none"
                >
                  <i className="fas fa-phone me-3"></i>+91 8923343700
                </a>
              </p>
            </div>
          </div>

          {/* Logo and Social Icons */}
          <div className="row">
            <div className="col-md-12 d-flex justify-content-center">
              <div className="d-flex justify-content-center flex-column">
                <img
                  src={Logo}
                  alt="logo"
                  className="img-fluid mx-auto"
                  style={{ height: "auto", width: "120px" }}
                />
                <div className="d-flex justify-content-center mt-2">
                  <a href="#" target="_blank" rel="noopener noreferrer" className="me-4 text-light">
                    <i className="fa-brands fa-facebook h3"></i>
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="me-4 text-light">
                    <i className="fa-brands fa-x-twitter h3"></i>
                  </a>
                  <a href="#" target="_blank" rel="noopener noreferrer" className="me-4 text-light">
                    <i className="fa-brands fa-linkedin h3"></i>
                  </a>
                  <a href="https://in.linkedin.com/company/voage-learning" target="_blank" rel="noopener noreferrer" className="me-4 text-light">
                    <i className="fa-brands fa-whatsapp h3"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
};

export default Footer;
