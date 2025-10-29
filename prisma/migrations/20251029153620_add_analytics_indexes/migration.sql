-- Analytics Performance Indexes
-- Adds indexes to optimize analytics queries

-- Booking indexes for analytics
CREATE INDEX idx_booking_created_at ON booking(createdAt);
CREATE INDEX idx_booking_status ON booking(status);
CREATE INDEX idx_booking_payment_status ON booking(paymentStatus);
CREATE INDEX idx_booking_phone ON booking(phoneNumber);
CREATE INDEX idx_booking_client_type ON booking(clientType);
CREATE INDEX idx_booking_referral_source ON booking(referralSource);
CREATE INDEX idx_booking_active ON booking(isActive);

-- Booking item indexes for repair analytics
CREATE INDEX idx_booking_item_status ON booking_item(status);
CREATE INDEX idx_booking_item_type ON booking_item(type);
CREATE INDEX idx_booking_item_booking_id ON booking_item(bookingId);
CREATE INDEX idx_booking_item_active ON booking_item(isActive);

-- Booking payment indexes for financial analytics
CREATE INDEX idx_booking_payment_status ON booking_payment(status);
CREATE INDEX idx_booking_payment_booking_id ON booking_payment(bookingId);

-- Warranty indexes for warranty analytics
CREATE INDEX idx_warranty_active ON warranty(isActive);
CREATE INDEX idx_warranty_dates ON warranty(warrantyStartDate, warrantyEndDate);
CREATE INDEX idx_warranty_booking_item ON warranty(bookingItemId);

-- Warranty claim indexes
CREATE INDEX idx_warranty_claim_created ON warranty_claim(createdAt);
CREATE INDEX idx_warranty_claim_booking ON warranty_claim(claimBookingId);
