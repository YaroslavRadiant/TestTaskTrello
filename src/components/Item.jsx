import React, { useState, useRef, memo } from "react";
import { useDrag, useDrop } from "react-dnd";
import Window from "./Window";
import ITEM_TYPE from "../data/types";

const Item = memo(({ item, index, status, swapItemsById }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver({ shallow: true }),
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;

      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoveredRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2;
      const mousePosition = monitor.getClientOffset();
      const hoverClientY = mousePosition.y - hoveredRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      swapItemsById(dragIndex, hoverIndex, item.status);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { type: ITEM_TYPE, ...item, index },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [show, setShow] = useState(false);

  const onOpen = () => setShow(true);

  const onClose = () => setShow(false);

  drag(drop(ref));

  return (
    <div
      className="flex mt-1"
      style={{
        width: "100%",
        opacity: isDragging ? 0 : 1,
        background: isDragging ? "none" : "",
      }}
      ref={ref}
    >
      <div style={{ width: "100%" }}>
        <div
          className="text-base mb-3 p-4 rounded-md z-10 bg-white box-border"
          onClick={onOpen}
          style={{ width: "100%" }}
        >
          <div
            className={` w-12 h-2 rounded-2xl`}
            style={{ backgroundColor: status.color }}
          />
          <div className="flex justify-between">
            <p className="font-semibold text-lg">{item.content}</p>
            <p className="text-right">{item.icon}</p>
          </div>
        </div>
        <Window item={item} onClose={onClose} show={show} />
      </div>
    </div>
  );
});

export default Item;
