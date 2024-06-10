import React, { useContext } from "react";
import { Container, Row, Col, Card, CardBody, CardTitle, CardText } from "reactstrap";
import AppContext from "../components/context";

const Profile = () => {
  const { user } = useContext(AppContext);

  if (!user) return <p>Please log in to view your profile.</p>;

  return (
    <Container>
      <Row>
        <Col>
          <h1>User Profile</h1>
          <Card style={{ margin: "1rem 0" }}>
            <CardBody>
              <CardTitle>{user.username}</CardTitle>
              <CardText>
                <strong>Email:</strong> {user.email}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
