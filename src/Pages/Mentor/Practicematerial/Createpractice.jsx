import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import {
  Container,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Avatar,
  Box,
  FormControl,
  InputLabel,
  Select,
  IconButton,
} from "@mui/material";
import Swal from "sweetalert2";
import ClearIcon from "@mui/icons-material/Clear"; // Import clear icon

const Createpractice = () => {
  const token = sessionStorage.getItem("token");

  // State for form fields
  const [batchList, setBatchList] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [formData, setFormData] = useState({
    materialname: "",
    materialdescription: "",
    batchId: "",
    studentId: "",
    materialimages: null,
  });

  // Fetch batch list and student list on component mount
  useEffect(() => {
    GetAllBatchList();
    GetStudentListAPI();
  }, []);

  const GetAllBatchList = async () => {
    try {
      const url = `${BASE_URL}/admin/getbatch`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers });
      setBatchList(response.data.data);
    } catch (error) {
      console.log("Error fetching batch list:", error);
    }
  };

  const GetStudentListAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers });
      if (response.data?.error === false) {
        setStudentList(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, materialimages: e.target.files[0] });
  };

  // Function to clear batch selection
  const handleClearBatch = () => {
    setFormData({ ...formData, batchId: "" });
  };

  // Function to clear student selection
  const handleClearStudent = () => {
    setFormData({ ...formData, studentId: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = `${BASE_URL}/admin/addpractice`;
      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const formDataToSend = new FormData();
      formDataToSend.append("materialname", formData.materialname);
      formDataToSend.append("materialdescription", formData.materialdescription);
      formDataToSend.append("batchId", formData.batchId);
      formDataToSend.append("studentId", formData.studentId);
      formDataToSend.append("materialimages", formData.materialimages);

      const response = await axios.post(url, formDataToSend, { headers });
      if (response.data.error === false) {
        Swal.fire({
          title: "Good job!",
          text: "Add Practice Material Successfully",
          icon: "success",
        });
        setFormData({
          materialname: "",
          materialdescription: "",
          batchId: "",
          studentId: "",
          materialimages: null,
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to add practice material",
        icon: "error",
      });
    }
  };

  return (
    <>
      <PageTitle page={"Add Practice Material"} />
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Material Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Material Name"
                name="materialname"
                value={formData.materialname}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Material Description */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Material Description"
                name="materialdescription"
                value={formData.materialdescription}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Batch Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Batch</InputLabel>
                <Select
                  label="Select Batch"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  endAdornment={
                    formData.batchId && (
                      <IconButton
                        size="small"
                        onClick={handleClearBatch}
                        sx={{ position: 'absolute', right: 30 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                >
                  {batchList.map((batch) => (
                    <MenuItem key={batch._id} value={batch._id}>
                      {batch.batchname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Student Selection */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Student</InputLabel>
                <Select
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  label="Select Student"
                  endAdornment={
                    formData.studentId && (
                      <IconButton
                        size="small"
                        onClick={handleClearStudent}
                        sx={{ position: 'absolute', right: 30 }}
                      >
                        <ClearIcon fontSize="small" />
                      </IconButton>
                    )
                  }
                  renderValue={(selected) => {
                    if (!selected) {
                      return <Typography>Select a student</Typography>;
                    }
                    const student = studentList.find((s) => s._id === selected);
                    return (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            mr: 2,
                            backgroundColor: "secondary.light",
                          }}
                        >
                          {student?.firstname?.charAt(0)}
                          {student?.lastname?.charAt(0)}
                        </Avatar>
                        <Typography>
                          {student?.firstname} {student?.lastname}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  {studentList.map((student) => (
                    <MenuItem key={student._id} value={student._id}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 30,
                            height: 30,
                            mr: 2,
                            backgroundColor: "secondary.light",
                          }}
                        >
                          {student.firstname.charAt(0)}
                          {student.lastname.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography>
                            {student.firstname} {student.lastname}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {student.enrollmentnumber}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* File Upload */}
            <Grid item xs={12} sm={6}>
              <Button variant="contained" component="label">
                Upload Material
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {formData.materialimages && (
                <Typography variant="body2" sx={{ marginTop: 1 }}>
                  {formData.materialimages.name}
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </>
  );
};

export default Createpractice;