import { Form } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Contact() {
  const { name, lastname } = useParams();
  const contact = {
    first: name,
    last: lastname,
    avatar: "https://placekitten.com/g/200/200",
    twitter: "your_handle",
    notes: "Some notes",
    favorite: true,
  };

  return (
    <div> {name} - {lastname} </div>
  );
}