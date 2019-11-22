//server config
import axios from 'axios';
import DefaultFooter from "components/Footers/DefaultFooter.js";
// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import React, { useEffect, useState } from "react";
// reactstrap components
import { Button, Col, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Pagination, PaginationItem, PaginationLink, Row, Spinner, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import { UNSPLASH_ACCESS_KEY, URL } from '../../config/server';



function ProfilePage() {
  const [pills, setPills] = useState("latest");
  const [latestImages, setLatestImages] = useState([]);
  const [searchedImages, setSearchedImages] = useState([]);
  const [leftFocus, setLeftFocus] = React.useState(false);
  const [latestImagesPage, setLatestImagesPage] = useState(1);
  const [latestImagesLoading, setLatestImagesLoading] = useState(false);
  const [searchImagesLoading, setSearchImagesLoading] = useState(false);
  const [searchImagesPage, setSearchImagesPage] = useState(1);
  const [searchParams, setSearchParams] = useState('');
  useEffect(() => {
    getLatestImages();
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, [latestImagesPage]);

  useEffect(() => {
    searchImages();
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, [searchImagesPage]);

  const getLatestImages = ()=>{
    setLatestImagesLoading(true)
    const headers = {
      "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1"
    }

    const params = {
      page: latestImagesPage, 
      per_page: 8
    }
  
    axios({
      method: 'get',
      url: `${URL}/photos`,
      headers: headers, 
      params: params
    })
      .then(function (response) {
        console.log(response)
        setLatestImages(response.data)
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
      .finally(()=>{setLatestImagesLoading(false)})
  }

  const searchImages = ()=>{
    setSearchImagesLoading(true)
    console.log(searchImagesPage)
    const headers = {
      "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1"
    }
    console.log(searchParams)

    const params = {
      query: searchParams,
      page: searchImagesPage, 
      per_page: 8
    }
  
    axios({
      method: 'get',
      url: `${URL}/search/photos`,
      headers: headers, 
      params: params
    })
      .then(function (response) {
        console.log(response)
        setSearchedImages(response.data.results)
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
      .finally(()=>{setSearchImagesLoading(false)})
  }



  const latestImagesPrevPaginate = ()=> {
    if(latestImagesPage === 1){
      return;
    }
    else{
      setLatestImagesPage(latestImagesPage - 1)
    } 
  }

  const searchPaginate = (direction)=>{
     if(direction === "previous"){
        if(searchImagesPage === 1){
        console.log("page 1")
        return;
      }
      else{ 
        setSearchImagesPage(searchImagesPage - 1)
       console.log("page - 1")
      }
    }
    else if (direction === "next"){
      
      if(searchedImages.length > 0){
        console.log("current page", searchImagesPage)
        setSearchImagesPage(searchImagesPage + 1)
        console.log("next page", searchImagesPage)
      }
      else{
        console.log("page 0")
        return
      }
    }
    else {
      return
    }
    console.log("next page", searchImagesPage)
  }

  const handleChange = (event)=> {
    setSearchParams(event.target.value);
  }

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        {/* <ProfilePageHeader /> */}
        <div className="section">
          <Container>
            <div className="button-container">
              <Button className="btn-round" color="info" size="lg"
               id="latest_tooltip"
               onClick={e => {
                e.preventDefault();
                setPills("latest");
                 }}>
               <i className="fa fa-list mr-2"></i>
                Latest
              </Button>
              <Button className="btn-round" color="info" size="lg"
               id="search_tooltip"
               onClick={e => {
                e.preventDefault();
                setPills("search");
                 }}>
               <i className="fa fa-search mr-2"></i>
                Search
              </Button>
              <UncontrolledTooltip delay={0} target="latest_tooltip">
                See latest images uploaded to unplash
              </UncontrolledTooltip>
              {/* <Button
                className="btn-round btn-icon"
                color="default"
                id="tooltip340339231"
                size="lg"
              >
                <i className="fab fa-instagram"></i>
              </Button> */}
              <UncontrolledTooltip delay={0} target="search_tooltip">
                Search on Unsplash
              </UncontrolledTooltip>
            </div>
            <Row>
              {/* <Col className="ml-auto mr-auto" md="6">
                <h4 className="title text-center">My Portfolio</h4>
              </Col> */}
              <TabContent className="gallery" activeTab={pills}
              style = {{width: "100%"}}>
                <TabPane tabId="latest">
                <Col className="ml-auto mr-auto" md="6">
                  <h3 className="title">Latest</h3>
                  <h5 className="description">
                    Check out the latest pictures added to unsplash.com
                  </h5>
                </Col> 
                  <Col className="ml-auto mr-auto" md="10">
                    <Row className="collections justify-content-center">
                    {
                        latestImagesLoading ? (
                          <Col className = "pb-5"  style = {{justifyContent: "center", display: "flex"}} md="6">
                            <Spinner style={{ width: '3rem', height: '3rem'}} />
                          </Col>
                        ) : latestImages.length === 0 ? (
                          <Col className = "pb-5"  style = {{justifyContent: "center", display: "flex"}} md="6">
                            <div>No results.</div>
                          </Col>
                        ) : latestImages.map((element, index)=>{
                          return(<Col className= "d-flex  justify-content-center" 
                                      md="6" key = {index}>
                            <img
                              alt= {element.alt_description}
                              height= "300"
                              width = "445"
                              className="img-raised"
                              src={element.urls.regular}
                            ></img>
                          </Col>)
                        })
                      }
                    </Row>
                    <Row>
                      <Col md="12">
                        <Pagination
                          style={{
                            display: "flex",
                            justifyContent: "center"
                          }}>
                          <PaginationItem>
                            <PaginationLink
                              aria-label="Previous"
                              onClick={() => latestImagesPrevPaginate()}
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
                           <p>Page: {latestImagesPage}</p>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              aria-label="Next"
                              onClick={()=> setLatestImagesPage(latestImagesPage + 1)}
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
                    </Row>
                  </Col>
                </TabPane>
                <TabPane tabId="search">
                <Col className="ml-auto mr-auto" md="6">
                  <h3 className="title my-0" style = {{marginTop: "0"}}>Search</h3>
                  <h5 className="description my-1">
                    Use the form below to search images on unsplash.com
                  </h5>
                </Col> 
                <Col className="ml-auto mr-auto mb-5" md="6">
                  <InputGroup className={leftFocus ? "input-group-focus" : ""}>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fa fa-search"></i>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Enter search keywords"
                      type="text"
                      onChange = {(event)=> handleChange(event)}
                      onFocus={() => setLeftFocus(true)}
                      onBlur={() => setLeftFocus(false)}
                    ></Input>
                  </InputGroup>
                  <div className="send-button">
                  <Button
                    block
                    className="btn-round"
                    color="info"
                    onClick={() => {setSearchImagesPage(1); searchImages()}}
                    size="lg"
                  >
                    Search
                  </Button>
                </div>
                </Col> 
                  <Col className="ml-auto mr-auto" md="10">
                    <Row className="collections justify-content-center">
                      {
                        searchImagesLoading ? (
                          <Col className = "pb-5"  style = {{justifyContent: "center", display: "flex"}} md="6">
                            <Spinner style={{ width: '3rem', height: '3rem'}} />
                          </Col>
                        ) : searchedImages.length === 0 ? (
                          <Col className = "pb-5"  style = {{justifyContent: "center", display: "flex"}} md="6">
                            <div>No results.</div>
                          </Col>
                        ) : searchedImages.map((element, index)=>{
                          return(<Col className= "d-flex  justify-content-center" 
                                      md="6" key = {index}>
                            <img
                              alt= {element.alt_description}
                              height= "300"
                              width = "445"
                              className="img-raised"
                              src={element.urls.regular}
                            ></img>
                          </Col>)
                        })
                      }
                    </Row>
                    <Row>
                      <Col md="12">
                        <Pagination
                          style={{
                            display: "flex",
                            justifyContent: "center"
                          }}>
                          <PaginationItem>
                            <PaginationLink
                              aria-label="Previous"
                              onClick={() => {searchPaginate("previous")}}
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
                           <p>Page: {searchImagesPage}</p>
                          </PaginationItem>
                          <PaginationItem>
                            <PaginationLink
                              aria-label="Next"
                              onClick={()=> {searchPaginate("next")}}
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
                    </Row>
                  </Col>
                </TabPane>
              </TabContent>
            </Row>
          </Container>
        </div>
        <DefaultFooter />
      </div>
    </>
  );
}

export default ProfilePage;
