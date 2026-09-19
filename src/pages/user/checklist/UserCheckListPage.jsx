import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../../components/common/Loader";
import { useSelector } from "react-redux";
import axios from "axios";

const UserCheckListPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [checklistItems, setChecklistItems] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [selectedJournalId, setSelectedJournalId] = useState("");

  const authHeaders = useMemo(
    () => ({
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    }),
    [token]
  );

  // ---------- FETCH CHECKLIST ----------
  const fetchChecklist = async () => {
    try {
      const res = await axios.get(`${API_URL}api/manuscript/show-checklist`, {
        headers: authHeaders,
      });
      if (res.data.flag === 1) {
        // ✅ Only show items with status === 1
        const enabled = (res.data.data || []).filter(
          (it) => Number(it.status) === 1
        );
        setChecklistItems(enabled);

        // initialize all as unchecked
        const initial = enabled.reduce((acc, it) => {
          acc[it.id] = false;
          return acc;
        }, {});
        setCheckedItems(initial);
      } else {
        toast.error(res.data.message || "Failed to fetch checklist");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  // ---------- FETCH TEMPLATES ----------
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${API_URL}api/templates`, {
        headers: authHeaders,
      });
      if (res.data.success) {
        setTemplates(res.data.data || []);
      } else {
        toast.error(res.data.message || "Failed to fetch templates");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    const run = async () => {
      await Promise.all([fetchChecklist(), fetchTemplates()]);
      setLoading(false);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- HELPERS ----------
  const buildFileUrl = (path) => {
    if (!path) return "#";
    if (path.startsWith("http")) return path;
    const base = storageUrl  || "";
    return `${base}/${path}`;
  };

  // unique journals derived from templates
  const journalOptions = useMemo(() => {
    const map = new Map();
    templates.forEach((t) => {
      if (t.journal && t.status === "active") {
        map.set(t.journal.id, t.journal.j_title);
      }
    });
    return Array.from(map, ([id, title]) => ({ id, title }));
  }, [templates]);

  // selected journal's template record
  const selectedTemplate = useMemo(() => {
    if (!selectedJournalId) return null;
    return (
      templates.find(
        (t) =>
          Number(t.journal_id) === Number(selectedJournalId) &&
          t.status === "active"
      ) || null
    );
  }, [templates, selectedJournalId]);

  const allChecked =
    checklistItems.length > 0 &&
    checklistItems.every((it) => checkedItems[it.id]);

  const canProceed = allChecked && !!selectedJournalId && !!selectedTemplate;

  // ---------- HANDLERS ----------
  const handleCheckboxChange = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownload = (path, label) => {
    if (!path) return toast.error(`${label} not available`);
    const url = buildFileUrl(path);
    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.download = path.split("/").pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!allChecked) {
      return toast.error(
        "Please check all the checklist items before proceeding."
      );
    }
    if (!selectedJournalId) {
      return toast.error("Please select a journal.");
    }
    if (!selectedTemplate) {
      return toast.error("No template available for this journal.");
    }

    // ✅ store for next step (so next page can use it)
    sessionStorage.setItem("selected_journal_id", selectedJournalId);
    sessionStorage.setItem("selected_template_id", selectedTemplate.id);

    navigate("/confirmation/add-new-paper");
  };

  if (loading) return <Loader />;

  return (
    <>
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">New Manuscript</h1>
      </div>

      <div className="flex min-h-screen gap-4 flex-col lg:flex-row">
        <div className="p-8 bg-white border flex-1">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-lg font-semibold mb-6">
              Common.Submit New Manuscript
            </h2>

            <p className="mb-6 text-sm text-gray-700">
              Indicate that this submission is ready to be considered by this
              journal by checking off the following.
            </p>

            <form onSubmit={handleSubmit}>
              {/* ---------- STEP 1: CHECKLIST ---------- */}
              <div className="space-y-4 mb-8 mt-4">
                {checklistItems.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No checklist items available.
                  </p>
                ) : (
                  checklistItems.map((item) => (
                    <div key={item.id} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`check-${item.id}`}
                        className="mt-1 mr-2 cursor-pointer"
                        checked={!!checkedItems[item.id]}
                        onChange={() => handleCheckboxChange(item.id)}
                      />
                      <label
                        htmlFor={`check-${item.id}`}
                        className="text-sm cursor-pointer select-none"
                      >
                        {item.checklist_item}
                      </label>
                    </div>
                  ))
                )}
              </div>

              {/* ---------- STEP 2: JOURNAL SELECT ---------- */}
              <div className="mb-6">
                <label
                  htmlFor="journal"
                  className="block text-sm font-medium mb-2"
                >
                  Select Journal <span className="text-red-500">*</span>
                </label>
                <select
                  id="journal"
                  value={selectedJournalId}
                  onChange={(e) => setSelectedJournalId(e.target.value)}
                  disabled={!allChecked}
                  className={`w-full md:w-96 p-2 border rounded text-sm ${
                    !allChecked
                      ? "bg-gray-100 cursor-not-allowed"
                      : "bg-white cursor-pointer"
                  }`}
                >
                  <option value="">
                    {allChecked
                      ? "-- Select Journal --"
                      : "Check all items first"}
                  </option>
                  {journalOptions.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
                {!allChecked && (
                  <p className="text-xs text-gray-500 mt-1">
                    Please check all checklist items to enable journal
                    selection.
                  </p>
                )}
              </div>

              {/* ---------- STEP 3: DOWNLOAD BUTTONS ---------- */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  type="button"
                  disabled={!selectedTemplate}
                  onClick={() =>
                    handleDownload(
                      selectedTemplate?.template_file,
                      "Paper Template"
                    )
                  }
                  className={`px-4 py-2 rounded text-sm flex items-center transition-all duration-300 ${
                    selectedTemplate
                      ? "bg-blue-100 text-orange-400 hover:bg-blue-200 cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Paper Template
                </button>

                <button
                  type="button"
                  disabled={!selectedTemplate}
                  onClick={() =>
                    handleDownload(
                      selectedTemplate?.copyright_file,
                      "Copyright Form"
                    )
                  }
                  className={`px-4 py-2 rounded text-sm flex items-center transition-all duration-300 ${
                    selectedTemplate
                      ? "bg-blue-100 text-orange-400 hover:bg-blue-200 cursor-pointer"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Copyright Form
                </button>
              </div>

              {selectedJournalId && !selectedTemplate && (
                <p className="text-xs text-red-500 mb-4">
                  No active template found for the selected journal.
                </p>
              )}

              {/* ---------- STEP 4: NEXT ---------- */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!canProceed}
                  className={`px-6 py-2 rounded flex items-center transition-all duration-300 ${
                    canProceed
                      ? "bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Next
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    className="ml-2"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCheckListPage;