//server config
import axios from 'axios';
import DefaultFooter from "components/Footers/DefaultFooter.js";
// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import React, { useEffect, useState } from "react";
// reactstrap components
import { Button, Col, Carousel, CardBody, CardHeader, Card,CarouselItem, Container, Row, Spinner } from "reactstrap";
import { SERVER } from '../../config/server';


function Favorites() {
  const [favoriteImages, setFavoriteImages] = useState([]);
  const [favoriteImagesLoading, setFavoriteImagesLoading] = useState(false);
  useEffect(() => {
    getFavoriteImages();
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  //SERVER GET /images
  const getFavoriteImages = ()=>{
    setFavoriteImagesLoading(true)
    const headers = {
      "Content-Type": 'Application/json',
    }
    
    
    axios({
      method: 'get',
      url: `${SERVER}/images`,
      headers: headers, 
    })
      .then(function (response) {
        setFavoriteImages(response.data.data)
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
      .finally(()=>{setFavoriteImagesLoading(false)})
  }

  //SERVER DELETE /images/:id
  const removeFavorite = (imageId)=>{
    setFavoriteImagesLoading(true)
    const headers = {
      "Content-Type": "Application/json"
    } 
    axios({
      method: 'delete',
      url: `${SERVER}/images/${imageId}`,
      headers: headers, 
    })
      .then(function (response) {
        setFavoriteImagesLoading(response.data)
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
      })
      .finally(()=>{getFavoriteImages();setFavoriteImagesLoading(false)})
  }

  

 //CAROUSEL LOGIC
 const [activeIndex, setActiveIndex] = React.useState(0);
 const [animating, setAnimating] = React.useState(false);
 const onExiting = () => {
   setAnimating(true);
 };
 const onExited = () => {
   setAnimating(false);
 };
 const next = () => {
   if (animating) return;
   const nextIndex = activeIndex === favoriteImages.length - 1 ? 0 : activeIndex + 1;
   setActiveIndex(nextIndex);
 };
 const previous = () => {
   if (animating) return;
   const nextIndex = activeIndex === 0 ? favoriteImages.length - 1 : activeIndex - 1;
   setActiveIndex(nextIndex);
 };

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        {/* <SearchHeader /> */}
        <div className="section">
          <Container>
            <Row className = "flex justify-content-center">
              <Col className="ml-auto mr-auto" md="6">
                <h3 className="title">Favorites</h3>
                <h5 className="description">
                  This section showcases your favorite images
                  </h5>
              </Col>
              {
                favoriteImages.length > 0 && (
                  <Col lg="8" md="12" className = "mb-5">
                  <Carousel
                    width = "500" 
                    height = "500"
                    activeIndex={activeIndex}
                    next={next}
                    previous={previous}
                  >
                    {/* <CarouselIndicators
                      items={items}
                      activeIndex={activeIndex}
                      onClickHandler={goToIndex}
                    /> */}
                    {favoriteImages.map(item => {
                      return (
                        <CarouselItem
                          onExiting={onExiting}
                          onExited={onExited}
                          key={item.id}
                        >
                          <img src={item.url} alt={item.description}
                          height = "500" width = "100%" />
                          <div className="carousel-caption d-none d-md-block tim-note">
                            <h5><b>{item.description}</b></h5>
                          </div>
                        </CarouselItem>
                      );
                    })}
                    <a
                      className="carousel-control-prev"
                      data-slide="prev"
                      href="#pablo"
                      onClick={e => {
                        e.preventDefault();
                        previous();
                      }}
                      role="button"
                    >
                      <i className="now-ui-icons arrows-1_minimal-left"></i>
                    </a>
                    <a
                      className="carousel-control-next"
                      data-slide="next"
                      href="#pablo"
                      onClick={e => {
                        e.preventDefault();
                        next();
                      }}
                      role="button"
                    >
                      <i className="now-ui-icons arrows-1_minimal-right"></i>
                    </a>
                  </Carousel>
                </Col>
             

                )
              }
                 <Col className="ml-auto mr-auto" md="10">
                <Row className="collections justify-content-center">
                  {
                    favoriteImagesLoading ? (
                      <Col className="pb-5" style={{ justifyContent: "center", display: "flex" }} md="6">
                        <Spinner style={{ width: '3rem', height: '3rem' }} />
                      </Col>
                    ) : favoriteImages.length === 0 ? (
                      <Col className="pb-5" style={{ justifyContent: "center", display: "flex" }} md="6">
                        <div>No Favorites.</div>
                      </Col>
                    ) : favoriteImages.map((element, index) => {
                      return (
                        <Col md="6" key = {index}>
                            <Card>
                            <CardHeader className="text-center">
                                <div className="logo-container">
                                  <img
                                    className = "card-img-top"
                                    height = "250"
                                    alt={element.description}
                                    src={element.url}
                                  ></img>
                                </div>
                              </CardHeader>
                                <CardBody>
                                   <h4 className="card-title mt-0 tim-note">{element.description}</h4> 
                                  <p class="card-text">Use actions below to remove from favorites or see this image on unsplash.com</p>
                                 <div className = "d-flex align-content-center">
                                 <Button href = {element.html}
                                          target = "_blank"
                                          className="btn btn-default">See on 
                                  Unsplash</Button>
                                  <Button className="btn btn-danger"
                                          onClick = {()=>
                                          {removeFavorite(element.id)}}>Remove from 
                                          Favorites</Button>
                                  </div> 
                                  
                                </CardBody>  
                                </Card>                           
                          </Col>
                      )
                    })
                  }
                </Row>
                {/* <Row>
                  <Col md="12">
                    <Pagination
                      style={{
                        display: "flex",
                        justifyContent: "center"
                      }}>
                      <PaginationItem>
                        <PaginationLink
                          aria-label="Previous"
                          onClick={() => favoriteimagesPaginate("previous")}
                        >
                          <span aria-hidden={true}>
                            <i
                              aria-hidden={true}
                              className="fa fa-angle-double-left"
                            ></i>
                          </span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <p>Page: {favoriteImagesPage}</p>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink
                          aria-label="Next"
                          onClick={() => favoriteimagesPaginate("next")}
                        >
                          <span aria-hidden={true}>
                            <i
                              aria-hidden={true}
                              className="fa fa-angle-double-right"
                            ></i>
                          </span>
                        </PaginationLink>
                      </PaginationItem>
                    </Pagination>
                  </Col>
                </Row> */}
              </Col>
            </Row>
          </Container>
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default Favorites;
