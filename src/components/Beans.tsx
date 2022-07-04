import { ReactNode } from "react";

type BeansColor = "green" | "red" | "gold";

export const Beans = ({ color, children }: { color: BeansColor; children: ReactNode }) => {
  const colors = {
    green: `from-green-800 to-green-600`,
    red: `from-red-800 to-red-400`,
    gold: `from-yellow-800 to-yellow-400`,
  };
  return <span className={`beans ${colors[color]}`}>{children}</span>;
};

export const BeanServerError = () => {
  return <Beans color="red">Ooops! Try again later.</Beans>;
};

export const BeanLoading = () => {
  return <Beans color="green">Loading...</Beans>;
};

export function createCustomerBeanColor(status: string | undefined) {
  switch (true) {
    case status === "ACTIVE": {
      return "green";
    }
    case status === "LEAD": {
      return "gold";
    }
    case status === "NON_ACTIVE": {
      return "red";
    }
    default: {
      console.log(`Missing CustomerStatus case with "${status}"`);
      return "green";
    }
  }
}

export function createSalesRecordBeanColor(status: string | undefined) {
  switch (true) {
    case status === "NEW": {
      return "green";
    }
    case status === "CLOSED_WON": {
      return "gold";
    }
    case status === "CLOSED_LOST": {
      return "red";
    }
    default: {
      console.log(`Missing CustomerStatus case with "${status}"`);
      return "green";
    }
  }
}
