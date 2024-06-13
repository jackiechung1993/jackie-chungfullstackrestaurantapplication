import { gql, useQuery } from '@apollo/client';
import Dishes from "./dishes";
import { useContext, useState } from 'react';
import AppContext from "./context";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  Container,
  Row,
  Col
} from "reactstrap";

const GET_RESTAURANTS = gql`
  query($name: String!) {
    restaurants(where: { name_contains: $name }) {
      id
      name
      description
      image {
        url
      }
    }
  }
`;

function RestaurantList({ search }) {
  const [restaurantID, setRestaurantID] = useState(0);
  const { cart } = useContext(AppContext);

  const { loading, error, data } = useQuery(GET_RESTAURANTS, {
    variables: { name: search },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || data.restaurants.length === 0) return <p>No Restaurants Found</p>;

  const filteredRestaurants = data.restaurants.filter((res) =>
    res.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderDishes = (restaurantID, searchQuery) => {
    return <Dishes restId={restaurantID} search={searchQuery} />;
  };

  const restaurantList = filteredRestaurants.map((res) => (
    <Col xs="6" sm="4" key={res.id}>
      <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
        <CardImg
          top={true}
          style={{ height: 200 }}
          src={res.image && res.image.url ? `http://localhost:1337${res.image.url}` : '/default-image.png'}
          />
        <CardBody>
          <CardText>{res.description}</CardText>
        </CardBody>
        <div className="card-footer">
          <Button color="info" onClick={() => setRestaurantID(res.id)}>
            {res.name}
          </Button>
        </div>
      </Card>
    </Col>
  ));

  return (
    <Container>
      <Row xs="3">
        {restaurantList}
      </Row>
      <Row xs="3">
        {restaurantID > 0 && renderDishes(restaurantID, search)}
      </Row>
    </Container>
  );
}

export default RestaurantList;
