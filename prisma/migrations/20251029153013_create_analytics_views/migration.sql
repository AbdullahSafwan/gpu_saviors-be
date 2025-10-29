-- Analytics Views Migration
-- Creates 4 views for business analytics and reporting

-- View 1: Customer Statistics
-- Aggregates customer data by phone number (unique customer identifier)
CREATE OR REPLACE VIEW customer_first_booking AS
SELECT
  phoneNumber,
  MIN(createdAt) as firstBookingDate,
  COUNT(*) as totalBookings,
  SUM(COALESCE(payableAmount, 0)) as totalRevenue,
  SUM(COALESCE(paidAmount, 0)) as totalPaid
FROM booking
WHERE isActive = 1
GROUP BY phoneNumber;

-- View 2: Revenue by Payment Status
-- Breaks down revenue by payment status (PAID, PARTIAL_PAID, PENDING)
CREATE OR REPLACE VIEW revenue_by_payment_status AS
SELECT
  paymentStatus,
  COUNT(*) as bookingCount,
  SUM(COALESCE(payableAmount, 0)) as totalRevenue,
  SUM(COALESCE(paidAmount, 0)) as totalCollected,
  SUM(COALESCE(payableAmount, 0) - COALESCE(paidAmount, 0)) as outstanding
FROM booking
WHERE status = 'COMPLETED' AND isActive = 1
GROUP BY paymentStatus;

-- View 3: Repair Statistics by Type
-- Aggregates repair success rates by item type (GPU, MOBO, LAPTOP)
CREATE OR REPLACE VIEW repair_stats_by_type AS
SELECT
  bi.type,
  COUNT(*) as totalItems,
  COUNT(CASE WHEN bi.status = 'REPAIRED' THEN 1 END) as repaired,
  COUNT(CASE WHEN bi.status = 'NOT_REPAIRED' THEN 1 END) as notRepaired,
  CAST(COUNT(CASE WHEN bi.status = 'REPAIRED' THEN 1 END) * 100.0 /
   NULLIF(COUNT(CASE WHEN bi.status IN ('REPAIRED', 'NOT_REPAIRED') THEN 1 END), 0) AS DECIMAL(5,2)) as successRate,
  CAST(AVG(DATEDIFF(bi.modifiedAt, bi.createdAt)) AS DECIMAL(10,2)) as avgRepairDays
FROM booking_item bi
JOIN booking b ON bi.bookingId = b.id
WHERE bi.status IN ('REPAIRED', 'NOT_REPAIRED') AND bi.isActive = 1 AND b.isActive = 1
GROUP BY bi.type;

-- View 4: Daily Revenue Summary
-- Aggregates revenue by date for trend analysis
CREATE OR REPLACE VIEW daily_revenue_summary AS
SELECT
  DATE(createdAt) as date,
  COUNT(*) as bookings,
  SUM(COALESCE(payableAmount, 0)) as revenue,
  SUM(COALESCE(paidAmount, 0)) as collected,
  SUM(COALESCE(payableAmount, 0) - COALESCE(paidAmount, 0)) as outstanding
FROM booking
WHERE status = 'COMPLETED' AND isActive = 1
GROUP BY DATE(createdAt);
