import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../../../components/common/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../lib/utils';

const AuthorViewSubmittedManuscript = () => {
    const [manuscripts, setManuscripts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showUpdatesOnly, setShowUpdatesOnly] = useState(false);
    const { token } = useSelector((state) => state.auth);
    const API_URL = import.meta.env.VITE_API_URL;
    const VITE_STORAGE_URL = import.meta.env.VITE_STORAGE_URL;
    const navigate = useNavigate();

    const getManuscript = async () => {
        try {
            const response = await axios.get(`${API_URL}api/author/manuscript-update-status`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.flag === 1) {
                setManuscripts(Array.isArray(response.data.data) ? response.data.data : []);
            } else {
                toast.error(response.data.message || 'Failed to fetch manuscripts');
            }
        } catch (error) {
            console.error('Error fetching manuscripts:', error);
            toast.error(error?.response?.data?.message || error.message || 'Failed to fetch manuscripts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            getManuscript();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const filteredManuscripts = useMemo(() => {
        if (!showUpdatesOnly) return manuscripts;
        return manuscripts.filter((m) => String(m?.is_update) === '1');
    }, [manuscripts, showUpdatesOnly]);

    

    const renderHtml = (html) => ({ __html: html });

    const resolveFileUrl = (path) => {
        if (!path) return null;
        const isAbsolute = /^https?:\/\//i.test(path);
        return isAbsolute ? path : `${VITE_STORAGE_URL || ''}${path}`;
    };

    const handleUpdateClick = (manuscriptId) => {
        if (!manuscriptId) return;
        // Logic to handle update action, e.g., navigate to update page
        console.log('Update manuscript with ID:', manuscriptId);
        navigate(`/confirmation/add-new-paper?update=${manuscriptId}`);
    }

    if(loading) {
        return <Loader/>
    }


    return (
        <div className="p-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-xl font-semibold">Submitted Manuscripts</h2>
                <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={showUpdatesOnly}
                            onChange={(e) => setShowUpdatesOnly(e.target.checked)}
                        />
                        <span>Show update required only</span>
                    </label>
                </div>
            </div>

            {loading ? (
                <div className="py-10 text-center">Loading...</div>
            ) : filteredManuscripts.length === 0 ? (
                <div className="py-10 text-center text-gray-500">No manuscripts found.</div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredManuscripts.map((item) => {
                        const needsUpdate = String(item?.is_update) === '1';
                        return (
                            <div key={item.id} className="rounded border border-gray-200 p-4 bg-white">
                                <div className="flex items-start justify-between gap-3">
                                    <Link to={`/confirmation/view-manuscript/${item.id}`} className="flex-1 group">
                                        <h3 className="text-lg font-medium group-hover:text-blue-500 " dangerouslySetInnerHTML={renderHtml(item?.title || 'Untitled')} />
                                        <p className="mt-1 text-sm text-gray-600 line-clamp-3 group-hover:underline "
                                        dangerouslySetInnerHTML={{__html:item?.abstract}}
                                        >
                                            {/* {item?.abstract} */}

                                        </p>
                                    </Link>
                                    <div className="flex flex-col items-end gap-2">
                                        <span className={`text-xs px-2 py-1 rounded-full ${item?.manuscript_status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {item?.manuscript_status || 'Unknown'}
                                        </span>
                                        {needsUpdate ? (
                                            <button className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 cursor-pointer"
                                                onClick={() => handleUpdateClick(item.id)}
                                            >
                                                Update Required
                                            </button>
                                        ) : (
                                            <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700">Up to date</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                    <span>ID: {item.id}</span>
                                    <span>Author: {item.username}</span>
                                    <span>Submitted: {formatDate(item.created_at)}</span>
                                </div>

                                {/* {Array.isArray(item?.assignmen) && item.assignmen.length > 0 && (
                                    <div className="mt-4 border-t border-gray-100 pt-3">
                                        <div className="text-sm font-medium mb-2">Assignments</div>
                                        <div className="flex flex-col gap-3">
                                            {item.assignmen.map((asgn) => {
                                                const hasMessages = Array.isArray(asgn?.messages) && asgn.messages.length > 0;
                                                return (
                                                    <div key={asgn.id} className="rounded border border-gray-200 p-3">
                                                        <div className="flex flex-wrap items-center gap-2 text-sm">
                                                            <span className="px-2 py-0.5 rounded bg-gray-100">#{asgn.id}</span>
                                                            <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">Reviewer: {asgn.assigned_to}</span>
                                                            <span className="px-2 py-0.5 rounded bg-purple-50 text-purple-700 capitalize">{asgn.status}</span>
                                                            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 capitalize">{asgn.reviewer_status?.replace('_', ' ')}</span>
                                                        </div>
                                                        <div className="mt-2">
                                                            {hasMessages ? (
                                                                <div className="flex flex-col gap-2">
                                                                    {asgn.messages.map((msg, idx) => {
                                                                        const fileUrl = resolveFileUrl(msg?.image);
                                                                        return (
                                                                            <div key={idx} className="p-2 bg-gray-50 rounded">
                                                                                <p className="text-sm text-gray-800">{msg?.message_to_author || 'No message provided.'}</p>
                                                                                <div className="mt-1 text-xs text-gray-600">
                                                                                    <span className="font-medium">Attached File: </span>
                                                                                    {fileUrl ? (
                                                                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a>
                                                                                    ) : (
                                                                                        <span>None</span>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <p className="text-xs text-gray-500">No reviewer message yet.</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default AuthorViewSubmittedManuscript
