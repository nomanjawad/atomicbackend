import React from 'react'
import './DashboardSkeleton.css'

// Individual skeleton elements
export const SkeletonText = ({ width = '100%', height = '16px', className = '' }) => (
    <div
        className={`skeleton-element ${className}`}
        style={{ width, height, borderRadius: '4px' }}
    />
)

export const SkeletonCircle = ({ size = '48px', className = '' }) => (
    <div
        className={`skeleton-element ${className}`}
        style={{ width: size, height: size, borderRadius: '50%' }}
    />
)

export const SkeletonRectangle = ({ width = '100%', height = '100px', className = '', borderRadius = '8px' }) => (
    <div
        className={`skeleton-element ${className}`}
        style={{ width, height, borderRadius }}
    />
)

// Skeleton for stat cards (like in UnitCountTwo) - with visible skeleton elements
export const StatCardSkeleton = ({ bgClass = '' }) => (
    <div className={`card p-3 shadow-2 radius-8 border input-form-light h-100 ${bgClass}`}>
        <div className="card-body p-0">
            <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                <div className="d-flex align-items-center gap-2">
                    {/* Icon placeholder with visible background */}
                    <div
                        className="skeleton-stat-icon"
                        style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.08) 100%)',
                            backgroundSize: '200% 100%',
                            animation: 'skeleton-shimmer 1.5s ease-in-out infinite'
                        }}
                    />
                    <div>
                        {/* Label placeholder */}
                        <div
                            style={{
                                width: '100px',
                                height: '12px',
                                borderRadius: '4px',
                                marginBottom: '8px',
                                background: 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.06) 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'skeleton-shimmer 1.5s ease-in-out infinite'
                            }}
                        />
                        {/* Value placeholder */}
                        <div
                            style={{
                                width: '70px',
                                height: '22px',
                                borderRadius: '4px',
                                background: 'linear-gradient(90deg, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.14) 50%, rgba(0,0,0,0.08) 100%)',
                                backgroundSize: '200% 100%',
                                animation: 'skeleton-shimmer 1.5s ease-in-out infinite'
                            }}
                        />
                    </div>
                </div>
                {/* Chart placeholder */}
                <div
                    style={{
                        width: '80px',
                        height: '42px',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.05) 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'skeleton-shimmer 1.5s ease-in-out infinite'
                    }}
                />
            </div>
            {/* Bottom text placeholder */}
            <div
                style={{
                    width: '130px',
                    height: '14px',
                    borderRadius: '4px',
                    background: 'linear-gradient(90deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.05) 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'skeleton-shimmer 1.5s ease-in-out infinite'
                }}
            />
        </div>
    </div>
)

// Skeleton for the filter bar
export const FilterBarSkeleton = () => (
    <div className="card p-3 shadow-2 radius-8 border mb-4">
        <div className="d-flex flex-wrap align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
                <SkeletonCircle size="24px" />
                <SkeletonText width="100px" height="16px" />
            </div>
            <div className="d-flex align-items-center gap-2">
                <SkeletonRectangle width="150px" height="38px" borderRadius="8px" />
                <SkeletonText width="20px" height="16px" />
                <SkeletonRectangle width="150px" height="38px" borderRadius="8px" />
            </div>
            <SkeletonRectangle width="80px" height="38px" borderRadius="8px" />
        </div>
    </div>
)

// Skeleton for campaign/site visit card
export const SiteVisitSkeleton = () => (
    <div className="card h-100 radius-8 border-0">
        <div className="card-body p-24">
            <SkeletonText width="140px" height="20px" className="mb-4" />
            <div className="mt-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div key={item} className="d-flex align-items-center justify-content-between gap-3 mb-12">
                        <div className="d-flex align-items-center">
                            <SkeletonCircle size="24px" />
                            <SkeletonText width="70px" height="14px" className="ms-12" />
                        </div>
                        <div className="d-flex align-items-center gap-2 w-100">
                            <div className="w-100 max-w-66 ms-auto">
                                <SkeletonRectangle width="100%" height="8px" borderRadius="4px" />
                            </div>
                            <SkeletonText width="30px" height="14px" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
)

// Skeleton for the main chart card
export const ChartCardSkeleton = () => (
    <div className="card h-100 radius-8 border-0">
        <div className="card-body p-24">
            <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-3">
                <div>
                    <SkeletonText width="160px" height="20px" className="mb-2" />
                    <SkeletonText width="120px" height="14px" />
                </div>
            </div>
            <div className="mt-20 d-flex justify-content-center flex-wrap gap-3 mb-4">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36">
                        <SkeletonRectangle width="44px" height="44px" borderRadius="8px" />
                        <div>
                            <SkeletonText width="60px" height="14px" className="mb-1" />
                            <SkeletonText width="50px" height="18px" />
                        </div>
                    </div>
                ))}
            </div>
            <SkeletonRectangle width="100%" height="280px" borderRadius="8px" />
        </div>
    </div>
)

// Skeleton for country/map card
export const MapCardSkeleton = () => (
    <div className="card radius-8 border-0">
        <div className="card-body">
            <SkeletonText width="160px" height="20px" className="mb-2" />
        </div>
        <SkeletonRectangle width="100%" height="200px" borderRadius="0" />
        <div className="card-body p-24">
            {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="d-flex align-items-center justify-content-between gap-3 mb-3 pb-2">
                    <div className="d-flex align-items-center w-100">
                        <SkeletonCircle size="40px" className="me-12" />
                        <div className="flex-grow-1">
                            <SkeletonText width="80px" height="14px" className="mb-1" />
                            <SkeletonText width="60px" height="12px" />
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 w-100">
                        <div className="w-100 max-w-66 ms-auto">
                            <SkeletonRectangle width="100%" height="8px" borderRadius="4px" />
                        </div>
                        <SkeletonText width="30px" height="14px" />
                    </div>
                </div>
            ))}
        </div>
    </div>
)

// Full Dashboard Skeleton
const DashboardSkeleton = () => (
    <div className="col-xxl-8">
        <FilterBarSkeleton />
        <div className="row gy-4">
            {/* 6 stat cards */}
            <div className="col-xxl-4 col-sm-6">
                <StatCardSkeleton bgClass="bg-gradient-end-1" />
            </div>
            <div className="col-xxl-4 col-sm-6">
                <StatCardSkeleton bgClass="bg-gradient-end-2" />
            </div>
            <div className="col-xxl-4 col-sm-6">
                <StatCardSkeleton bgClass="bg-gradient-end-3" />
            </div>
            <div className="col-xxl-4 col-sm-6">
                <StatCardSkeleton bgClass="bg-gradient-end-4" />
            </div>
            <div className="col-xxl-4 col-sm-6">
                <StatCardSkeleton bgClass="bg-gradient-end-5" />
            </div>
            <div className="col-xxl-4 col-sm-6">
                <StatCardSkeleton bgClass="bg-gradient-end-6" />
            </div>
        </div>
    </div>
)

export default DashboardSkeleton
