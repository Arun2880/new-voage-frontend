import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import BASE_URL from '../../../config';
import PageTitle from '../../../components/PageTitle';

const StudentSelfNotice = () => {
    const token = sessionStorage.getItem("token");
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        Getnoticelist();
    }, []);

    const Getnoticelist = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/getnotice`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.data.error) {
                setNotices(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    return (
        <>
            <PageTitle page={"All Notices"} />
            <div className="container mt-4">
                {notices.map((notice) => (
                    <div key={notice._id} className="card mb-3 p-3 shadow-sm">
                        <div className="d-flex align-items-center">
                            <div className="me-3">
                                <span className="fw-bold text-primary">Voage Learning | Mentor</span>
                                <br />
                                <span className="text-muted">{new Date(notice.noticedate).toLocaleDateString()}</span>
                            </div>
                            <div className="ms-auto">
                                <span className="badge bg-warning">Event Invitation</span>
                            </div>
                        </div>
                        <hr />
                        <h5 className="fw-bold">{notice.subject}</h5>
                        <p>{notice.message}</p>
                        {notice.noticeimage && (
                            <div>
                                <strong className="text-danger">Attachments:</strong>
                                <div className="mt-2">
                                    {notice.noticeimage.endsWith(".pdf") ? (
                                        <a 
                                            href={`http://localhost:5000/uploads/notices/${notice.noticeimage}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="d-inline-block"
                                        >
                                            <img 
                                                src="https://cdn-icons-png.flaticon.com/512/337/337946.png"
                                                alt="PDF Document"
                                                style={{ 
                                                    width: '60px', 
                                                    height: '60px',
                                                    border: '2px solid #dc3545',
                                                    borderRadius: '5px',
                                                    padding: '5px',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </a>
                                    ) : (
                                        <a 
                                            href={`http://localhost:5000/uploads/notices/${notice.noticeimage}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            <img 
                                                src={`http://localhost:5000/uploads/notices/${notice.noticeimage}`} 
                                                alt="Notice Attachment" 
                                                style={{ 
                                                    maxWidth: '60px',
                                                    border: '2px solid #ddd',
                                                    borderRadius: '5px',
                                                    padding: '5px'
                                                }}
                                                className="img-thumbnail"
                                            />
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default StudentSelfNotice;