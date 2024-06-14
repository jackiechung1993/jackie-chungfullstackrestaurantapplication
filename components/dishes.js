import { useRouter } from "next/router";
import { gql, useQuery } from '@apollo/client';
import { useState, useContext } from 'react';
import AppContext from "./context";
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col
} from "reactstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const GET_RESTAURANT_DISHES = gql`
  query($id: ID!, $name: String) {
    restaurant(id: $id) {
      id
      name
      dishes(where: { name_contains: $name }) {
        id
        name
        description
        price
        image {
          url
        }
      }
    }
  }
`;

function Dishes({ restId, search }) {
  const { addItem } = useContext(AppContext);
  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { id: restId, name: search },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.restaurant) return <p>No Dishes Found</p>;

  const restaurant = data.restaurant;

  return (
    <Row>
      {restaurant.dishes.map((dish) => (
        <Col xs="6" sm="4" style={{ padding: 0 }} key={dish.id}>
          <Card style={{ margin: "0 10px" }}>
            <CardImg
              top={true}
              style={{ height: 150, width: 150 }}
              src={dish.image ? `${API_URL}${dish.image.url}` : '/default-image.png'}
            />
            <CardBody>
              <CardTitle>{dish.name}</CardTitle>
              <CardText>{dish.description}</CardText>
            </CardBody>
            <div className="card-footer">
              <Button
                color="info"
                outline
                onClick={() => addItem(dish)}
              >
                + Add To Cart
              </Button>
            </div>
          </Ca
