import React, { useEffect, useState } from "react";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Studentlist = () => {
  const token = sessionStorage.getItem("token");
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    GetstudentAPI();
  }, []);

  const navigate = useNavigate();

  const GetstudentAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/getallstudent`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers: headers });
      setStudents(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = (student) => {
    setCurrentStudent({
      ...student,
      sameAddress: JSON.stringify(student.currentAddress) === JSON.stringify(student.permanentAddress)
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === 'checkbox') {
      setCurrentStudent(prev => ({
        ...prev,
        sameAddress: checked,
        permanentAddress: checked ? { ...prev.currentAddress } : prev.permanentAddress
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCurrentStudent(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCurrentStudent(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (type, field, value) => {
    setCurrentStudent(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const UpdateStudentDataAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/updatestudent/${currentStudent.id}`;
      
      // Prepare the data to send
      const dataToSend = {
        enrollmentnumber: currentStudent.enrollmentnumber,
        firstname: currentStudent.firstname,
        lastname: currentStudent.lastname,
        fathername: currentStudent.fathername,
        mothername: currentStudent.mothername,
        email: currentStudent.email,
        phone: currentStudent.phone,
        alternatephone: currentStudent.alternetphone,
        qualification: currentStudent.qualification,
        currentAddress: currentStudent.currentAddress,
        permanentAddress: currentStudent.permanentAddress
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }

      const response = await axios.put(url, dataToSend, { headers });
      
      if(response.data.error === false) {
        Swal.fire({
          title: "Success!",
          text: "Student updated successfully",
          icon: "success"
        });
      }
      
      handleClose();
      GetstudentAPI();
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Error updating student',
        severity: 'error'
      });
    }
  }

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleBuyClick = (row) => {
    navigate("/buynow", {
      state: {
        studentId: row.id,
        studentName: `${row.firstname} ${row.lastname}`,
        enrollmentNumber: row.enrollmentnumber,
      },
    });
  };

  const columns = [
    { field: "sr_no", headerName: "Sr. No", width: 50 },
    { field: "id", headerName: "ID", width: 90 },
    { field: "enrollmentnumber", headerName: "Enrollment Number", width: 150 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "fathername", headerName: "Father Name", width: 150 },
    { field: "mothername", headerName: "Mother Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "alternetphone", headerName: "Alternate Phone", width: 150 },
    { field: "qualification", headerName: "Qualification", width: 150 },
    { field: "currentAddress", headerName: "Current Address", width: 250 },
    { field: "permanentAddress", headerName: "Permanent Address", width: 250 },
    {
      field: "adharimage",
      headerName: "Aadhar Card",
      width: 150,
      renderCell: (params) => (
        <a
          href={`https://admin.voagelearning.com/${params.value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`https://admin.voagelearning.com/${params.value}`}
            alt="Aadhar Card"
            style={{ width: 50, height: 50, borderRadius: "50%", cursor: "pointer" }}
          />
        </a>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleOpen(params.row)}
            color="primary"
            aria-label="edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
             color="error"
            aria-label="edit"
            onClick={() => DeleteStudentAPI(params.row)}
           
          >
            <DeleteIcon />
           </IconButton>
        </Box>
      ),
    }
  ];

  const rows = students.map((student, index) => ({
    sr_no: index + 1,
    id: student._id,
    enrollmentnumber: student.enrollmentnumber,
    firstname: student.firstname,
    lastname: student.lastname,
    fathername: student.fathername,
    mothername: student.mothername,
    email: student.email,
    phone: student.phone,
    alternetphone: student.alternatephone,
    qualification: student.qualification,
    currentAddress: student.currentAddress
      ? `${student.currentAddress.addressline1},${student.currentAddress.addressline2}, ${student.currentAddress.city}, ${student.currentAddress.state},${student.permanentAddress.country},${student.permanentAddress.zip}`
      : "N/A",
    permanentAddress: student.permanentAddress
      ? `${student.permanentAddress.addressline1},${student.permanentAddress.addressline2}, ${student.permanentAddress.city}, ${student.permanentAddress.state},${student.permanentAddress.country},${student.permanentAddress.zip}`
      : "N/A",
    adharimage: student.adharimage || "N/A",
  }));


  // delete api 

const DeleteStudentAPI = async (educatorId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const url = `${BASE_URL}/admin/delstudent/${educatorId}`;
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.delete(url, { headers });
          console.log("Delete Student API", response.data);

          if(response.data.error === false) {
            Swal.fire(
              "Deleted!",
              "Student has been deleted.",
              "success"
            );
            // Refresh the educator list
            GetstudentAPI();
          } else {
            Swal.fire(
              "Error!",
              response.data.message || "Failed to delete student",
              "error"
            );
          }
        } catch (error) {
          console.log("Delete Student Error:", error);
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Something went wrong while deleting.",
            "error"
          );
        }
      }
    });
  };

  return (
    <>
      <PageTitle page={"Student List"} />
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>

      {/* Edit Dialog */}
      {currentStudent && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Edit Student Details</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Enrollment Number"
                    name="enrollmentnumber"
                    value={currentStudent.enrollmentnumber || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstname"
                    value={currentStudent.firstname || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastname"
                    value={currentStudent.lastname || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Father Name"
                    name="fathername"
                    value={currentStudent.fathername || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Mother Name"
                    name="mothername"
                    value={currentStudent.mothername || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={currentStudent.email || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={currentStudent.phone || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Alternate Phone"
                    name="alternetphone"
                    value={currentStudent.alternetphone || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Qualification"
                    name="qualification"
                    value={currentStudent.qualification || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>

                {/* Current Address */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Current Address</Typography>
                </Grid>
                {['addressline1', 'addressline2', 'city', 'state', 'country', 'zip'].map(field => (
                  <Grid item xs={12} sm={6} key={`current-${field}`}>
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      value={currentStudent.currentAddress[field] || ''}
                      onChange={(e) => handleAddressChange('currentAddress', field, e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                ))}

                {/* Same Address Checkbox */}
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={currentStudent.sameAddress}
                        onChange={handleChange}
                        name="sameAddress"
                        color="primary"
                      />
                    }
                    label="Permanent Address same as Current Address"
                  />
                </Grid>

                {/* Permanent Address (only show if not same as current) */}
                {!currentStudent.sameAddress && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Permanent Address</Typography>
                    </Grid>
                    {['addressline1', 'addressline2', 'city', 'state', 'country', 'zip'].map(field => (
                      <Grid item xs={12} sm={6} key={`permanent-${field}`}>
                        <TextField
                          fullWidth
                          label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                          value={currentStudent.permanentAddress[field] || ''}
                          onChange={(e) => handleAddressChange('permanentAddress', field, e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                    ))}
                  </>
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={UpdateStudentDataAPI} color="primary" variant="contained">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Studentlist;