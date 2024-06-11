import { useParams } from "react-router";

function Menu() {
  const { restaurantId } = useParams();

  return <>Menu para restaranteId: {restaurantId}</>;
}

export default Menu;
