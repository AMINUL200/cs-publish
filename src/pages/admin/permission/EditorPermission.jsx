import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import axios from "axios";

// Font Awesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  
    faSearch,
    faBookOpen,
    faUsers,
    faFilter
} from "@fortawesome/free-solid-svg-icons";

const EditorPermission = () => {
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [editors, setEditors] = useState([]);
    const [manuscripts, setManuscripts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedJournal, setSelectedJournal] = useState("all");
    const [assigningEditor, setAssigningEditor] = useState(null);
    const [selectedManuscript, setSelectedManuscript] = useState(null);

    // Extract unique journals for filter
    const journals = [...new Set(manuscripts.map(m => m.journal_title))];

    const fetchEditorPermissions = async () => {
        try {
            const response = await axios.get(`${API_URL}api/permission/admin`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200 && response.data.flag) {
                const { editors, manuscripts } = response.data.data;
                setEditors(editors || []);
                setManuscripts(manuscripts || []);
            } else {
                toast.error(response.data.message || "Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching editor permissions:", error);
            toast.error(error.message || "Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    const assignEditorToManuscript = async (editorId, manuscriptId) => {
        try {
            const response = await axios.post(
                `${API_URL}api/permission/admin`,
                { editor_id: editorId, manuscript_id: manuscriptId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 && response.data.flag) {
                toast.success(response.data.message);
                fetchEditorPermissions();
            } else {
                toast.error(response.data.message || "Assignment failed");
            }

        } catch (error) {
            console.error("Error assigning editor:", error);
            toast.error(error.message || "Assignment failed");
        } finally {
            setAssigningEditor(null);
            setSelectedManuscript(null);
        }
    };

    const filteredManuscripts = manuscripts.filter(m => {
        const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.id.toString().includes(searchTerm);
        const matchesJournal = selectedJournal === "all" || m.journal_title === selectedJournal;
        return matchesSearch && matchesJournal;
    });

    useEffect(() => {
        fetchEditorPermissions();
    }, [token]);

    if (loading) return <Loader />;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Editor Assignment</h1>
                    <p className="text-gray-600 mt-2">
                        Assign editors to submitted manuscripts for peer review
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-4 mt-4 md:mt-0">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                                <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Manuscripts</p>
                                <p className="font-bold text-lg">{manuscripts.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-50 rounded-lg text-green-600">
                                <FontAwesomeIcon icon={faUsers} className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm">Available Editors</p>
                                <p className="font-bold text-lg">{editors.length}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search manuscripts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                        </div>
                        <select
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                            value={selectedJournal}
                            onChange={(e) => setSelectedJournal(e.target.value)}
                        >
                            <option value="all">All Journals</option>
                            {journals.map((journal) => (
                                <option key={journal} value={journal}>
                                    {journal}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-end">
                        <button
                            onClick={fetchEditorPermissions}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2 cursor-pointer"
                        >
                            Refresh Data
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Editors Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faUsers} className="text-blue-500" />
                            Available Editors
                        </h2>

                        {editors.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No editors available
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {editors.map((editor) => (
                                    <div
                                        key={editor.id}
                                        className={`p-3 rounded-lg border transition cursor-pointer hover:shadow-md ${assigningEditor?.user_id === editor.user_id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300"
                                            }`}
                                        onClick={() => setAssigningEditor(editor)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                                                {editor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-800">{editor.name}</h3>
                                                <p className="text-sm text-gray-500">{editor.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Manuscripts Panel */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <FontAwesomeIcon icon={faBookOpen} className="text-green-500" />
                            Manuscripts Awaiting Assignment
                            <span className="ml-auto text-sm font-normal bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                                {filteredManuscripts.length} found
                            </span>
                        </h2>

                        {filteredManuscripts.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <FontAwesomeIcon icon={faBookOpen} className="text-gray-400 text-3xl" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-700 mb-1">No manuscripts found</h3>
                                <p className="text-gray-500">Try adjusting your search or filters</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredManuscripts.map((manuscript) => (
                                    <div
                                        key={manuscript.id}
                                        className={`p-4 rounded-xl border transition ${selectedManuscript?.id === manuscript.id
                                            ? "border-blue-500 bg-blue-50"
                                            : "border-gray-200 hover:border-blue-300 bg-white"
                                            }`}
                                        onClick={() => setSelectedManuscript(manuscript)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-gray-800 mb-1">
                                                    {manuscript.title}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 text-xs mb-3">
                                                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                        ID: {manuscript.id}
                                                    </span>
                                                    <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded">
                                                        {manuscript.journal_title}
                                                    </span>
                                                    {manuscript.assigned_editor && (
                                                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded ">
                                                            Assigned: {manuscript.assigned_editor.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                className={`px-3 py-1 rounded-lg text-sm font-medium transition cursor-pointer ${selectedManuscript?.id === manuscript.id && assigningEditor
                                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                    }`}
                                                disabled={!assigningEditor}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (assigningEditor && manuscript) {
                                                        assignEditorToManuscript(assigningEditor.id, manuscript.id);
                                                    }
                                                }}
                                            >
                                                {selectedManuscript?.id === manuscript.id && assigningEditor
                                                    ? `Assign ${assigningEditor.name.split(' ')[0]}`
                                                    : "Assign"}
                                            </button>
                                        </div>

                                        {selectedManuscript?.id === manuscript.id && (
                                            <div className="mt-3 pt-3 border-t border-gray-200">
                                                <div className="text-sm text-gray-600">
                                                    <p className="mb-1"><span className="font-medium">Submission Date:</span> {new Date(manuscript.created_at).toLocaleDateString()}</p>
                                                    <p><span className="font-medium">Abstract:</span> {manuscript.abstract || "No abstract provided"}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Assignment Instructions */}
            {assigningEditor && selectedManuscript && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-4">
                    <div>
                        Assigning <span className="font-bold">{assigningEditor.name}</span> to <span className="font-bold">{selectedManuscript.title}</span>
                    </div>
                    <button
                        onClick={() => assignEditorToManuscript(assigningEditor.user_id, selectedManuscript.id)}
                        className="bg-white text-blue-600 px-4 py-1 rounded font-medium hover:bg-blue-50 transition cursor-pointer"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => {
                            setAssigningEditor(null);
                            setSelectedManuscript(null);
                        }}
                        className="text-blue-100 hover:text-white cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditorPermission;