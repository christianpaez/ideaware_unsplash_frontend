//server config
import axios from 'axios';
import DefaultFooter from "components/Footers/DefaultFooter.js";
// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import React, { useEffect, useState } from "react";
// reactstrap components
import { Button, CardBody, Col, CardHeader, Card, Container, Input, InputGroup, InputGroupAddon, InputGroupText, Pagination, PaginationItem, PaginationLink, Row, Spinner, TabContent, TabPane, UncontrolledTooltip } from "reactstrap";
import { UNSPLASH_ACCESS_KEY, URL, SERVER } from '../../config/server';



function Search() {
  const [pills, setPills] = useState("latest");
  const [latestImages, setLatestImages] = useState([]);
  const [searchedImages, setSearchedImages] = useState([]);
  const [favoritesIds, setFavoritesIds] = useState([]);
  const [leftFocus, setLeftFocus] = React.useState(false);
  const [latestImagesPage, setLatestImagesPage] = useState(1);
  const [latestImagesLoading, setLatestImagesLoading] = useState(false);
  const [searchImagesLoading, setSearchImagesLoading] = useState(false);
  const [addingImagesLoading, setAddingImagesLoading] = useState(false);
  const [searchImagesPage, setSearchImagesPage] = useState(1);
  const [searchParams, setSearchParams] = useState('');
  useEffect(() => {
    getLatestImages();
    loadFavoritesIds();
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, [latestImagesPage]);

  useEffect(() => {
    loadFavoritesIds();
    searchImages();
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, [searchImagesPage]);

  //UNSPLASH GET /photos
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
  //UNSPLASH GET /search/photos
  const searchImages = ()=>{
    setSearchImagesLoading(true)
    const headers = {
      "Authorization": `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      "Accept-Version": "v1"
    }
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
  
  //SERVER POST /images
  const addFavorite = (image, module)=>{

    if(module === "latest"){
      setLatestImagesLoading(true)
    }
    else if (module === "search"){
      setSearchImagesLoading(true)
    }
    else {
      return;
    }
    const headers = {
      "Content-Type": "Application/json"
    }
    let imageDescription = "No description Available";
    if(image.alt_description != null){
      imageDescription = image.alt_description
    }

    const data = {
      unsplash_id: image.id, 
      description: imageDescription,
      url:image.urls.regular,
      html: image.links.html
    }  
    axios({
      method: 'post',
      url: `${SERVER}/images`,
      headers: headers, 
      data: data
    })
      .then(function (response) {
        if(module === "latest"){
          setLatestImagesLoading(false)
        }
        else if (module === "search"){
          setSearchImagesLoading(false)
        }
        else {
          return;
        }
        loadFavoritesIds()
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
      .finally(()=>{
        if(module === "latest"){
          getLatestImages()
        }
        else if(module === "search"){
          searchImages()
        }
        else{
          return
          }
        })
  }

  //SERVER GET /images
  const loadFavoritesIds = ()=>{
    var ids = [];
    const headers = {
      "Content-Type": 'Application/json',
    }
    axios({
      method: 'get',
      url: `${SERVER}/images`,
      headers: headers, 
    })
      .then(function (response) {
        var images = response.data.data 
        images.forEach((image)=>{
          ids.push(image.unsplash_id)
        })
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
      .finally(()=>{setFavoritesIds(ids)})
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
        return;
      }
      else{ 
        setSearchImagesPage(searchImagesPage - 1)
      }
    }
    else if (direction === "next"){
      
      if(searchedImages.length > 0){
        setSearchImagesPage(searchImagesPage + 1)
      }
      else{
        return
      }
    }
    else {
      return
    }
  }

  const handleChange = (event)=> {
    setSearchParams(event.target.value);
  }

  return (
    <>
      <IndexNavbar />
      <div className="wrapper">
        {/* <SearchHeader /> */}
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
              <UncontrolledTooltip delay={0} target="search_tooltip">
                Search on Unsplash
              </UncontrolledTooltip>
            </div>
            <Row>
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
                          return(<Col md="6" key = {index}>
                            <Card>
                            <CardHeader className="text-center">
                                <div className="logo-container">
                                  <img
                                    className = "card-img-top"
                                    height = "250"
                                    alt={element.alt_description}
                                    src={element.urls.regular}
                                  ></img>
                                </div>
                              </CardHeader>
                                <CardBody>
                                  {
                                   element.alt_description != null ? 
                                   <h4 className="card-title mt-0 tim-note">{element.alt_description}</h4> : 
                                   <h4 className="card-title mt-0">No description Available</h4> 
                                  }
                                  <p class="card-text">Use actions below to add to favorites or see this image on unsplash.com</p>
                                  <div className = "d-flex align-content-center">
                                  <Button href = {element.links.html}
                                          target = "_blank"
                                          className="btn btn-default">See on 
                                  Unsplash</Button>
                                  {favoritesIds.includes(element.id) && <Button className="btn btn-danger"
                                          onClick = {(e)=>{e.preventDefault()}}>
                                            Already Favorite</Button>}

                                  {
                                   !favoritesIds.includes(element.id) && (
                                   addingImagesLoading ? (
                                    <div className = "ml-5">
                                    <Spinner style={{ width: '3rem', height: '3rem'}} />
                                  </div>
                                   ) : (
                                      <Button className="btn btn-info"
                                          onClick = {()=>{addFavorite(element, "latest")}}>
                                            Add to Favorites</Button>
                                     )
                                    )
                                  }
                                  </div>
                                </CardBody>  
                                </Card>                           
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
                          return(
                        <Col md="6" key = {index}>
                          <Card>
                            <CardHeader className="text-center">
                                <div className="logo-container">
                                  <img
                                    className = "card-img-top"
                                    height = "250"
                                    alt={element.alt_description}
                                    src={element.urls.regular}
                                  ></img>
                                </div>
                              </CardHeader>
                                <CardBody>
                                  {
                                   element.alt_description != null ? 
                                   <h4 className="card-title mt-0 tim-note">{element.alt_description}</h4> : 
                                   <h4 className="card-title mt-0">No description Available</h4> 
                                  }
                                  <p class="card-text">Use actions below to add to favorites or see this image on unsplash.com</p>
                                  <div className = "d-flex align-content-center">
                                  <Button href = {element.links.html}
                                          target = "_blank"
                                          className="btn btn-default">See on 
                                  Unsplash</Button>
                                  {favoritesIds.includes(element.id) && <Button className="btn btn-danger"
                                          onClick = {(e)=>{e.preventDefault()}}>
                                            Already Favorite</Button>}
                                  {
                                   !favoritesIds.includes(element.id) && (
                                   addingImagesLoading ? (
                                    <div className = "ml-5">
                                    <Spinner style={{ width: '3rem', height: '3rem'}} />
                                  </div>
                                   ) : (
                                      <Button className="btn btn-info"
                                          onClick = {()=>{addFavorite(element, "search")}}>
                                            Add to Favorites</Button>
                                     )
                                    )
                                  }
                                  </div>
                                </CardBody>  
                                </Card>                           
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

export default Search;
