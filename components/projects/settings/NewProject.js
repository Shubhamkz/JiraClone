import React, { useEffect, useRef, useState } from "react";

const NewProject = () => {
  const [isVisible, setIsVisible] = useState(false);
  const popUpRef = useRef(null);
  const [projjectData, setProjectData] = useState({
    name: "",
    description: "",
    key: "",
  });

  const handleClickOutside = (event) => {
    if (popUpRef.current && !popUpRef.current.contains(event.target)) {
      setIsVisible(false);
    }
  };

  const handleInputChange = (e) => {
    setProjectData({ ...projjectData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projjectData),
      });

      console.log("Response:", response);
    } catch (error) {
      console.error("Error creating project:", error);
    }

    // Handle project creation logic here
    console.log("Project created");
    setIsVisible(false);
  };
 
  return (
    <div>
      {isVisible && (
        <div className="bg-[#000000b0] w-full h-full fixed top-0 left-0 z-50 flex items-center justify-center">
          <div
            ref={popUpRef}
            className="max-w-md w-full bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4">Create New Project</h2>
            {/* Form for creating a new project */}
            <div>
              {/* Add form fields here */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Project Name
                </label>
                <input
                  name="name"
                  value={projjectData.name}
                  onChange={handleInputChange}
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-1"
                  placeholder="Enter project name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={projjectData.description}
                  onChange={handleInputChange}
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-1"
                  placeholder="Enter project description"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Key
                </label>
                <input
                  name="key"
                  value={projjectData.key}
                  onChange={handleInputChange}
                  type="text"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-2 py-1"
                  placeholder="Eg. ai_shop"
                />
              </div>
              <button
                onClick={handleCreateProject}
                className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsVisible((prev) => !prev)}
        className="flex items-center mt-4 md:mt-0 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        Create New Project
      </button>
    </div>
  );
};

export default NewProject;
