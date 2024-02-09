import React from "react";
import Homepage from "./pages/Homepage";
import Header from "./components/Header";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ApolloProvider } from "@apollo/client";
import client from "./apollo/apolloClient";

const App = () => {
  return (
    <ApolloProvider client={client}>
      <DndProvider backend={HTML5Backend}>
        <Header />
        <Homepage />
      </DndProvider>
    </ApolloProvider>
  );
};

export default App;
