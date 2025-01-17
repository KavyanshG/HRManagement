import React, { useState, useEffect } from "react";
import axios from "axios";

const JobApplication = () => {
  const [jobPostings, setJobPostings] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    phone: "",
    photo: null, // To store the photo file (PNG)
    cv: null,    // To store the CV file (PDF)
    jobIds: [],
  });

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        const response = await axios.get("/api/job-postings");
        setJobPostings(response.data);
      } catch (error) {
        console.error("Error fetching job postings:", error);
      }
    };
    fetchJobPostings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleJobSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, jobIds: selectedOptions });
  };

  const handleFileUpload = (e, fileType) => {
    const file = e.target.files[0];
    if (fileType === "cv" && file && file.type === "application/pdf") {
      setFormData({ ...formData, cv: file });
    } else if (fileType === "photo" && file && file.type === "image/png") {
      setFormData({ ...formData, photo: file });
    } else {
      alert(`Please upload a valid ${fileType === "cv" ? "PDF" : "PNG"} file.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.jobIds.length === 0) {
      alert("Please select at least one job to apply for.");
      return;
    }
    if (!formData.cv) {
      alert("Please upload your CV.");
      return;
    }
    if (!formData.photo) {
      alert("Please upload your photo.");
      return;
    }

    const applicationData = new FormData();
    applicationData.append("name", formData.name);
    applicationData.append("department", formData.department);
    applicationData.append("phone", formData.phone);
    applicationData.append("photo", formData.photo);
    applicationData.append("cv", formData.cv);
    applicationData.append("jobIds", JSON.stringify(formData.jobIds));

    console.log("Form submitted:", formData);
    // Replace this console log with actual submit logic to store applicationData
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Job Application</h1>

        {/* Job Postings Multi-Select Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="jobIds">
            Select Job Postings
          </label>
          <select
            id="jobIds"
            name="jobIds"
            multiple
            value={formData.jobIds}
            onChange={handleJobSelect}
            className="w-full p-2 border border-gray-300 rounded h-32"
          >
            {jobPostings.map((job) => (
              <option key={job._id} value={job._id}>
                {job.title} - {job.department}
              </option>
            ))}
          </select>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="department">
              Department
            </label>
            <input
              type="text"
              name="department"
              id="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="photo">
              Upload Photo (PNG only)
            </label>
            <input
              type="file"
              name="photo"
              id="photo"
              accept="image/png"
              onChange={(e) => handleFileUpload(e, "photo")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formData.photo && (
              <p className="text-sm text-green-600 mt-2">
                Selected photo: {formData.photo.name}
              </p>
            )}
          </div>

          {/* CV Upload */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="cv">
              Upload CV (PDF only)
            </label>
            <input
              type="file"
              name="cv"
              id="cv"
              accept="application/pdf"
              onChange={(e) => handleFileUpload(e, "cv")}
              className="w-full p-2 border border-gray-300 rounded"
            />
            {formData.cv && (
              <p className="text-sm text-green-600 mt-2">
                Selected CV: {formData.cv.name}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition duration-300 w-full"
          >
            Apply
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplication;
