import type { handlerFunction } from "functions";
import { useQuery } from "@tanstack/react-query";
import { CreateHandlerType } from "handler";

const fetchData: CreateHandlerType<typeof handlerFunction> = async (
  body,
  path,
  method
) => {
  const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/${path}`, {
    method,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  return response.json();
};

const fetchGreeting = (name: string) => fetchData({ name }, "hello", "POST");

export const useFetchData = () =>
  useQuery({
    queryFn: () => fetchGreeting("Joe"),
    queryKey: ["hello"],
  });
