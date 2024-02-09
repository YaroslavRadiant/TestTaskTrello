import { ApolloClient, InMemoryCache } from "@apollo/client";
import { GET_ITEMS } from "./queries";

const client = new ApolloClient({
  cache: new InMemoryCache(),
});

const initialData = {
  statuses: [
    {
      status: "open",
      color: "#EB5A46",
      items: [
        {
          id: 1,
          status: "open",
          title: "Human Interest Form",
          content: "Fill out human interest distribution form",
          date: 1,
        },
        {
          id: 2,
          status: "open",
          title: "Purchase present",
          content: "Get an anniversary gift",
          date: 2,
        },
        {
          id: 3,
          status: "open",
          title: "Invest in investments",
          content: "Call the bank to talk about investments",
          date: 3,
        },
      ],
    },
    {
      status: "in progress",
      color: "#CC397B",
      items: [
        {
          id: 5,
          status: "in progress",
          title: "Purchase present",
          content: "Get an anniversary gift",
          date: 1,
        },
      ],
    },
    {
      status: "in review",
      color: "#C377E0",
      items: [
        {
          id: 6,
          status: "in review",
          title: "Purchase present",
          content: "Get an anniversary gift",
          date: 1,
        },
      ],
    },
    {
      status: "done",
      color: "#3981DE",
      items: [
        {
          id: 7,
          status: "done",
          title: "Purchase present",
          content: "Get an anniversary gift",
          date: 1,
        },
      ],
    },
  ],
};

client.writeQuery({
  query: GET_ITEMS,
  data: initialData,
});

export default client;
