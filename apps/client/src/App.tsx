import { useFetchData } from "./api/fetchData";

function App() {
  const { data, isLoading, isError } = useFetchData();

  if (isError) return <div>Error</div>;
  if (isLoading) return <div>Loading...</div>;

  return <div>{data.msg}</div>;
}

export default App;
