import React from "react";

// reactstrap components
import {
  Button,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  Container,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import ProfilePageHeader from "components/Headers/ProfilePageHeader.js";
import DefaultFooter from "components/Footers/DefaultFooter.js";

function ProfilePage() {
  const [pills, setPills] = React.useState("2");
  React.useEffect(() => {
    document.body.classList.add("profile-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
      document.body.classList.remove("profile-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
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
                setPills("1");
                 }}>
               <i className="fab fa-twitter mr-2"></i>
                Latest
              </Button>
              <Button className="btn-round" color="info" size="lg"
               id="search_tooltip"
               onClick={e => {
                e.preventDefault();
                setPills("2");
                 }}>
               <i className="fab fa-twitter mr-2"></i>
                Search
              </Button>
              {/* <Button
                className="btn-round btn-icon"
                color="default"
                id="tooltip515203352"
                size="lg"
              >
                <i className="fab fa-twitter"></i>
              </Button> */}
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
              <TabContent className="gallery" activeTab={"pills" + pills}>
                <TabPane tabId="pills1">
                <Col className="ml-auto mr-auto" md="6">
                  <h3 className="title">Latest</h3>
                  <h5 className="description">
                    Check out the latest pictures added to unsplash.com
                  </h5>
                </Col> 
                  <Col className="ml-auto mr-auto" md="10">
                    <Row className="collections">
                      <Col md="6">
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg1.jpg")}
                        ></img>
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg3.jpg")}
                        ></img>
                      </Col>
                      <Col md="6">
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg8.jpg")}
                        ></img>
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg7.jpg")}
                        ></img>
                      </Col>
                    </Row>
                  </Col>
                </TabPane>
                <TabPane tabId="pills2">
                <Col className="ml-auto mr-auto" md="6">
                  <h3 className="title">Search</h3>
                  <h5 className="description">
                   Use the form below to search images on unsplash.com
                  </h5>
                </Col> 
                  <Col className="ml-auto mr-auto" md="10">
                    <Row className="collections">
                      <Col md="6">
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg6.jpg")}
                        ></img>
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg11.jpg")}
                        ></img>
                      </Col>
                      <Col md="6">
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg7.jpg")}
                        ></img>
                        <img
                          alt="..."
                          className="img-raised"
                          src={require("assets/img/bg8.jpg")}
                        ></img>
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
