-- Insert the prize structure data
INSERT INTO prize_structure (position, prize_amount, prize_description) VALUES 
(1, 1000000, '₦10,000'),
(2, 500000, '₦5,000'),
(3, 300000, '₦3,000'),
(4, 100000, '₦1,000'),
(5, 100000, '₦1,000')
ON CONFLICT (position) DO UPDATE SET 
  prize_amount = EXCLUDED.prize_amount,
  prize_description = EXCLUDED.prize_description;