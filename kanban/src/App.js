import React, { useState, useEffect } from "react";
import dicon from "./Logos/3.png"
import plus from "./Logos/plus.png"
import dot from "./Logos/dot.jpg"
import low from "./Logos/lowP.jpg"
import nop from "./Logos/no_priority.jpg"
import medium from "./Logos/mediumP.jpg"
import high from "./Logos/highP.jpg"
import urgent from "./Logos/urgent.jpg"
import todo from "./Logos/todo.png";
import inprog from "./Logos/inp.jpg"
import backlog from "./Logos/backlog.jpg"
import done from "./Logos/done.png"
import user from "./Logos/mine.jpg"
import "./App.css";

const App = () => {
  const [displayOptions, setDisplayOptions] = useState(false);
  const [groupingOption, setGroupingOption] = useState("status");
  const [orderingOption, setOrderingOption] = useState("priority");
  const [data, setData] = useState({ tickets: [], users: [] });
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.quicksell.co/v1/internal/frontend-assignment"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData);
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
  
    const handleOutsideClick = (e) => {
      if (
        displayOptions &&
        !e.target.closest(".dropdown") &&
        e.target.className !== "dropdown-button" &&
        e.target.className !== "box-text"
      ) {
        setDisplayOptions(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [displayOptions]);


   const getPriorityName = (priorityValue) => {
     switch (priorityValue) {
       case 4:
         return "Urgent";
       case 3:
         return "High";
       case 2:
         return "Medium";
       case 1:
         return "Low";
       case 0:
         return "No priority";
       default:
         return "";
     }
  };

  const icon = {};
  icon["In progress"] = inprog;
  icon["Done"] = done;
  icon["Backlog"] = backlog;
  icon["Todo"] = todo;
  icon["Urgent"] = urgent;
  icon["High"] = high;
  icon["Medium"] = medium;
  icon["Low"] = low;
  icon["No priority"] = nop;


  const groupTickets = () => {
    switch (groupingOption) {
      case 'status':
        const groupedByStatus = {};
        data.tickets.forEach((item) => {
          const key = item[groupingOption];
          if (!groupedByStatus[key]) {
            groupedByStatus[key] = [];
          }
          groupedByStatus[key].push(item);
        });
        return groupedByStatus;
      case 'name':
          const groupedByUser = {};

        data.users.forEach((user) => {
          const userTickets = data.tickets.filter((ticket) => ticket.userId === user.id);

          if (userTickets.length > 0) {
          groupedByUser[user.name] = userTickets;
    }
  });

  return groupedByUser;

      case 'priority':
        const groupedByPriority = {};
        data.tickets.forEach((item) => {
          const priorityName = getPriorityName(item.priority);
          if (!groupedByPriority[priorityName]) {
            groupedByPriority[priorityName] = [];
          }
          groupedByPriority[priorityName].push(item);
        });
        return groupedByPriority;
      default:
        return {};
    }
  };

  const sortTickets = (tickets) => {
    const sortedTickets = [...tickets];
    if (orderingOption === "priority") {
      sortedTickets.sort((a, b) => b.priority - a.priority);
    } else if (orderingOption === "title") {
      sortedTickets.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sortedTickets;
  };

  

  const renderGroupedTickets = () => {
    const groupedTickets = groupTickets();

    if (!Object.keys(groupedTickets).length) {
      console.log("No data to display");
      return <p>No data to display</p>;
    }
    if (icon[Object.keys(groupedTickets).key] == null) icon[Object.keys(groupedTickets).key] = user;

    return (
      <div className="result-container">
        {Object.keys(groupedTickets).map((key) => (
          <div key={key} className="result-column">
            <div className="status-box">
              {icon[key] != null ? (
                <img
                  style={{
                    height: "10px",
                    marginRight: "1rem",
                    cursor: "pointer",
                    width: "0.5cm",
                    borderRadius: "50%",
                  }}
                  src={icon[key]}
                  alt=""
                />
              ) : (
                <img
                  style={{
                    height: "10px",
                    marginRight: "1rem",
                    cursor: "pointer",
                    borderRadius: "50%",
                  }}
                  src={user}
                  alt=""
                />
              )}
              <h3
                style={{ margin: "0", display: "flex", alignItems: "center" }}
              >
                {key} ({groupedTickets[key].length})
              </h3>
              <img
                style={{
                  height: "25px",
                  marginLeft: "0.5rem",
                  marginRight: "0.5rem",
                  cursor: "pointer",
                }}
                src={plus}
                alt=""
              />
              <img
                style={{ height: "5px", cursor: "pointer" }}
                src={dot}
                alt=""
              />
            </div>
            <ul>
              {sortTickets(groupedTickets[key]).map((item) => (
                <li key={item.id} className="result-item">
                  <p className="id">{item.id}</p>
                  <p className="title">{item.title}</p>
                  <div className="tag-container">
                    <p className="tag">
                      <span class="dot"></span>
                      {item.tag.join(", ")}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="navbar">
        <div className="dropdown">
          <button
            className="dropdown-button"
            onClick={() => setDisplayOptions(!displayOptions)}
          >
            <div className="disp">
              <img
                src={dicon}
                alt=""
                style={{ height: "12px", margin: "3px 5px" }}
              />
              <div className="box-text">Display</div>
              <div className="dropdown-symbol">&#9660;</div>
            </div>
          </button>
          {displayOptions && (
            <div className="box-content">
              {/* Grouping row */}
              <div className="box-row">
                <p className="box-text">Grouping</p>
                <select
                  className="box-dropdown"
                  value={groupingOption}
                  onChange={(e) => setGroupingOption(e.target.value)}
                >
                  <option value="status">By Status</option>
                  <option value="name">By User</option>
                  <option value="priority">By Priority</option>
                </select>
              </div>

              {/* Ordering row */}
              <div className="box-row">
                <p className="box-text">Ordering</p>
                <select
                  className="box-dropdown"
                  value={orderingOption}
                  onChange={(e) => setOrderingOption(e.target.value)}
                >
                  <option value="priority">By Priority</option>
                  <option value="title">By Title</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>
      {renderGroupedTickets()}
    </div>
  );
};

export default App;
