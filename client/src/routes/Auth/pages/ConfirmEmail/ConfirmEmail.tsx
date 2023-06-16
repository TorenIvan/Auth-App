import { useQuery } from "@tanstack/react-query";
import { redirect } from "react-router-dom";
import { confirmEmailQuery } from "../../api/confirmEmail";

export function ConfirmEmail() {
  const params = new URLSearchParams(window.location.pathname);
  const verification_token = params.get("token");
  const { queryKey, queryFn } = confirmEmailQuery();

  const { status } = useQuery(queryKey, () => queryFn(verification_token));

  if (status === "loading") {
    <p>Confirmation is in progress...</p>;
  }
  if (status === "error") {
    redirect("../login");
  }
  if (status === "success") {
    redirect("../login");
  }

  return (
    <>
      {status === "error" && <p>Error fetching data</p>}
      {status === "loading" && <p>Fetching data...</p>}
      {status === "success" && <div></div>}
    </>
  );
}
