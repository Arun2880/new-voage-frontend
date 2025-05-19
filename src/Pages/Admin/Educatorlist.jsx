import React, { useEffect, useState } from 'react'
import PageTitle from '../../components/PageTitle'
import { DataGrid } from "@mui/x-data-grid";
import BASE_URL from '../../config';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Box,
  Grid,
  FormControlLabel,
  Checkbox,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const Educatorlist = () => {
  const token = sessionStorage.getItem("token");
  const [educators, seteducators] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentEducator, setCurrentEducator] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    Geteducators();
  }, [])

  const Geteducators = async () => {
    try {
      const url = `${BASE_URL}/admin/getalleducator`;

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }

      const response = await axios.get(url, { headers: headers });
      seteducators(response.data.data);
    }
    catch (error) {
      console.log(error);
    }
  }

  const handleOpen = (educator) => {
    setCurrentEducator({
      ...educator,
      sameAddress: JSON.stringify(educator.currentAddress) === JSON.stringify(educator.permanentAddress)
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    if (type === 'checkbox') {
      setCurrentEducator(prev => ({
        ...prev,
        sameAddress: checked,
        permanentAddress: checked ? { ...prev.currentAddress } : prev.permanentAddress
      }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCurrentEducator(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCurrentEducator(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAddressChange = (type, field, value) => {
    setCurrentEducator(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value
      }
    }));
  };

  const handleBankChange = (field, value) => {
    setCurrentEducator(prev => ({
      ...prev,
      Bank: {
        ...prev.Bank,
        [field]: value
      }
    }));
  };

  const UpdateEducatorAPI = async () => {
    try {
      const url = `${BASE_URL}/admin/updateeducator/${currentEducator.id}`;
      
      const dataToSend = {
        firstname: currentEducator.firstname,
        lastname: currentEducator.lastname,
        email: currentEducator.email,
        phone: currentEducator.phone,
        qualification: currentEducator.qualification,
        currentAddress: currentEducator.currentAddress,
        permanentAddress: currentEducator.permanentAddress,
        Bank: currentEducator.Bank
      };

      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      }

      const response = await axios.put(url, dataToSend, { headers });
      console.log("Educator updated successfully",response.data);
     if(response.data.error==false){
      Swal.fire({
        title: "Good job!",
        text: "Educator Updated Successfully",
        icon: "success"
      });
     }
      
      handleClose();
      Geteducators();
    }
    catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: 'Error updating educator',
        severity: 'error'
      });
    }
  }

  const DeleteEducatorAPI = async (educatorId) => {
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
          const url = `${BASE_URL}/admin/deleducator/${educatorId}`;
          const headers = {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          };

          const response = await axios.delete(url, { headers });
          console.log("Delete Educator API", response.data);

          if(response.data.error === false) {
            Swal.fire(
              "Deleted!",
              "Educator has been deleted.",
              "success"
            );
            // Refresh the educator list
            Geteducators();
          } else {
            Swal.fire(
              "Error!",
              response.data.message || "Failed to delete educator",
              "error"
            );
          }
        } catch (error) {
          console.log("Delete Educator Error:", error);
          Swal.fire(
            "Error!",
            error.response?.data?.message || "Something went wrong while deleting.",
            "error"
          );
        }
      }
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const columns = [
    { field: "sr_no", headerName: "Sr.No", width: 50 },
    { field: "id", headerName: "ID", width: 250 },
    { field: "firstname", headerName: "First Name", width: 250 },
    { field: "lastname", headerName: "Last Name", width: 250 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 250 },
    { field: "qualification", headerName: "Qualification", width: 150 },
    { field: "batchname", headerName: "Batch Name", width: 250 },
    { field: "bankname", headerName: "Bank Name", width: 150 },
    { field: "accountnumber", headerName: "Account No.", width: 180 },
    { field: "ifsc", headerName: "IFSC Code", width: 150 },
    { field: "branch", headerName: "Branch Name", width: 150 },
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
      field: "panimage",
      headerName: "Pan Card",
      width: 150,
      renderCell: (params) => (
        <a
          href={`https://admin.voagelearning.com/${params.value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`https://admin.voagelearning.com/${params.value}`}
            alt="Pan Card"
            style={{ width: 50, height: 50, borderRadius: "50%", cursor: "pointer" }}
          />
        </a>
      ),
    },
    {
      field: "degree",
      headerName: "Degree Certificates",
      width: 200,
      renderCell: (params) => {
        const degrees = Array.isArray(params.value) ? params.value : [params.value];

        return (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {degrees.map((file, index) => (
              <a
                key={index}
                href={`https://admin.voagelearning.com/${file}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={`https://admin.voagelearning.com/${file}`}
                  alt={`Degree ${index + 1}`}
                  style={{
                    width: 40,
                    height: 40,
                    padding: "5px",
                    borderRadius: "5px",
                    textDecoration: "none",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                />
              </a>
            ))}
          </div>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
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
            onClick={() => DeleteEducatorAPI(params.row.id)}
            color="error"
            aria-label="delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    }
  ];

  const rows = educators.map((educator, index) => ({
    sr_no: index + 1,
    id: educator._id,
    firstname: educator.firstname,
    lastname: educator.lastname,
    email: educator.email,
    phone: educator.phone,
    qualification: educator.qualification,
    batchname: educator.batch?.batchName,
    bankname: educator.Bank?.bankname || "N/A",
    accountnumber: educator.Bank?.accountnumber || "N/A",
    ifsc: educator.Bank?.ifsc || "N/A",
    branch: educator.Bank?.branch || "N/A",
     currentAddress: educator.currentAddress
      ? `${educator.currentAddress.addressline1},${educator.currentAddress.addressline2}, ${educator.currentAddress.city}, ${educator.currentAddress.state},${educator.permanentAddress.country},${educator.permanentAddress.zip}`
      : "N/A",
    permanentAddress: educator.permanentAddress
      ? `${educator.permanentAddress.addressline1},${educator.permanentAddress.addressline2}, ${educator.permanentAddress.city}, ${educator.permanentAddress.state},${educator.permanentAddress.country},${educator.permanentAddress.zip}`
      : "N/A",
    adharimage: educator.adharimage || "N/A",
    panimage: educator.panimage || "N/A",
    degree: educator.degree || "N/A",
    Bank: educator.Bank || {}
  }))

  return (
    <>
      <PageTitle page={"Educator List"} />
      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>

      {/* Edit Dialog */}
      {currentEducator && (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
          <DialogTitle>Edit Educator Details</DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstname"
                    value={currentEducator.firstname || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastname"
                    value={currentEducator.lastname || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={currentEducator.email || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={currentEducator.phone || ''}
                    onChange={handleChange}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Qualification"
                    name="qualification"
                    value={currentEducator.qualification || ''}
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
                      value={currentEducator.currentAddress[field] || ''}
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
                        checked={currentEducator.sameAddress}
                        onChange={handleChange}
                        name="sameAddress"
                        color="primary"
                      />
                    }
                    label="Permanent Address same as Current Address"
                  />
                </Grid>

                {/* Permanent Address (only show if not same as current) */}
                {!currentEducator.sameAddress && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>Permanent Address</Typography>
                    </Grid>
                    {['addressline1', 'addressline2', 'city', 'state', 'country', 'zip'].map(field => (
                      <Grid item xs={12} sm={6} key={`permanent-${field}`}>
                        <TextField
                          fullWidth
                          label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                          value={currentEducator.permanentAddress[field] || ''}
                          onChange={(e) => handleAddressChange('permanentAddress', field, e.target.value)}
                          margin="normal"
                        />
                      </Grid>
                    ))}
                  </>
                )}

                {/* Bank Details */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Bank Details</Typography>
                </Grid>
                {currentEducator.Bank && ['bankname', 'branch', 'accountnumber', 'ifsc'].map(field => (
                  <Grid item xs={12} sm={6} key={`bank-${field}`}>
                    <TextField
                      fullWidth
                      label={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                      value={currentEducator.Bank[field] || ''}
                      onChange={(e) => handleBankChange(field, e.target.value)}
                      margin="normal"
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={UpdateEducatorAPI} color="primary" variant="contained">
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
  )
}

export default Educatorlist