import React, { useState } from "react";
import { useDrop } from "react-dnd";
import ITEM_TYPE from "../data/types";

import { useApolloClient } from "@apollo/client";
import { GET_ITEMS } from "../apollo/queries";

const sortOptions = ["custom", "content", "date"];

const DropWrapper = ({ onDrop, children, status }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectValue, setSelectValue] = useState("custom");

  const client = useApolloClient();

  const { statuses } = client.readQuery({ query: GET_ITEMS });

  const handleAddItem = (text) => {
    const newItem = {
      id: Math.floor(Math.random() * (1000000 - 1 + 1)) + 1,
      status: status,
      content: text,
      title: "New item!!",
      date: Date.now(),
    };

    const updatedStatuses = statuses.map((statusItem) => {
      if (statusItem.status === status) {
        return {
          ...statusItem,
          items: [...statusItem.items, newItem],
        };
      }
      return statusItem;
    });

    client.writeQuery({
      query: GET_ITEMS,
      data: { statuses: updatedStatuses },
    });
  };

  const handleOnClick = () => {
    handleAddItem(inputValue);
    setIsAdding(false);
    setInputValue("");
  };

  const handleCancel = () => {
    setIsAdding(false);
    setInputValue("");
  };

  const handleChangeValue = (e) => {
    setSelectValue(e.target.value);
  };

  const handleSortRow = (sortType, rowStatus) => {
    const updatedData = [
      ...statuses.map((status) => {
        if (status.status === rowStatus) {
          if (sortType === "custom") {
            return status;
          } else if (sortType === "date") {
            return {
              ...status,
              items: status.items.slice().sort((a, b) => a.date - b.date),
            };
          } else if (sortType === "content") {
            return {
              ...status,
              items: status.items
                .slice()
                .sort((a, b) => a.content.length - b.content.length),
            };
          }
        }
        return status;
      }),
    ];

    const newData = {
      statuses: updatedData,
    };

    client.writeQuery({
      query: GET_ITEMS,
      data: newData,
    });
  };

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    drop: (item) => {
      onDrop(item.id, item.status, status);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div ref={drop} className="min-h-80">
      <div className="flex items-center mt-5 mb-5">
        <select
          className="w-full border-none rounded-md"
          value={selectValue}
          onChange={(e) => handleChangeValue(e)}
        >
          {sortOptions.map((el) => (
            <option key={el}>{el}</option>
          ))}
        </select>
        <button
          className="h-10 w-20 text-black bg-white border-none ml-4"
          onClick={() => handleSortRow(selectValue, status)}
        >
          Sort
        </button>
      </div>

      {React.cloneElement(children)}
      {isAdding ? (
        <div className="flex" style={{ height: "26px" }}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="mr-2 border-none w-40 rounded-md h-10"
          />
          <button
            className="border-none bg-white text-black w-14 mr-2 h-10"
            onClick={handleOnClick}
          >
            Add
          </button>
          <button
            className="border-none bg-white text-black w-20 h-10"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          className="w-full text-black border-dashed border-1 border-black mt-2"
          onClick={() => setIsAdding(true)}
        >
          Add item
        </button>
      )}
    </div>
  );
};

export default DropWrapper;
