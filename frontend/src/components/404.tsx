import { Link } from "react-router-dom";
export default function Er404() {
  return (
    <div className="h-full w-full">
      <div className="bg-emerald-8 p-4 w-[80%] mx-auto mt-10">
        <h2>This link does not exist.</h2>
      <h2>You probably doing something wrong.</h2>{" "}
      <h2>
        Go <Link to="/" className="color-amber-4">Home</Link>
      </h2>
      </div>
      
    </div>
  );
}
