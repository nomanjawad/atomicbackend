import React, { useState, useEffect } from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import { analyticsAPI } from "../services/api";
import { Icon } from "@iconify/react/dist/iconify.js";

const RawDataPage = () => {
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const limit = 20;

    const fetchVisitors = async (pageNum) => {
        setLoading(true);
        try {
            const response = await analyticsAPI.getVisitors(pageNum, limit);
            if (response.success) {
                setVisitors(response.data);
                setTotal(response.pagination?.total || 0);
                setTotalPages(Math.ceil((response.pagination?.total || 0) / limit));
            }
        } catch (error) {
            console.error("Failed to fetch visitors:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVisitors(page);
    }, [page]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType?.toLowerCase()) {
            case "mobile":
                return "mdi:cellphone";
            case "tablet":
                return "mdi:tablet";
            default:
                return "mdi:monitor";
        }
    };

    const getBrowserIcon = (browser) => {
        switch (browser?.toLowerCase()) {
            case "chrome":
                return "mdi:google-chrome";
            case "firefox":
                return "mdi:firefox";
            case "safari":
                return "mdi:apple-safari";
            case "edge":
                return "mdi:microsoft-edge";
            case "opera":
                return "simple-icons:opera";
            default:
                return "mdi:web";
        }
    };

    return (
        <MasterLayout>
            <Breadcrumb title="Raw Visitor Data" />

            <div className="card h-100 p-0 radius-12">
                <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="d-flex align-items-center flex-wrap gap-3">
                        <h6 className="text-lg fw-semibold mb-0">
                            <Icon icon="mdi:database-eye" className="me-8 text-primary-600" />
                            All Visitor Records
                        </h6>
                        <span className="badge bg-primary-50 text-primary-600 px-12 py-6 radius-8">
                            {total.toLocaleString()} total visitors
                        </span>
                    </div>
                    <button
                        className="btn btn-primary-600 radius-8 px-20 py-11"
                        onClick={() => fetchVisitors(page)}
                        disabled={loading}
                    >
                        <Icon icon="mdi:refresh" className={`me-8 ${loading ? 'spinning' : ''}`} />
                        Refresh
                    </button>
                </div>

                <div className="card-body p-24">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-secondary-light">Loading visitor data...</p>
                        </div>
                    ) : visitors.length === 0 ? (
                        <div className="text-center py-5">
                            <Icon icon="mdi:database-off" className="text-secondary-light" style={{ fontSize: "64px" }} />
                            <p className="mt-3 text-secondary-light">No visitor data found</p>
                        </div>
                    ) : (
                        <>
                            <div className="table-responsive scroll-sm">
                                <table className="table bordered-table sm-table mb-0">
                                    <thead>
                                        <tr>
                                            <th scope="col">#</th>
                                            <th scope="col">IP Address</th>
                                            <th scope="col">Device</th>
                                            <th scope="col">Browser</th>
                                            <th scope="col">OS</th>
                                            <th scope="col">Page</th>
                                            <th scope="col">Referrer</th>
                                            <th scope="col">Visit Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {visitors.map((visitor, index) => (
                                            <tr key={visitor.id}>
                                                <td>{(page - 1) * limit + index + 1}</td>
                                                <td>
                                                    <code className="bg-neutral-100 px-8 py-4 radius-4">
                                                        {visitor.ipAddress}
                                                    </code>
                                                </td>
                                                <td>
                                                    <span className="d-flex align-items-center gap-8">
                                                        <Icon icon={getDeviceIcon(visitor.deviceType)} className="text-primary-600" />
                                                        {visitor.deviceType || "Unknown"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className="d-flex align-items-center gap-8">
                                                        <Icon icon={getBrowserIcon(visitor.browser)} className="text-info-main" />
                                                        {visitor.browser || "Unknown"}
                                                    </span>
                                                </td>
                                                <td>{visitor.os || "Unknown"}</td>
                                                <td>
                                                    <span className="text-primary-600" title={visitor.pageUrl}>
                                                        {visitor.pageUrl?.length > 30
                                                            ? visitor.pageUrl.substring(0, 30) + "..."
                                                            : visitor.pageUrl || "/"}
                                                    </span>
                                                </td>
                                                <td>
                                                    {visitor.referrer ? (
                                                        <span className="text-secondary-light" title={visitor.referrer}>
                                                            {visitor.referrer.length > 25
                                                                ? visitor.referrer.substring(0, 25) + "..."
                                                                : visitor.referrer}
                                                        </span>
                                                    ) : (
                                                        <span className="text-secondary-light">Direct</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className="text-secondary-light">
                                                        {formatDate(visitor.visitedAt)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                                <span className="text-secondary-light">
                                    Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} entries
                                </span>
                                <ul className="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                                    <li className="page-item">
                                        <button
                                            className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page === 1}
                                        >
                                            <Icon icon="ep:d-arrow-left" />
                                        </button>
                                    </li>
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = i + 1;
                                        } else if (page <= 3) {
                                            pageNum = i + 1;
                                        } else if (page >= totalPages - 2) {
                                            pageNum = totalPages - 4 + i;
                                        } else {
                                            pageNum = page - 2 + i;
                                        }
                                        return (
                                            <li className="page-item" key={pageNum}>
                                                <button
                                                    className={`page-link fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md ${page === pageNum
                                                            ? "bg-primary-600 text-white"
                                                            : "bg-neutral-200 text-secondary-light"
                                                        }`}
                                                    onClick={() => setPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            </li>
                                        );
                                    })}
                                    <li className="page-item">
                                        <button
                                            className="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px text-md"
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page === totalPages}
                                        >
                                            <Icon icon="ep:d-arrow-right" />
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </MasterLayout>
    );
};

export default RawDataPage;
