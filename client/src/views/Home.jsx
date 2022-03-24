import axios from "axios";
import React, { useEffect, useState, createElement } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { Switch, Route, Link } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Home = (props) => {
  const [dbtest, setDbtest] = useState({ assignment: "none", port: 0 });
  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
  });
  const [fromDb, setFromDb] = useState([]);
  const history = useHistory();
  // history.push(`/${category}/${detail}`);

  useEffect(() => {
    p("useEffect Running");

    axios
      .get("http://localhost:9000/api")
      .then((res) => {
        // console.log(res);
        setDbtest(res.data);
      })
      .catch((err) => console.log(err));

    updateFromDb();
  }, []);

  const p = (a) => {
    console.log(a);
  };

  const updateFromDb = () => {
    axios
      .get("http://localhost:9000/api/pm/")
      .then((res) => {
        console.log(res.data);
        setFromDb(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    // p("onSubmitHandler");

    axios
      .post("http://localhost:9000/api/pm/create", form)
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));

    // p(event.target.value);
    updateFromDb();
  };

  const onChangeHandler = (event) => {
    event.preventDefault();

    // p(event.target.value);
    const newState = {
      ...form,
      [event.target.name]: event.target.value,
    };
    setForm(newState);
  };

  const onDeleteHandler = (_id, arrIndex, name) => {
    if (
      window.confirm(`Are you sure you want to delete item ${name}?`)
    ) {
      console.log("inside on click delete");
      axios
        .delete(`http://localhost:9000/api/pm/delete/${_id}`)
        .then((res) => {
          console.log(res.data);
          const copyState = [...fromDb];
          copyState.splice(arrIndex, 1);
          setFromDb(copyState);
        })
        .catch((err) => console.log(err));
    }
  };

  const FloatLabel = (() => {
    // add active class
    const handleFocus = (e) => {
      const target = e.target;
      target.parentNode.classList.add("active");
      target.setAttribute(
        "placeholder",
        target.getAttribute("data-placeholder")
      );
    };

    // remove active class
    const handleBlur = (e) => {
      const target = e.target;
      if (!target.value) {
        target.parentNode.classList.remove("active");
      }
      target.removeAttribute("placeholder");
    };

    // register events
    const bindEvents = (element) => {
      const floatField = element.querySelector("input");
      floatField.addEventListener("focus", handleFocus);
      floatField.addEventListener("blur", handleBlur);
    };

    // get DOM elements
    const init = () => {
      const floatContainers = document.querySelectorAll(".float-container");

      floatContainers.forEach((element) => {
        if (element.querySelector("input").value) {
          element.classList.add("active");
        }

        bindEvents(element);
      });
    };

    return {
      init: init,
    };
  })();

  FloatLabel.init();

  return (
    <>
      <form onSubmit={onSubmitHandler} className="box3">
        <div id="floatContainer" className="float-container">
        <label style={{position: "absolute", zIndex: 1}} htmlFor="description">Title</label>
        <input style={{position: "relative", zIndex: 2}}
            autoFocus="autofocus"
            id="floatField"
            type="text"
            name="title"
            onChange={onChangeHandler}
            
            // placeholder=""
            // default="asdf"
          />
        </div>
        <div id="floatContainer" className="float-container">
        <label style={{position: "absolute", zIndex: 1}} htmlFor="description">Price</label>
          <input style={{position: "relative", zIndex: 2}}
            id="floatField"
            type="text"
            name="price"
            onChange={onChangeHandler}
          />
        </div>
        <div id="floatContainer" className="float-container">
          <label style={{position: "absolute", zIndex: 1}} htmlFor="description">Description</label>
          <input style={{position: "relative", zIndex: 2}}
            id="floatField"
            type="text"
            name="description"
            onChange={onChangeHandler}
            // placeholder="aegag"
            // default="hi"
            // value={value == null ? "" : value}
          />
        </div>
        <input type="submit" className="btn btn-primary mx-4" />
      </form>

      <div className="box">
        <table className="table table-sm table-hover ">
          <thead>
            <tr>
              {/* <th>ID</th> */}
              {/* <th>#</th> */}
              <th>Title</th>
              <th>Price</th>
              {/* <th>Description</th> */}
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {fromDb.map((item, i) => {
              // console.log(`function run ${i}, item: ${item.title}`);
              return (
                <tr key={i}>
                  {/* <td>{item._id}</td> */}
                  {/* <td>{i + 1}</td> */}
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  {/* <td>{item.description}</td> */}
                  <td>
                    <Link to={`/${item._id}`}>
                      <button className="btn btn-secondary btn-sm">View</button>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/${item._id}/edit`}>
                      <button className="btn btn-success btn-sm">Edit</button>
                    </Link>
                  </td>
                  <td>
                    <Link to={`/`}>
                      <button
                        onClick={() => onDeleteHandler(item._id, i, item.title)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="box2">
        <p>from Form:</p>
        <div className="box">
          <div className="box2">
            <p>{form.title}</p>
          </div>
          <div className="box2">
            <p>{form.price}</p>{" "}
          </div>
          <div className="box2">
            <p>{form.description}</p>{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
