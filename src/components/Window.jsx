import React, { useState } from "react";
import Modal from "react-modal";

import TrashIcon from "../assets/TrashIcon";
import { useApolloClient } from "@apollo/client";
import { GET_ITEMS } from "../apollo/queries";

Modal.setAppElement("#root");

const Window = ({ show, onClose, item }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [inputsValue, setInputsValue] = useState(item);

  const client = useApolloClient();
  const { statuses } = client.readQuery({ query: GET_ITEMS });

  const handleChangeInputsValue = (e, field) => {
    setInputsValue({ ...inputsValue, [field]: e.target.value });
  };

  const handleChangeSelect = (event) => {
    setInputsValue({ ...inputsValue, status: event.target.value });
  };

  const handleUpdateItemStatus = (newItem, oldStatus) => {
    if (!newItem || !newItem.id || !newItem.status || !oldStatus) {
      return;
    }

    const oldIndex = statuses.findIndex(
      (status) => status.status === oldStatus
    );

    if (oldIndex === -1) {
      return;
    }

    const newIndex = statuses.findIndex(
      (status) => status.status === newItem.status
    );

    if (newIndex === -1) {
      return;
    }

    let updatedOldItems;
    let updatedNewItems;
    let newData;

    if (newItem.status !== oldStatus) {
      updatedOldItems = statuses[oldIndex].items.filter(
        (item) => item.id !== newItem.id
      );

      updatedNewItems = [...statuses[newIndex].items, newItem];

      newData = statuses.map((status, index) => {
        if (index === oldIndex) {
          return { ...status, items: updatedOldItems };
        }
        if (index === newIndex) {
          return { ...status, items: updatedNewItems };
        }
        return status;
      });
    } else {
      updatedOldItems = statuses[oldIndex].items.map((item) =>
        item.id === newItem.id ? newItem : item
      );

      newData = statuses.map((status, index) => {
        if (index === oldIndex) {
          return { ...status, items: updatedOldItems };
        }

        return status;
      });
    }

    client.writeQuery({
      query: GET_ITEMS,
      data: { statuses: newData },
    });
  };

  const handleDeleteItem = (id, status) => {
    const updatedStatuses = statuses.map((statusItem) => {
      if (statusItem.status === status) {
        return {
          ...statusItem,
          items: statusItem.items.filter((item) => item.id !== id),
        };
      }
      return statusItem;
    });

    client.writeQuery({
      query: GET_ITEMS,
      data: { statuses: updatedStatuses },
    });
  };

  return (
    <Modal
      isOpen={show}
      onRequestClose={onClose}
      className="modal"
      overlayClassName="overlay"
    >
      {isEditMode ? (
        <>
          <div>
            <div className="flex justify-between">
              <div className="flex items-start">
                <label className="w-24">Title</label>
                <input
                  value={inputsValue.title}
                  onChange={(e) => handleChangeInputsValue(e, "title")}
                  className="px-2 py-1 rounded-md border-none w-40"
                />
              </div>

              <button
                className="text-black text-4xl h-40px w-35px border-none rounded-25px hover:bg-#dcdcdc"
                onClick={onClose}
              >
                &#215;
              </button>
            </div>
            <div className="flex items-center mb-6">
              <label className="w-24">Description</label>
              <input
                value={inputsValue.content}
                onChange={(e) => handleChangeInputsValue(e, "content")}
                className="px-2 py-1 rounded-md border-none w-40"
              />
            </div>

            <div className="flex items-center">
              <label className="w-24">Status</label>
              <select
                value={inputsValue.status}
                onChange={handleChangeSelect}
                className="h-10 w-48"
              >
                {statuses.map((el) => (
                  <option key={el.status} value={el.status}>
                    {el.status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-between mt-5">
              <button
                onClick={() => {
                  handleUpdateItemStatus(inputsValue, item.status);
                  setIsEditMode(false);
                }}
                className="border-none flex items-center text-base text-black"
              >
                Save
              </button>
              <button
                onClick={() => handleDeleteItem(item.id, item.status)}
                className="border-none flex items-center text-base text-black"
              >
                <span className="mr-2">Delete item</span>
                <TrashIcon />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <h1 className="text-xl">{item.title}</h1>
            <button
              className="text-black text-4xl h-40px w-35px border-none rounded-25px hover:bg-#dcdcdc"
              onClick={onClose}
            >
              &#215;
            </button>
          </div>
          <div>
            <h2 className="text-xl">Description</h2>
            <p>{item.content}</p>

            <h2 className="text-xl">Status</h2>
            <p>
              {item.icon}
              {`${item.status.charAt(0).toUpperCase()}${item.status.slice(1)}`}
            </p>
            <div className="flex justify-between mt-5">
              <button
                onClick={() => setIsEditMode(true)}
                className="border-none flex items-center text-base text-black"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteItem(item.id, item.status)}
                className="border-none flex items-center text-base text-black"
              >
                <span className="mr-2">Delete item</span>
                <TrashIcon />
              </button>
            </div>
          </div>
        </>
      )}
    </Modal>
  );
};

export default Window;
