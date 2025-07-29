-- Insert the prize structure data
INSERT INTO prize_structure (position, prize_amount, prize_description) VALUES 
(1, 2000000, '₦20,000'),
(2, 1000000, '₦10,000'),
(3, 500000, '₦5,000'),
(4, 300000, '₦3,000'),
(5, 200000, '₦2,000')
ON CONFLICT (position) DO UPDATE SET 
  prize_amount = EXCLUDED.prize_amount,
  prize_description = EXCLUDED.prize_description;