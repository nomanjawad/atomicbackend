import { Icon } from "@iconify/react/dist/iconify.js"
import React, { useState, useEffect } from "react"
import ReactApexChart from "react-apexcharts"
import { analyticsAPI } from "../../services/api"
import DashboardSkeleton, { FilterBarSkeleton, StatCardSkeleton } from "./DashboardSkeleton"

const UnitCountTwo = () => {
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    uniqueVisitors: 0,
    todayVisitors: 0,
    weekVisitors: 0,
    monthVisitors: 0,
    deviceBreakdown: {},
    browserBreakdown: {},
    osBreakdown: {},
    hourlyBreakdown: Array(24).fill(0),
    dailyBreakdown: Array(7).fill(0),
    dailyLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    weeklyBreakdown: Array(4).fill(0),
    weeklyLabels: ['Week 4', 'Week 3', 'Week 2', 'Week 1'],
    last7DaysBreakdown: Array(7).fill(0),
    last7DaysLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    dailyDesktopBreakdown: Array(7).fill(0),
    dailyMobileBreakdown: Array(7).fill(0)
  })
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const fetchAnalytics = async (start = null, end = null) => {
    setLoading(true)
    try {
      const response = await analyticsAPI.getSummary(start, end)
      if (response.success) {
        setAnalytics(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const handleFilter = () => {
    fetchAnalytics(startDate || null, endDate || null)
  }

  const handleClearFilter = () => {
    setStartDate('')
    setEndDate('')
    fetchAnalytics()
  }

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0'
  }

  // Get device count
  const getDeviceCount = (type) => {
    return analytics.deviceBreakdown?.[type] || 0
  }

  // Create mini sparkline chart with actual data
  const createMiniChart = (data, color, labels = []) => {
    const series = [{
      name: 'Visitors',
      data: data || []
    }]

    const options = {
      chart: {
        type: 'area',
        width: 80,
        height: 42,
        sparkline: { enabled: true },
        toolbar: { show: false }
      },
      stroke: {
        curve: 'smooth',
        width: 2,
        colors: [color]
      },
      fill: {
        type: 'gradient',
        colors: [color],
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.5,
          gradientToColors: [`${color}00`],
          opacityFrom: 0.75,
          opacityTo: 0.3,
          stops: [0, 100]
        }
      },
      markers: {
        colors: [color],
        strokeWidth: 2,
        size: 0,
        hover: { size: 6 }
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val) => val,
          title: { formatter: () => '' }
        }
      },
      xaxis: {
        categories: labels,
        labels: { show: false }
      },
      yaxis: { labels: { show: false } }
    }

    return (
      <ReactApexChart
        options={options}
        series={series}
        type="area"
        height={42}
        width={80}
      />
    )
  }

  // Show skeleton when initially loading (no data yet)
  if (loading && analytics.totalVisitors === 0) {
    return <DashboardSkeleton />
  }

  return (
    <div className="col-xxl-8">
      {/* Date Filter */}
      <div className="card p-3 shadow-2 radius-8 border mb-4">
        <div className="d-flex flex-wrap align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <Icon icon="mdi:calendar-filter" className="text-primary-600" style={{ fontSize: '24px' }} />
            <span className="fw-semibold text-secondary-light">Filter by Date:</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="date"
              className="form-control form-control-sm radius-8"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{ width: '150px' }}
            />
            <span className="text-secondary-light">to</span>
            <input
              type="date"
              className="form-control form-control-sm radius-8"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{ width: '150px' }}
            />
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-primary btn-sm px-16 py-8 radius-8"
              onClick={handleFilter}
            >
              <Icon icon="mdi:filter" className="me-4" />
              Apply
            </button>
            {(startDate || endDate) && (
              <button
                className="btn btn-outline-secondary btn-sm px-16 py-8 radius-8"
                onClick={handleClearFilter}
              >
                <Icon icon="mdi:close" className="me-4" />
                Clear
              </button>
            )}
          </div>
          {(startDate || endDate) && (
            <span className="badge bg-primary-50 text-primary-600 px-12 py-6 radius-8">
              Showing: {startDate || 'All'} - {endDate || 'Now'}
            </span>
          )}
        </div>
      </div>

      <div className="row gy-4">
        {/* Today's Visitors */}
        <div className="col-xxl-4 col-sm-6">
          <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-1">
            <div className="card-body p-0">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                <div className="d-flex align-items-center gap-2">
                  <span className="mb-0 w-48-px h-48-px bg-primary-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                    <Icon icon="fa-solid:users" className="icon" />
                  </span>
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-sm">
                      Today's Visitors
                    </span>
                    <h6 className="fw-semibold">
                      {loading ? '...' : formatNumber(analytics.todayVisitors)}
                    </h6>
                  </div>
                </div>
                <div
                  id="new-user-chart"
                  className="remove-tooltip-title rounded-tooltip-value"
                >
                  {createMiniChart(
                    analytics.hourlyBreakdown?.slice(-12) || [],
                    "#487fff",
                    ['12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h', '21h', '22h', '23h']
                  )}
                </div>
              </div>
              <p className="text-sm mb-0">
                <span className="bg-primary-50 px-1 rounded-2 fw-medium text-primary-600 text-sm">
                  Live
                </span>{" "}
                visitors today
              </p>
            </div>
          </div>
        </div>

        {/* Weekly Visitors */}
        <div className="col-xxl-4 col-sm-6">
          <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-2">
            <div className="card-body p-0">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                <div className="d-flex align-items-center gap-2">
                  <span className="mb-0 w-48-px h-48-px bg-success-main flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6">
                    <Icon icon="fa-solid:calendar-week" className="icon" />
                  </span>
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-sm">
                      Weekly Visitors
                    </span>
                    <h6 className="fw-semibold">
                      {loading ? '...' : formatNumber(analytics.weekVisitors)}
                    </h6>
                  </div>
                </div>
                <div
                  id="active-user-chart"
                  className="remove-tooltip-title rounded-tooltip-value"
                >
                  {createMiniChart(
                    analytics.dailyBreakdown || [],
                    "#45b369",
                    analytics.dailyLabels || ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
                  )}
                </div>
              </div>
              <p className="text-sm mb-0">
                Last{" "}
                <span className="bg-success-focus px-1 rounded-2 fw-medium text-success-main text-sm">
                  7 days
                </span>{" "}
                visitors
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Visitors */}
        <div className="col-xxl-4 col-sm-6">
          <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-3">
            <div className="card-body p-0">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                <div className="d-flex align-items-center gap-2">
                  <span className="mb-0 w-48-px h-48-px bg-yellow text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                    <Icon icon="fa-solid:calendar-alt" className="icon" />
                  </span>
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-sm">
                      Monthly Visitors
                    </span>
                    <h6 className="fw-semibold">
                      {loading ? '...' : formatNumber(analytics.monthVisitors)}
                    </h6>
                  </div>
                </div>
                <div
                  id="total-sales-chart"
                  className="remove-tooltip-title rounded-tooltip-value"
                >
                  {createMiniChart(
                    analytics.weeklyBreakdown || [],
                    "#f4941e",
                    analytics.weeklyLabels || ['Week 4', 'Week 3', 'Week 2', 'Week 1']
                  )}
                </div>
              </div>
              <p className="text-sm mb-0">
                Last{" "}
                <span className="bg-warning-focus px-1 rounded-2 fw-medium text-warning-main text-sm">
                  30 days
                </span>{" "}
                visitors
              </p>
            </div>
          </div>
        </div>

        {/* Total/Filtered Visitors */}
        <div className="col-xxl-4 col-sm-6">
          <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-4">
            <div className="card-body p-0">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                <div className="d-flex align-items-center gap-2">
                  <span className="mb-0 w-48-px h-48-px bg-purple text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                    <Icon icon="fa-solid:chart-line" className="icon" />
                  </span>
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-sm">
                      {(startDate || endDate) ? 'Filtered Total' : 'Total Visitors'}
                    </span>
                    <h6 className="fw-semibold">
                      {loading ? '...' : formatNumber(analytics.totalVisitors)}
                    </h6>
                  </div>
                </div>
                <div
                  id="conversion-user-chart"
                  className="remove-tooltip-title rounded-tooltip-value"
                >
                  {createMiniChart(
                    analytics.last7DaysBreakdown || [],
                    "#8252e9",
                    analytics.last7DaysLabels || []
                  )}
                </div>
              </div>
              <p className="text-sm mb-0">
                <span className="bg-purple-50 px-1 rounded-2 fw-medium text-purple text-sm">
                  {formatNumber(analytics.uniqueVisitors)}
                </span>{" "}
                unique visitors
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Visitors */}
        <div className="col-xxl-4 col-sm-6">
          <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-5">
            <div className="card-body p-0">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                <div className="d-flex align-items-center gap-2">
                  <span className="mb-0 w-48-px h-48-px bg-pink text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                    <Icon icon="fa-solid:desktop" className="icon" />
                  </span>
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-sm">
                      Desktop Visitors
                    </span>
                    <h6 className="fw-semibold">
                      {loading ? '...' : formatNumber(getDeviceCount('Desktop'))}
                    </h6>
                  </div>
                </div>
                <div
                  id="leads-chart"
                  className="remove-tooltip-title rounded-tooltip-value"
                >
                  {createMiniChart(
                    analytics.dailyDesktopBreakdown || [],
                    "#de3ace",
                    analytics.dailyLabels || []
                  )}
                </div>
              </div>
              <p className="text-sm mb-0">
                <span className="bg-pink-50 px-1 rounded-2 fw-medium text-pink text-sm">
                  {analytics.totalVisitors > 0
                    ? Math.round((getDeviceCount('Desktop') / analytics.totalVisitors) * 100)
                    : 0}%
                </span>{" "}
                of total
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Visitors */}
        <div className="col-xxl-4 col-sm-6">
          <div className="card p-3 shadow-2 radius-8 border input-form-light h-100 bg-gradient-end-6">
            <div className="card-body p-0">
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                <div className="d-flex align-items-center gap-2">
                  <span className="mb-0 w-48-px h-48-px bg-cyan text-white flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                    <Icon icon="fa-solid:mobile-alt" className="icon" />
                  </span>
                  <div>
                    <span className="mb-2 fw-medium text-secondary-light text-sm">
                      Mobile Visitors
                    </span>
                    <h6 className="fw-semibold">
                      {loading ? '...' : formatNumber(getDeviceCount('Mobile'))}
                    </h6>
                  </div>
                </div>
                <div
                  id="total-profit-chart"
                  className="remove-tooltip-title rounded-tooltip-value"
                >
                  {createMiniChart(
                    analytics.dailyMobileBreakdown || [],
                    "#00b8f2",
                    analytics.dailyLabels || []
                  )}
                </div>
              </div>
              <p className="text-sm mb-0">
                <span className="bg-cyan-50 px-1 rounded-2 fw-medium text-cyan text-sm">
                  {analytics.totalVisitors > 0
                    ? Math.round((getDeviceCount('Mobile') / analytics.totalVisitors) * 100)
                    : 0}%
                </span>{" "}
                of total
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnitCountTwo
