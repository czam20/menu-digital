import { useEffect, useState } from "react";
import getOrders from "./api/get-orders";
import { useSnapshot } from "valtio";
import authStore from "@/store/auth";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router";

function WaiterOrders() {
  const snapAuth = useSnapshot(authStore);
  const [orders, setOrders] = useState<any[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const getAllOrders = async () => {
      const data = await getOrders({
        restaurantId: snapAuth.user?.restaurant._id as string,
      });

      if (data.ok) {
        setOrders(data.data?.orders as any[]);
      }
    };

    getAllOrders();
  }, []);

  console.log(orders);

  return (
    <>
      <div className="w-full min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-4xl">Pedidos</h1>
          <IconArrowLeft
            onClick={() => {
              navigate("/home");
            }}
            role="button"
            stroke={2}
          />
          {orders.map((order, idx) => {
            return (
              <div
                key={idx}
                className="flex flex-col gap-4 w-96 border p-5 rounded-md"
                onClick={() => {
                  if(!order.confirmed){
                    navigate(`waiter/order/${order._id}`)
                  }
                }}
              >
                <p>Nombre Cliente: {order?.client?.fullname ?? "N/A"}</p>
                <p>Mesa: {order?.table ?? "N/A"}</p>
                <p>Confirmado: {order?.confirmed ? 'Si' : 'No'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default WaiterOrders;
