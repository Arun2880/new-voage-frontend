import React, { useEffect, useState } from "react";
import { 
  DataGrid, 
  GridActionsCellItem 
} from "@mui/x-data-grid";
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  Box,
  Typography
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon  } from "@mui/icons-material";
import PageTitle from "../../components/PageTitle";
import BASE_URL from "../../config";
import axios from "axios";
import Swal from 'sweetalert2';

const Mentorlist = () => {
  const token = sessionStorage.getItem("token");
  const [mentors, setMentors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    bankname: "",
    accountnumber: "",
    ifsc: "",
    currentAddress: {
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zip:"",
    },
    permanentAddress: {
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zip:"",
    }
  });

  useEffect(() => {
    Getmentorlist();
  }, []);

  const Getmentorlist = async () => {
    try {
      const url = `${BASE_URL}/admin/getallmentor`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };
      const response = await axios.get(url, { headers: headers });
      setMentors(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to parse combined address string into address object
  const parseAddress = (addressStr) => {
    if (!addressStr) return {
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zip:""
    };

    const parts = addressStr.split(',').filter(part => part.trim() !== '');
    console.log("PArts",parts);
    return {
      addressline1: parts[0] || "",
      addressline2: parts.length > 3 ? parts[1] : "",
      city: parts.length > 3 ? parts[2] : parts[1] || "",
      state: parts.length > 3 ? parts[3] : parts[2] || "",
      country: parts.length > 4 ? parts[4] : "",
      zip:parts.length>5 ?parts[5]:""
    };
  };

  const handleEditClick = (mentor) => {
    setSelectedMentor(mentor);
    
    // Parse the addresses from the combined strings
    const currentAddress = parseAddress(mentor.currentAddress);
    const permanentAddress = parseAddress(mentor.permanentAddress);
    
    setFormData({
      firstname: mentor.firstname,
      lastname: mentor.lastname,
      email: mentor.email,
      phone: mentor.phone,
      bankname: mentor.bankname || "",
      accountnumber: mentor.accountnumber || "",
      ifsc: mentor.ifsc || "",
      currentAddress,
      permanentAddress
    });
    setOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const url = `${BASE_URL}/admin/updatementor/${selectedMentor._id}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.put(url, formData, { headers });
      console.log("Update response:", response.data);
      
      // Update local state
      setMentors(mentors.map(mentor => 
        mentor._id === selectedMentor._id ? response.data.data : mentor
      ));
      
      setOpen(false);
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const columns = [
    { field: "sr_no", headerName: "Sr.No", width: 50 },
    { field: "id", headerName: "ID", width: 250 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 250 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "bankname", headerName: "Bank Name", width: 150 },
    { field: "accountnumber", headerName: "Account No.", width: 180 },
    { field: "ifsc", headerName: "IFSC Code", width: 150 },
    { field: "currentAddress", headerName: "Current Address", width: 250 },
    { field: "permanentAddress", headerName: "Permanent Address", width: 250 },
    {
      field: "adharimage",
      headerName: "Aadhar Card",
      width: 150,
      renderCell: (params) => (
        <a
          href={`http://localhost:5000/${params.value}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src={`http://localhost:5000/${params.value}`}
            alt="Aadhar Card"
            style={{ width: 50, height: 50, borderRadius: "50%", cursor: "pointer" }}
          />
        </a>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          style={{color:"blue"}}
          onClick={() => handleEditClick(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon  />}
          label="Delete"
          style={{color:"red"}}
          onClick={() => DeletementorAPI(params.row)}
        />,
      ],
    },
  ];

  const rows = mentors.map((mentor, index) => ({
    sr_no: index + 1,
    id: mentor._id,
    firstname: mentor.firstname,
    lastname: mentor.lastname,
    email: mentor.email,
    phone: mentor.phone,
    bankname: mentor.Bank?.bankname || "N/A",
    accountnumber: mentor.Bank?.accountnumber || "N/A",
    ifsc: mentor.Bank?.ifsc || "N/A",
    currentAddress: mentor.currentAddress
      ? `${mentor.currentAddress.addressline1},${mentor.currentAddress.addressline2}, ${mentor.currentAddress.city}, ${mentor.currentAddress.state},${mentor.permanentAddress.country},${mentor.permanentAddress.zip}`
      : "N/A",
    permanentAddress: mentor.permanentAddress
      ? `${mentor.permanentAddress.addressline1},${mentor.permanentAddress.addressline2}, ${mentor.permanentAddress.city}, ${mentor.permanentAddress.state},${mentor.permanentAddress.country},${mentor.permanentAddress.zip}`
      : "N/A",
    adharimage: mentor.adharimage || "N/A",
    _id: mentor._id, // Include _id for reference
    originalData: mentor // Include full original data
  }));


  //  delete api

const DeletementorAPI = async () => {
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
        const url = `${BASE_URL}/admin/delmentor/${selectedMentor._id}`;
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        };

        const response = await axios.delete(url, { headers });

        console.log("Delete Mentor API", response.data);

        Swal.fire("Deleted!", "Mentor has been deleted.", "success");

        // Optional: refresh mentor list
        Getmentorlist(); // <-- call this if you have such a function
        setSelectedMentor(null); // optional: clear selection

      } catch (error) {
        console.log("Delete Mentor Error:", error);
        Swal.fire("Error!", "Something went wrong while deleting.", "error");
      }
    }
  });
};

  return (
    <>
      <PageTitle page={"Mentor List"} />
      <div style={{ height: 400, width: "100%", marginTop: 20 }}>
        <DataGrid 
          rows={rows} 
          columns={columns} 
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </div>

      {/* Edit Mentor Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Mentor Details</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <TextField
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Bank Name"
              name="bankname"
              value={formData.bankname}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Account Number"
              name="accountnumber"
              value={formData.accountnumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="IFSC Code"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Current Address</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                label="Address Line 1"
                name="currentAddress.addressline1"
                value={formData.currentAddress.addressline1}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address Line 2"
                name="currentAddress.addressline2"
                value={formData.currentAddress.addressline2}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City"
                name="currentAddress.city"
                value={formData.currentAddress.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                name="currentAddress.state"
                value={formData.currentAddress.state}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Country"
                name="currentAddress.country"
                value={formData.currentAddress.country}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Pin Code"
                name="currentAddress.zip"
                value={formData.currentAddress.zip}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Box>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Permanent Address</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <TextField
                label="Address Line 1"
                name="permanentAddress.addressline1"
                value={formData.permanentAddress.addressline1}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address Line 2"
                name="permanentAddress.addressline2"
                value={formData.permanentAddress.addressline2}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City"
                name="permanentAddress.city"
                value={formData.permanentAddress.city}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                name="permanentAddress.state"
                value={formData.permanentAddress.state}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Country"
                name="permanentAddress.country"
                value={formData.permanentAddress.country}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Pin Code"
                name="permanentAddress.zip"
                value={formData.permanentAddress.zip}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Mentorlist;