import React from "react";
import { useApolloClient, useQuery } from "@apollo/client";
import { GET_ITEMS } from "../apollo/queries";

import Item from "../components/Item";
import DropWrapper from "../components/DropWrapper";
import Col from "../components/Col";

const Homepage = () => {
  const client = useApolloClient();

  const { data } = useQuery(GET_ITEMS);

  const handleUpdateItemStatus = (itemId, currentStatus, newStatus) => {
    if (!itemId || !currentStatus) {
      return;
    }
    if (currentStatus === newStatus) {
      return;
    }
    const currentIndex = data.statuses.findIndex(
      (status) => status.status === currentStatus
    );

    const itemToMove = data.statuses[currentIndex].items.find(
      (item) => item.id === itemId
    );
    const newItem = { ...itemToMove, status: newStatus };

    if (newItem) {
      const updatedItemsInCurrentStatus = data.statuses[
        currentIndex
      ].items.filter((item) => item.id !== itemId);

      const newIndex = data.statuses.findIndex(
        (status) => status.status === newStatus
      );

      if (newIndex !== -1) {
        const updatedItemsInNewStatus = [
          ...data.statuses[newIndex].items,
          newItem,
        ];

        const newData = data.statuses.map((status, index) => {
          if (index === currentIndex) {
            return { ...status, items: updatedItemsInCurrentStatus };
          } else if (index === newIndex) {
            return { ...status, items: updatedItemsInNewStatus };
          } else {
            return status;
          }
        });

        client.writeQuery({
          query: GET_ITEMS,
          data: { statuses: newData },
        });
      }
    }
  };

  const handleSwapItemsById = (dragIndex, hoverIndex, itemsStatus) => {
    const statusIndex = data.statuses.findIndex(
      (variants) => variants.status === itemsStatus
    );

    const updatedItems = [...data.statuses[statusIndex].items];

    const temp = updatedItems[dragIndex];

    if (!updatedItems[dragIndex] || !updatedItems[hoverIndex]) {
      return;
    }
    updatedItems[dragIndex] = updatedItems[hoverIndex];
    updatedItems[hoverIndex] = temp;

    const updatedStatuses = [...data.statuses];

    updatedStatuses[statusIndex] = {
      ...updatedStatuses[statusIndex],
      items: updatedItems,
    };

    client.writeQuery({
      query: GET_ITEMS,
      data: { statuses: updatedStatuses },
    });
  };

  return (
    <div className="flex justify-center">
      {data.statuses.map((s) => {
        return (
          <div key={s.status} className="flex flex-col m-4 p-4 rounded-lg">
            <div className="flex justify-between">
              <h2 className="text-center text-xl" style={{ color: s.color }}>
                {s.status.toUpperCase()}
              </h2>
            </div>
            <DropWrapper onDrop={handleUpdateItemStatus} status={s.status}>
              <Col>
                {s.items
                  .filter((i) => i.status === s.status)
                  .map((i, idx) => (
                    <Item
                      key={i.id}
                      item={i}
                      index={idx}
                      swapItemsById={handleSwapItemsById}
                      status={s}
                    />
                  ))}
              </Col>
            </DropWrapper>
          </div>
        );
      })}
    </div>
  );
};

export default Homepage;
