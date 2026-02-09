import React, { useState, useEffect } from "react"
import ReactApexChart from "react-apexcharts"
import { Icon } from "@iconify/react/dist/iconify.js"
import { ChartCardSkeleton } from "./DashboardSkeleton"
import { analyticsAPI } from "../../services/api"

const EarningStaticOne = () => {
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState({
    totalVisitors: 0,
    totalPageViews: 0,
    bounceRate: 0,
    avgPagesPerSession: 0,
    last7DaysBreakdown: Array(7).fill(0),
    last7DaysLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await analyticsAPI.getSummary()
        if (response.success) {
          setAnalytics({
            totalVisitors: response.data.totalVisitors || 0,
            totalPageViews: response.data.totalPageViews || 0,
            bounceRate: response.data.bounceRate || 0,
            avgPagesPerSession: response.data.avgPagesPerSession || 0,
            last7DaysBreakdown: response.data.last7DaysBreakdown || Array(7).fill(0),
            last7DaysLabels: response.data.last7DaysLabels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          })
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  // Format number with K/M suffix
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toLocaleString()
  }

  // Dynamic chart options based on real data
  const chartOptions = {
    chart: {
      type: 'bar',
      height: 310,
      toolbar: { show: false },
      fontFamily: 'inherit'
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
        dataLabels: { position: 'top' }
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: analytics.last7DaysLabels,
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        }
      },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: {
          colors: '#64748b',
          fontSize: '12px'
        },
        formatter: (val) => Math.round(val)
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.25,
        gradientToColors: ['#6366f1'],
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.85,
        stops: [0, 100]
      }
    },
    colors: ['#487fff'],
    grid: {
      borderColor: '#e2e8f0',
      strokeDashArray: 4,
      xaxis: { lines: { show: false } }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} visitors`
      }
    }
  }

  const chartSeries = [{
    name: 'Visitors',
    data: analytics.last7DaysBreakdown
  }]

  if (loading) {
    return (
      <div className="col-xxl-8">
        <ChartCardSkeleton />
      </div>
    )
  }

  return (
    <div className="col-xxl-8">
      <div className="card h-100 radius-8 border-0">
        <div className="card-body p-24">
          <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between">
            <div>
              <h6 className="mb-2 fw-bold text-lg">Visitors Statistic</h6>
              <span className="text-sm fw-medium text-secondary-light">
                Last 7 days overview
              </span>
            </div>
          </div>
          <div className="mt-20 d-flex justify-content-center flex-wrap gap-3">
            <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
              <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                <Icon icon="fa-solid:users" className="icon" />
              </span>
              <div>
                <span className="text-secondary-light text-sm fw-medium">
                  Visitors
                </span>
                <h6 className="text-md fw-semibold mb-0">
                  {formatNumber(analytics.totalVisitors)}
                </h6>
              </div>
            </div>
            <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
              <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                <Icon icon="fa-solid:eye" className="icon" />
              </span>
              <div>
                <span className="text-secondary-light text-sm fw-medium">
                  Page Views
                </span>
                <h6 className="text-md fw-semibold mb-0">
                  {formatNumber(analytics.totalPageViews)}
                </h6>
              </div>
            </div>
            <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
              <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                <Icon icon="fa-solid:chart-pie" className="icon" />
              </span>
              <div>
                <span className="text-secondary-light text-sm fw-medium">
                  Bounce Rate
                </span>
                <h6 className="text-md fw-semibold mb-0">{analytics.bounceRate}%</h6>
              </div>
            </div>
            <div className="d-inline-flex align-items-center gap-2 p-2 radius-8 border pe-36 br-hover-primary group-item">
              <span className="bg-neutral-100 w-44-px h-44-px text-xxl radius-8 d-flex justify-content-center align-items-center text-secondary-light group-hover:bg-primary-600 group-hover:text-white">
                <Icon icon="fa-solid:layer-group" className="icon" />
              </span>
              <div>
                <span className="text-secondary-light text-sm fw-medium">
                  Avg. Pages/Session
                </span>
                <h6 className="text-md fw-semibold mb-0">{analytics.avgPagesPerSession}</h6>
              </div>
            </div>
          </div>
          <div id="barChart" className="mt-20">
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={310}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EarningStaticOne
