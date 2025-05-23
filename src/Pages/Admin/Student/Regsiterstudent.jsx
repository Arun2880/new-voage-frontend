import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  FormHelperText
} from "@mui/material";
import PageTitle from "../../../components/PageTitle";
import BASE_URL from "../../../config";
import { styled } from "@mui/material/styles";
import { CloudUpload } from "@mui/icons-material";
import Swal from "sweetalert2";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: "12px",
  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const getFieldLabel = (fieldName) => {
  const labelMap = {
    firstname: "First Name",
    lastname: "Last Name",
    email: "Email",
    phone: "Phone",
    password: "Password",
    qualification: "Qualification",
    alternatephone: "Alternate Phone",
    mothername: "Mother Name",
    fathername: "Father Name",
    homephone: "Home Phone",
    addressline1: "Address Line 1",
    addressline2: "Address Line 2",
    city: "City",
    state: "State",
    country: "Country",
    zip: "ZIP Code",
    landmark: "Landmark"
  };

  return labelMap[fieldName] || fieldName.replace(/^\w/, (c) => c.toUpperCase());
};

const Regsiterstudent = () => {
  const initialState = {
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    qualification: "",
    alternatephone: "",
    mothername: "",
    fathername: "",
    homephone: "",
    sameAddress: false,
    currentAddress: {
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      landmark: "",
    },
    permanentAddress: {
      addressline1: "",
      addressline2: "",
      city: "",
      state: "",
      country: "",
      zip: "",
      landmark: "",
    },
    profile: null,
    adharimage: null,
    courseId: "",
    batchId: "",
    educatorId: ""
  };

  const [formData, setFormData] = useState(initialState);
  const [courses, setCourses] = useState([]);
  const [educators, setEducators] = useState([]);
  const [batches, setBatches] = useState([]);
  const [errors, setErrors] = useState({
    phone: false,
    alternatephone: false,
    homephone: false,
    password: false,
    zip: false
  });
  const [helperText, setHelperText] = useState({
    phone: "",
    alternatephone: "",
    homephone: "",
    password: "",
    zip: ""
  });
  const token = sessionStorage.getItem("token");
  const profileRef = useRef(null);
  const adharRef = useRef(null);

  useEffect(() => {
    Getallcourses();
    GetEducatorList();
  }, []);

  useEffect(() => {
    if (formData.courseId) {
      BatchlistAPI(formData.courseId);
    } else {
      setBatches([]);
      setFormData(prev => ({...prev, batchId: ""}));
    }
  }, [formData.courseId]);

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const validateZip = (zip) => {
    const zipRegex = /^\d{6}$/;
    return zipRegex.test(zip);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handlePhoneInput = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '').slice(0, 10);
    e.target.value = numericValue;
    
    // Validate the phone number
    const isValid = validatePhone(numericValue);
    setErrors(prev => ({ ...prev, [name]: !isValid }));
    setHelperText(prev => ({ 
      ...prev, 
      [name]: isValid ? "" : "Phone must be exactly 10 digits" 
    }));
    
    handleChange(e);
  };

  const handleZipInput = (e) => {
    const { name, value } = e.target;
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    e.target.value = numericValue;
    
    // Validate the ZIP code
    const isValid = validateZip(numericValue);
    setErrors(prev => ({ ...prev, zip: !isValid }));
    setHelperText(prev => ({ 
      ...prev, 
      zip: isValid ? "" : "ZIP code must be exactly 6 digits" 
    }));
    
    handleChange(e);
  };

  const handleChange = (e) => {
    const { name, value, checked, type, files } = e.target;

    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        sameAddress: checked,
        permanentAddress: checked
          ? { ...prevData.currentAddress }
          : prevData.permanentAddress,
      }));
    } else if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0],
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...prevData[parent],
          [child]: value,
        },
      }));
    } else {
      if (name === "password") {
        const isValid = validatePassword(value);
        setErrors(prev => ({ ...prev, password: !isValid }));
        setHelperText(prev => ({ 
          ...prev, 
          password: isValid ? "" : "Password must be at least 8 characters" 
        }));
      }
      
      if (name === "courseId") {
        setFormData(prevData => ({
          ...prevData,
          [name]: value,
          batchId: ""
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
  };

  const addMentorAPI = async () => {
    // Validate all fields before submission
    const isPhoneValid = validatePhone(formData.phone);
    const isAlternatePhoneValid = formData.alternatephone ? validatePhone(formData.alternatephone) : true;
    const isHomePhoneValid = formData.homephone ? validatePhone(formData.homephone) : true;
    const isPasswordValid = validatePassword(formData.password);
    const isZipValid = validateZip(formData.currentAddress.zip);
    
    if (!isPhoneValid || !isAlternatePhoneValid || !isHomePhoneValid || !isPasswordValid || !isZipValid) {
      setErrors({
        phone: !isPhoneValid,
        alternatephone: !isAlternatePhoneValid,
        homephone: !isHomePhoneValid,
        password: !isPasswordValid,
        zip: !isZipValid
      });
      setHelperText({
        phone: !isPhoneValid ? "Phone must be exactly 10 digits" : "",
        alternatephone: !isAlternatePhoneValid ? "Alternate phone must be exactly 10 digits" : "",
        homephone: !isHomePhoneValid ? "Home phone must be exactly 10 digits" : "",
        password: !isPasswordValid ? "Password must be at least 8 characters" : "",
        zip: !isZipValid ? "ZIP code must be exactly 6 digits" : ""
      });
      Swal.fire({
        title: "Validation Error!",
        text: "Please fix the errors in the form before submitting.",
        icon: "error"
      });
      return;
    }

    try {
      const url = `${BASE_URL}/admin/registerstudent`;
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (["profile", "adharimage"].includes(key)) {
          if (formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        } else if (typeof formData[key] === "object") {
          Object.keys(formData[key]).forEach((nestedKey) => {
            formDataToSend.append(
              `${key}.${nestedKey}`,
              formData[key][nestedKey]
            );
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const headers = {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(url, formDataToSend, { headers });

      setFormData(initialState);
      if (profileRef.current) profileRef.current.value = "";
      if (adharRef.current) adharRef.current.value = "";

      if (response.data.error == false) {
        Swal.fire({
          title: "Success!",
          text: "Student registered successfully",
          icon: "success",
        });
      }
    } catch (error) {
      console.error(
        "Error adding student:",
        error.response?.data || error.message
      );
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Failed to register student",
        icon: "error",
      });
    }
  };

  const Getallcourses = async () => {
    try {
      const url = `${BASE_URL}/admin/getcourse`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers: headers });
      if (response.data.error === false) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const BatchlistAPI = async (courseId) => {
    try {
      const url = `${BASE_URL}/admin/courseBatch/${courseId}`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(url, { headers: headers });
      if (response.data.error === false) {
        const batchList = response.data.data[0] || [];
        setBatches(batchList);
      }
    } catch (error) {
      console.log(error);
      setBatches([]);
    }
  };

  const GetEducatorList = async () => {
    try {
      const url = `${BASE_URL}/admin/getalleducator`;
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      };

      const response = await axios.get(url, { headers: headers });
      if (response.data.error === false) {
        setEducators(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <PageTitle page="Register Student" />
      <StyledCard>
        <CardContent>
          <Box display="flex" alignItems="center" mb={4}>
            <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mr: 2 }}>
              <Typography variant="h4">S</Typography>
            </Avatar>
            <Box>
              <Typography variant="h5" component="h1" fontWeight="bold">
                Student Registration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the details to register a new student
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            {/* Personal Information Section */}
            <Grid item xs={12}>
              <SectionHeader variant="h6">Personal Information</SectionHeader>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="First Name"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handlePhoneInput}
                onInput={handlePhoneInput}
                error={errors.phone}
                helperText={helperText.phone}
                variant="outlined"
                size="small"
                required
                inputProps={{
                  maxLength: 10
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText={helperText.password}
                variant="outlined"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Qualification"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                variant="outlined"
                size="small"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Alternate Phone"
                name="alternatephone"
                value={formData.alternatephone}
                onChange={handlePhoneInput}
                onInput={handlePhoneInput}
                error={errors.alternatephone}
                helperText={helperText.alternatephone}
                variant="outlined"
                size="small"
                inputProps={{
                  maxLength: 10
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Mother Name"
                name="mothername"
                value={formData.mothername}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Father Name"
                name="fathername"
                value={formData.fathername}
                onChange={handleChange}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Home Phone"
                name="homephone"
                value={formData.homephone}
                onChange={handlePhoneInput}
                onInput={handlePhoneInput}
                error={errors.homephone}
                helperText={helperText.homephone}
                variant="outlined"
                size="small"
                inputProps={{
                  maxLength: 10
                }}
              />
            </Grid>

            {/* Course Selection Section */}
            <Grid item xs={12}>
              <SectionHeader variant="h6">Course and Educator Details</SectionHeader>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="course-select-label">Select Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  id="course-select"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  label="Select Course"
                  required
                >
                  {courses.map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          src={course.courseimage} 
                          sx={{ width: 24, height: 24, mr: 2 }}
                        />
                        {course.coursename}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="batch-select-label">Select Batch</InputLabel>
                <Select
                  labelId="batch-select-label"
                  id="batch-select"
                  name="batchId"
                  value={formData.batchId}
                  onChange={handleChange}
                  label="Select Batch"
                  required
                  disabled={!formData.courseId || batches.length === 0}
                >
                  {batches.length > 0 ? (
                    batches.map((batch) => (
                      <MenuItem key={batch._id} value={batch._id}>
                        <Box>
                          <Typography>{batch.batchname}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {batch.schedule?.days?.join(", ")} • {batch.schedule?.time}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      {formData.courseId ? "No batches available" : "Select a course first"}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="educator-select-label">Select Educator</InputLabel>
                <Select
                  labelId="educator-select-label"
                  id="educator-select"
                  name="educatorId"
                  value={formData.educatorId}
                  onChange={handleChange}
                  label="Select Educator"
                  required
                >
                  {educators.map((educator) => (
                    <MenuItem key={educator._id} value={educator._id}>
                      <Box display="flex" alignItems="center">
                        {educator.firstname} {educator.lastname}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Address Section */}
            <Grid item xs={12}>
              <SectionHeader variant="h6">Address Information</SectionHeader>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Current Address
              </Typography>
            </Grid>

            {Object.keys(formData.currentAddress).map((field) => (
              <Grid item xs={12} sm={6} md={3} key={`currentAddress.${field}`}>
                {field === "zip" ? (
                  <>
                    <TextField
                      fullWidth
                      label={getFieldLabel(field)}
                      name={`currentAddress.${field}`}
                      value={formData.currentAddress[field]}
                      onChange={handleZipInput}
                      onInput={handleZipInput}
                      error={errors.zip}
                      helperText={helperText.zip}
                      variant="outlined"
                      size="small"
                      inputProps={{
                        maxLength: 6
                      }}
                    />
                  </>
                ) : (
                  <TextField
                    fullWidth
                    label={getFieldLabel(field)}
                    name={`currentAddress.${field}`}
                    value={formData.currentAddress[field]}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                  />
                )}
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    name="sameAddress"
                    checked={formData.sameAddress}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Permanent Address same as Current Address"
              />
            </Grid>

            {!formData.sameAddress && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Permanent Address
                  </Typography>
                </Grid>
                {Object.keys(formData.permanentAddress).map((field) => (
                  <Grid item xs={12} sm={6} md={3} key={`permanentAddress.${field}`}>
                    {field === "zip" ? (
                      <>
                        <TextField
                          fullWidth
                          label={getFieldLabel(field)}
                          name={`permanentAddress.${field}`}
                          value={formData.permanentAddress[field]}
                          onChange={handleZipInput}
                          onInput={handleZipInput}
                          error={errors.zip}
                          helperText={helperText.zip}
                          variant="outlined"
                          size="small"
                          inputProps={{
                            maxLength: 6
                          }}
                        />
                      </>
                    ) : (
                      <TextField
                        fullWidth
                        label={getFieldLabel(field)}
                        name={`permanentAddress.${field}`}
                        value={formData.permanentAddress[field]}
                        onChange={handleChange}
                        variant="outlined"
                        size="small"
                      />
                    )}
                  </Grid>
                ))}
              </>
            )}

            {/* Documents Section */}
            <Grid item xs={12}>
              <SectionHeader variant="h6">Documents</SectionHeader>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Upload Profile Picture
                <VisuallyHiddenInput
                  type="file"
                  name="profile"
                  onChange={handleChange}
                  accept="image/*"
                  ref={profileRef}
                />
              </Button>
              {formData.profile && (
                <Typography variant="caption" color="text.secondary" mt={1}>
                  Selected: {formData.profile.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{ py: 1.5 }}
              >
                Upload Aadhar Card
                <VisuallyHiddenInput
                  type="file"
                  name="adharimage"
                  onChange={handleChange}
                  accept="image/*"
                  ref={adharRef}
                />
              </Button>
              {formData.adharimage && (
                <Typography variant="caption" color="text.secondary" mt={1}>
                  Selected: {formData.adharimage.name}
                </Typography>
              )}
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={addMentorAPI}
                  size="large"
                  sx={{
                    px: 6,
                    py: 1.5,
                    borderRadius: "8px",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "1rem"
                  }}
                >
                  Register Student
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>
    </>
  );
};

export default Regsiterstudent;