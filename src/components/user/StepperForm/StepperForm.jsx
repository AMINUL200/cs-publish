import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import { toast } from "react-toastify";
import axios from "axios";
import { useSelector } from "react-redux";

const StepperForm = () => {
      const API_URL = import.meta.env.VITE_API_URL;
    const { token, userData } = useSelector((state) => state.auth);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        journal_id: 1,
        // type_of_article: "research", // Added required field
        username: "random1",
        contact_number: "+1234567890",
        email: "random1@gmail.com",
        affiliation: "University of Science",
        address: "123 Research Ave, Science City",
        country: "United States",
        add_myself: true, // ✅ boolean
        add_author: ["Jane Smith", "Michael Johnson"], // Multiple authors comma-separated

        // Manuscript details
        title: "A Study on the Effects of React Hooks in Modern Web Development",
        abstract: "This paper examines how React Hooks have transformed state management in functional components...",
        introduction: "React Hooks were introduced in version 16.8 to allow functional components to manage state...",
        materials_and_methods: "We conducted a comparative analysis of 50 projects using both class and functional components...",
        results: "Our findings show a 40% reduction in code complexity when using Hooks...",
        discussion: "The results suggest that Hooks improve code maintainability while potentially introducing new learning curves...",
        conclusion: "React Hooks represent a significant advancement in frontend development paradigms...",
        author_contributions: "JD designed the study. JS implemented the analysis. MJ performed statistical validation.",
        conflict_of_interest_statement: "The authors declare no conflicts of interest.",

        // References and files
        references: "1. React Documentation (2023). Hooks API Reference...",
        keywords: ["React", "Hooks", "Frontend", "Web Development"], //array of keywords

        // Initialize files as null - you'll replace these with actual File objects
        manuscript_file: null,
        copyright_form: null,
        supplementary_files: [],
    });
    const [loading, setLoading] = useState(false);



    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setLoading(true);
        console.log("Submitting supplementary_files as:", formData.supplementary_files);
        try {
            const submissionData = new FormData();

            // Append all regular fields
            submissionData.append("journal_id", formData.journal_id);
            submissionData.append("username", formData.username);
            submissionData.append("contact_number", formData.contact_number);
            submissionData.append("email", formData.email);
            submissionData.append("affiliation", formData.affiliation);
            submissionData.append("address", formData.address);
            submissionData.append("country", formData.country);
            submissionData.append("add_myself", formData.add_myself ? 1 : 0);
            submissionData.append("title", formData.title);
            submissionData.append("abstract", formData.abstract);
            submissionData.append("introduction", formData.introduction);
            submissionData.append("materials_and_methods", formData.materials_and_methods);
            submissionData.append("results", formData.results);
            submissionData.append("discussion", formData.discussion);
            submissionData.append("conclusion", formData.conclusion);
            submissionData.append("author_contributions", formData.author_contributions);
            submissionData.append("conflict_of_interest_statement", formData.conflict_of_interest_statement);
            submissionData.append("references", formData.references);
            if (formData.type_of_article)
                submissionData.append("type_of_article", formData.type_of_article);

            // ✅ Append author array
            formData.add_author.forEach(author =>
                submissionData.append("add_author[]", author)
            );

            // ✅ Append keywords array
            formData.keywords.forEach(keyword =>
                submissionData.append("keywords[]", keyword)
            );

            // ✅ Append files
            if (formData.manuscript_file)
                submissionData.append("manuscript_file", formData.manuscript_file);

            if (formData.copyright_form)
                submissionData.append("copyright_form", formData.copyright_form);

            if (formData.supplementary_files?.length > 0) {
                formData.supplementary_files.forEach(file => {
                    submissionData.append("supplementary_files[]", file);
                });
            }

            // Debug log
            for (let [key, value] of submissionData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await axios.post(`${API_URL}/api/manuscript`, submissionData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success("Manuscript submitted successfully!");
            console.log("Submission successful:", response.data);
        } catch (error) {
            toast.error("Submission failed. Check console.");
            console.error("Submission error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="w-full mx-auto p-6 bg-white shadow-md rounded">
            <div className="h-2 w-full bg-gray-200 rounded mb-4">
                <div className={`h-full bg-blue-500 rounded transition-all duration-300`} style={{ width: `${(step / 3) * 100}%` }} />
            </div>
            <div className="mb-4 flex justify-between">
                {["1", "2", "3"].map((label, idx) => (
                    <div
                        key={idx}
                        className={`w-8 h-8 flex items-center justify-center rounded-full text-white ${step === idx + 1 ? "bg-blue-500" : "bg-gray-300"
                            }`}
                    >
                        {label}
                    </div>
                ))}
            </div>

            {step === 1 && <StepOne formData={formData} handleChange={handleChange} />}
            {step === 2 && <StepTwo formData={formData} handleChange={handleChange} />}
            {step === 3 && <StepThree formData={formData} handleChange={handleChange} />}

            <div className="mt-4 flex justify-between">
                {step > 1 && (
                    <button
                        onClick={prevStep}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 cursor-pointer"
                    >
                        Back
                    </button>
                )}
                {step < 3 ? (
                    <button
                        onClick={nextStep}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ml-auto cursor-pointer"
                    >
                        Next
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-auto cursor-pointer"
                    >
                        Submit
                    </button>
                )}
            </div>
        </div>
    );
};

export default StepperForm;
