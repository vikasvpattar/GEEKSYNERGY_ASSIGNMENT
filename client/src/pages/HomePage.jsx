import React, { useState, useEffect } from "react";
import { Button, ListGroup, Container } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  // Handle Edit button click
  const handleEdit = (userId) => {
    navigate(`/edit-user/${userId}`);
  };

  // Handle Delete button click
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      // Update the list of users after deletion
      setUsers(users.filter((user) => user._id !== userId));
      alert("Successfully deleted the user");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Users</h2>
      {users.length === 0 ? (
        <p className="text-center">No users found.</p>
      ) : (
        <ListGroup>
          {users.map((user) => (
            <ListGroup.Item
              key={user._id}
              className="d-flex justify-content-between align-items-center"
            >
              <span>{user.name}</span>
              <div>
                <Button
                  variant="warning"
                  onClick={() => handleEdit(user._id)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(user._id)}>
                  Delete
                </Button>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default Home;
