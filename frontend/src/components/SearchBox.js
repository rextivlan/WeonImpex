import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

const SearchBox = ({ history }) => {
  const [keyword, setKeyword] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      history.push(`/search/${keyword}`);
    } else {
      history.push("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} inline>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search Products..."
          aria-label="Search Products"
          aria-describedby="button-addon2"
        />
        <Button
          className="btn py-2"
          variant="outline-success"
          type="submit"
          id="button-addon2"
        >
          Search
        </Button>
      </div>
    </Form>
  );
};

export default SearchBox;
