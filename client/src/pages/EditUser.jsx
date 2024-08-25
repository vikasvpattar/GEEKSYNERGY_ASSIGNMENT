import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container } from "react-bootstrap";

const EditUser = () => {
  const { id } = useParams(); // Get user ID from route parameters
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    profession: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/users/${id}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Error fetching user data.");
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Prepare data to send, excluding newPassword if it's empty
      const updatedData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        profession: userData.profession,
        ...(userData.newPassword && { newPassword: userData.newPassword }), // Include newPassword only if it's provided
      };

      const response = await axios.patch(
        `http://localhost:5000/api/users/edit-user/${id}`,
        updatedData
      );

      if (response.status === 200) {
        alert("User updated successfully!");
        navigate("/home"); // Redirect to home or users page
      } else {
        alert("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user.");
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Edit User</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formName" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </Form.Group>

        <Form.Group controlId="formEmail" className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPhone" className="mb-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            name="phone"
            value={userData.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            required
          />
        </Form.Group>

        <Form.Group controlId="formProfession" className="mb-3">
          <Form.Label>Profession</Form.Label>
          <Form.Control
            type="text"
            name="profession"
            value={userData.profession}
            onChange={handleChange}
            placeholder="Enter your profession"
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter new password (leave blank if not changing)"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Update User
        </Button>
      </Form>

      <div className="mt-3 text-center">
        <p>
          <Link to="/home">Back to User List</Link>
        </p>
      </div>
    </Container>
  );
};

export default EditUser;
